# Generated by Django 5.2.4 on 2025-07-25 08:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('restaurants', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restaurants', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='menu',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='menus', to='restaurants.restaurant'),
        ),
        migrations.AddField(
            model_name='restaurantstat',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stats', to='restaurants.restaurant'),
        ),
        migrations.AlterUniqueTogether(
            name='menuitemstat',
            unique_together={('menu_item', 'stats_date')},
        ),
        migrations.AlterUniqueTogether(
            name='restaurantstat',
            unique_together={('restaurant', 'stats_date')},
        ),
    ]
