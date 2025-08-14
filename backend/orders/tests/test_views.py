from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from decimal import Decimal

from users.models import User
from restaurants.models import Restaurant, Menu, MenuItem
from orders.models import Order, OrderItem, Payment


class OrderAPITests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_user(
			email="admin@example.com", username="admin", password="adminpass", role="admin"
		)
		self.owner = User.objects.create_user(
			email="owner@example.com", username="owner", password="ownerpass", role="restaurant_owner"
		)
		self.customer = User.objects.create_user(
			email="customer@example.com", username="customer", password="customerpass", role="customer"
		)

		self.restaurant = Restaurant.objects.create(
			owner=self.owner,
			name="Test Resto",
			address="123 Street",
			city="HCM",
			phone="0909000000",
			email="resto@test.com",
			description="Nice",
			status="active",
		)
		self.menu = Menu.objects.create(restaurant=self.restaurant, title="Main", description="All")
		self.item1 = MenuItem.objects.create(
			menu=self.menu,
			name="Pho",
			description="Pho bo",
			price=Decimal("70000.00"),
			category="pho",
			discount=Decimal("0.00"),
		)
		self.item2 = MenuItem.objects.create(
			menu=self.menu,
			name="Coke",
			description="Drink",
			price=Decimal("10000.00"),
			category="do_uong",
			discount=Decimal("0.00"),
		)

		# Another restaurant and item to validate cross-restaurant validation
		self.owner2 = User.objects.create_user(
			email="owner2@example.com", username="owner2", password="owner2pass", role="restaurant_owner"
		)
		self.restaurant2 = Restaurant.objects.create(
			owner=self.owner2,
			name="Another Resto",
			address="456 Street",
			city="HCM",
			phone="0909111111",
			email="resto2@test.com",
			description="Nice 2",
			status="active",
		)
		self.menu2 = Menu.objects.create(restaurant=self.restaurant2, title="Menu 2", description="All")
		self.item_other = MenuItem.objects.create(
			menu=self.menu2,
			name="Com",
			description="Com tam",
			price=Decimal("50000.00"),
			category="com",
			discount=Decimal("0.00"),
		)

	def test_create_order_success(self):
		self.client.force_authenticate(self.customer)
		url = reverse("create-order")
		payload = {
			"restaurant_id": self.restaurant.id,
			"payment_method": "cash",
			"address": "123 Test Road",
			"items": [
				{"menu_item_id": self.item1.id, "quantity": 1, "note": "no spice", "price": "70000.00"},
				{"menu_item_id": self.item2.id, "quantity": 2, "price": "10000.00"},
			],
		}
		res = self.client.post(url, payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		self.assertIn("order", res.data)
		order_id = res.data["order"]["id"]
		order = Order.objects.get(id=order_id)
		self.assertEqual(order.user, self.customer)
		self.assertEqual(order.restaurant, self.restaurant)
		# total = 70000*1 + 10000*2
		self.assertEqual(order.total_amount, Decimal("90000.00"))
		self.assertIsNotNone(order.payment)
		self.assertIsNotNone(order.delivery)

	def test_create_order_items_must_belong_to_same_restaurant(self):
		self.client.force_authenticate(self.customer)
		url = reverse("create-order")
		payload = {
			"restaurant_id": self.restaurant.id,
			"payment_method": "cash",
			"items": [
				{"menu_item_id": self.item1.id, "quantity": 1, "price": "70000.00"},
				{"menu_item_id": self.item_other.id, "quantity": 1, "price": "50000.00"},
			],
		}
		res = self.client.post(url, payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

	def test_order_list_by_role(self):
		# Create orders for customer at owner's restaurant
		payment = Payment.objects.create(payment_method="cash", amount=Decimal("70000.00"), status="completed", transaction_code="TXN1")
		order = Order.objects.create(user=self.customer, restaurant=self.restaurant, total_amount=Decimal("70000.00"), status="pending", payment=payment)
		OrderItem.objects.create(order=order, menu_item=self.item1, quantity=1, price=Decimal("70000.00"))

		# Customer sees own orders
		self.client.force_authenticate(self.customer)
		res = self.client.get(reverse("order-list"))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertEqual(len(res.data.get("results", [])), 1)

		# Owner sees orders of their restaurant
		self.client.force_authenticate(self.owner)
		res = self.client.get(reverse("order-list"))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertEqual(len(res.data.get("results", [])), 1)

		# Admin sees all orders
		self.client.force_authenticate(self.admin)
		res = self.client.get(reverse("order-list"))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(res.data.get("count", 0), 1)

	def test_cancel_order_rules(self):
		self.client.force_authenticate(self.customer)
		payment = Payment.objects.create(payment_method="cash", amount=Decimal("70000.00"), status="completed", transaction_code="TXN2")
		order_pending = Order.objects.create(user=self.customer, restaurant=self.restaurant, total_amount=Decimal("70000.00"), status="pending", payment=payment)
		order_other_status = Order.objects.create(user=self.customer, restaurant=self.restaurant, total_amount=Decimal("70000.00"), status="confirmed", payment=payment)

		# Can cancel pending
		url = reverse("cancel-order", kwargs={"order_id": order_pending.id})
		res = self.client.delete(url)
		self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
		self.assertFalse(Order.objects.filter(id=order_pending.id).exists())

		# Cannot cancel non-pending
		url = reverse("cancel-order", kwargs={"order_id": order_other_status.id})
		res = self.client.delete(url)
		self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

	def test_update_status_permissions_and_validation(self):
		payment = Payment.objects.create(payment_method="cash", amount=Decimal("70000.00"), status="completed", transaction_code="TXN3")
		order = Order.objects.create(user=self.customer, restaurant=self.restaurant, total_amount=Decimal("70000.00"), status="pending", payment=payment)

		# Another owner cannot update
		self.client.force_authenticate(self.owner2)
		res = self.client.patch(reverse("update-order-status", kwargs={"order_id": order.id}), {"status": "confirmed"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

		# Another customer cannot update
		other_customer = User.objects.create_user(email="c2@example.com", username="c2", password="pass", role="customer")
		self.client.force_authenticate(other_customer)
		res = self.client.patch(reverse("update-order-status", kwargs={"order_id": order.id}), {"status": "confirmed"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

		# Owner can update
		self.client.force_authenticate(self.owner)
		res = self.client.patch(reverse("update-order-status", kwargs={"order_id": order.id}), {"status": "confirmed"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_200_OK)

		# Missing status
		res = self.client.patch(reverse("update-order-status", kwargs={"order_id": order.id}), {}, format="json")
		self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST) 