from django.contrib import admin
from .models import CustomUser, DateOuting, UserPreference, Restaurant, RestaurantChoice
from django.contrib.auth.models import Group


# Register your models here.
admin.site.unregister(Group)
admin.site.register(CustomUser)
admin.site.register(DateOuting)
admin.site.register(UserPreference)
admin.site.register(Restaurant)
admin.site.register(RestaurantChoice)
