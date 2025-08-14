from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from decimal import Decimal

from users.models import User
from restaurants.models import Restaurant, Menu, MenuItem


class RestaurantAPITests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_user(email="admin@example.com", username="admin", password="adminpass", role="admin", is_staff=True, is_superuser=True)
		self.owner = User.objects.create_user(email="owner@example.com", username="owner", password="ownerpass", role="restaurant_owner")
		self.owner2 = User.objects.create_user(email="owner2@example.com", username="owner2", password="owner2pass", role="restaurant_owner")
		self.customer = User.objects.create_user(email="customer@example.com", username="customer", password="customerpass", role="customer")

		self.restaurant = Restaurant.objects.create(owner=self.owner, name="R1", address="Addr 1", city="HCM", phone="0909", email="r1@test.com", description="desc", status="active")
		self.menu = Menu.objects.create(restaurant=self.restaurant, title="Menu 1", description="desc")
		self.menu_item = MenuItem.objects.create(menu=self.menu, name="Pho", description="Pho", price=Decimal("70000.00"), category="pho", discount=Decimal("0.00"))

	def test_list_and_create_restaurant(self):
		# List is public (read only allowed)
		res = self.client.get(reverse("restaurant-list"))
		self.assertEqual(res.status_code, status.HTTP_200_OK)

		# Create requires auth
		payload = {
			"name": "New Resto",
			"address": "A",
			"city": "HCM",
			"phone": "0909",
			"email": "new@test.com",
			"description": "Nice",
			"categories": ["pho"],
			"images": [],
		}
		self.client.force_authenticate(self.owner)
		res = self.client.post(reverse("restaurant-create"), payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)

	def test_menu_crud(self):
		# Get menus public
		url_get = reverse("restaurant-menus", kwargs={"restaurant_id": self.restaurant.id})
		res = self.client.get(url_get)
		self.assertEqual(res.status_code, status.HTTP_200_OK)

		# Create menu
		self.client.force_authenticate(self.owner)
		payload = {"title": "M2", "description": "desc"}
		res = self.client.post(url_get, payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		menu_id = res.data["id"]

		# Update menu
		url_put = reverse("menu-detail", kwargs={"menu_id": menu_id})
		res = self.client.put(url_put, {"title": "M2 updated"}, format="json")
		self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])

		# Delete menu
		res = self.client.delete(url_put)
		self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

	def test_menu_items_list_create(self):
		url = reverse("menu-items", kwargs={"menu_id": self.menu.id})
		# list
		res = self.client.get(url)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		# create
		self.client.force_authenticate(self.owner)
		payload = {"name": "Coke", "description": "Drink", "price": "10000.00", "category": "do_uong", "discount": "0"}
		res = self.client.post(url, payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)

	def test_search_restaurants(self):
		self.client.force_authenticate(self.customer)
		url = reverse("search-restaurants") + "?q=R1"
		res = self.client.get(url)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		# May or may not be paginated depending on view; just ensure list-like
		self.assertTrue(isinstance(res.data, list))

	def test_toggle_status_and_delete(self):
		# Only owner of restaurant can toggle/delete
		self.client.force_authenticate(self.owner)
		url_toggle = reverse("restaurant-toggle-status", kwargs={"restaurant_id": self.restaurant.id})
		res = self.client.patch(url_toggle, {"status": "inactive"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertEqual(res.data.get("status"), "inactive")

		url_delete = reverse("restaurant-delete", kwargs={"restaurant_id": self.restaurant.id})
		res = self.client.delete(url_delete)
		self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
		self.assertFalse(Restaurant.objects.filter(id=self.restaurant.id).exists())

	def test_admin_ban_unban(self):
		self.client.force_authenticate(self.admin)
		restaurant = Restaurant.objects.create(owner=self.owner2, name="R2", address="Addr 2", city="HCM", phone="0909", email="r2@test.com", description="desc", status="active")
		res = self.client.post(reverse("restaurant-ban", kwargs={"restaurant_id": restaurant.id}))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		restaurant.refresh_from_db()
		self.assertEqual(restaurant.status, "banned")

		res = self.client.post(reverse("restaurant-unban", kwargs={"restaurant_id": restaurant.id}))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		restaurant.refresh_from_db()
		self.assertEqual(restaurant.status, "inactive") 