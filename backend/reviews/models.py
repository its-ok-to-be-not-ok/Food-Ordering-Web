from django.db import models
from users.models import User
from restaurants.models import Restaurant, MenuItem
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        pass

    def __str__(self):
        if self.restaurant:
            return f"Review by {self.user.username} for {self.restaurant.name}"
        elif self.menu_item:
            return f"Review by {self.user.username} for {self.menu_item.name}"
        return f"Review by {self.user.username}"
