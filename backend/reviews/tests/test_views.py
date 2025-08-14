from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from decimal import Decimal

from users.models import User
from restaurants.models import Restaurant, Menu, MenuItem
from reviews.models import Review


class ReviewAPITests(APITestCase):
	def setUp(self):
		self.owner = User.objects.create_user(email="owner@example.com", username="owner", password="ownerpass", role="restaurant_owner")
		self.customer = User.objects.create_user(email="customer@example.com", username="customer", password="customerpass", role="customer")
		self.restaurant = Restaurant.objects.create(owner=self.owner, name="R1", address="Addr 1", city="HCM", phone="0909", email="r1@test.com", description="desc", status="active")
		self.menu = Menu.objects.create(restaurant=self.restaurant, title="Menu 1", description="desc")
		self.item = MenuItem.objects.create(menu=self.menu, name="Pho", description="Pho", price=Decimal("70000.00"), category="pho", discount=Decimal("0.00"))

		Review.objects.create(user=self.customer, restaurant=self.restaurant, rating=5, comment="Great")
		Review.objects.create(user=self.customer, menu_item=self.item, rating=4, comment="Good")

	def test_list_reviews_filters(self):
		# list all
		res = self.client.get(reverse("review-list"))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(res.data), 2)
		# by restaurant
		res = self.client.get(reverse("restaurant-reviews", kwargs={"restaurant_id": self.restaurant.id}))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(res.data), 1)
		# by menu item
		res = self.client.get(reverse("menu-item-reviews", kwargs={"menu_item_id": self.item.id}))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(res.data), 1)

	def test_create_review_validations(self):
		self.client.force_authenticate(self.customer)
		# missing both ids
		res = self.client.post(reverse("review-create"), {"rating": 5, "comment": "ok"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
		# both ids present
		payload = {"rating": 5, "comment": "ok", "restaurant_id": self.restaurant.id, "menu_item_id": self.item.id}
		res = self.client.post(reverse("review-create"), payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
		# rating out of bounds
		payload = {"rating": 6, "comment": "ok", "restaurant_id": self.restaurant.id}
		res = self.client.post(reverse("review-create"), payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
		# success restaurant review (use different restaurant to avoid unique constraint)
		other_owner = User.objects.create_user(email="o2@example.com", username="o2", password="pass", role="restaurant_owner")
		other_restaurant = Restaurant.objects.create(owner=other_owner, name="R2", address="Addr 2", city="HCM", phone="0909", email="r2@test.com", description="desc", status="active")
		payload = {"rating": 5, "comment": "ok", "restaurant_id": other_restaurant.id}
		res = self.client.post(reverse("review-create"), payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)

	def test_user_reviews_requires_auth(self):
		# unauth
		res = self.client.get(reverse("user-reviews"))
		self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
		# auth
		self.client.force_authenticate(self.customer)
		res = self.client.get(reverse("user-reviews"))
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(res.data), 1) 