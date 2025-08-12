from django.db import models
from restaurants.models import Restaurant
from django.contrib.auth import get_user_model

User = get_user_model()

class Fault(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="faults")
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_faults")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Fault by {self.sender} for {self.restaurant.name} at {self.created_at}"