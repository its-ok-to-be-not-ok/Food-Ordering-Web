# Generated by Django 5.2.4 on 2025-08-01 09:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0003_restaurant_categories'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='restaurantregistration',
            name='restaurant_info',
        ),
        migrations.AddField(
            model_name='restaurantregistration',
            name='restaurant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='restaurants.restaurant'),
        ),
    ]
