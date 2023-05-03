from django.db import models
from .utils import generate_custom_id
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, BaseUserManager
from django.conf import settings
import uuid

# Create your models here.



class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None):
        if not username:
            raise ValueError('The Username field must be set')

        user = self.model(
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        user = self.create_user(
            username=username,
            password=password,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    custom_id = models.CharField(max_length=9, unique=True)
    username = models.CharField(max_length=30, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'

    def save(self, *args, **kwargs):
        if not self.custom_id:
            # generate a unique custom ID
            while True:
                custom_id = generate_custom_id()
                if not CustomUser.objects.filter(custom_id=custom_id).exists():
                    break
            self.custom_id = custom_id

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} | {self.custom_id}"


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    

class DateOuting(models.Model):
    STATE_CHOICES = (
        ('CREATED', 'Created'),
        ('PENDING', 'Pending'),
        ('CHOOSING_PREFERENCES', 'Choosing Preferences'),
        ('CHOOSING_RESTAURANT', 'Choosing Restaurant'),
        ('FINALIZED', 'Finalized'),
        ('DECLINED', 'Declined')        
    )

    invite_id = models.UUIDField(default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_outing')
    partner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='invited_outing')
    date_time = models.DateTimeField()
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True, blank=True)
    state = models.CharField(max_length=50, choices=STATE_CHOICES, default='CREATED')

    def __str__(self):
        return f"Outing between {self.creator} and {self.partner} on {self.date_time}"


class RestaurantPreference(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='restaurant_preferences')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    outing = models.ForeignKey(DateOuting, on_delete=models.CASCADE, related_name='restaurant_preferences')


class RestaurantChoice(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='restaurant_choices')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    outing = models.ForeignKey(DateOuting, on_delete=models.CASCADE, related_name='restaurant_choices')
