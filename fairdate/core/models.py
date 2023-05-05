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
    yelp_url = models.URLField(max_length=500)
    yelp_id = models.CharField(max_length=100)
    image_url = models.URLField(max_length=200)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default="")
    outing = models.ForeignKey('DateOuting', on_delete=models.CASCADE, related_name='outing')

    def __str__(self):
        return self.name


class DateOuting(models.Model):
    STATE_CHOICES = (
        ('CREATED', 'Created'),
        ('CHOOSING_PREFERENCES', 'Choosing Preferences'),
        ('CHOOSING_RESTAURANT', 'Choosing Restaurant'),
        ('FINALIZED', 'Finalized'),
    )

    """
    There are 4 states:
    1. CREATED
    2. CHOOSING_PREFERENCES
    3. CHOOSING_RESTAURANT
    4. FINALIZED
    
    And there's a field action_pending_from: which can hold either 'none', 'both', or one of the users' username
    
    Workflow goes like this:
    1. When outing is created:  state - 'CHOOSING_PREFERENCES', action_pending_from - 'both'
    2. One of them submits preferences: state - 'CHOOSING_PREFERENCES', action_pending_from - <username of the remaining user>
    3. Both submit preferences: state - 'CHOOSING_RESTAURANT', action_pending_from - 'both'
    4. One of them submits restaurant preferences: state - 'CHOOSING_RESTAURANT', action_pending_from - <username of the remaining user>
    5. Both submit restaurant preferences: state - 'FINALIZED', action_pending_from - 'none'
    
    """
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_outing')
    partner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='invited_outing', blank=True,
                                null=True, default=None)
    date_time = models.DateTimeField()
    location = models.CharField(max_length=200)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True, blank=True, related_name='venue')
    state = models.CharField(max_length=50, choices=STATE_CHOICES, default='CREATED')
    action_needed_from = models.CharField(max_length=50, blank=True, null=True, default='none')


    def __str__(self):
        return f"Outing between {self.creator} and {self.partner} on {self.date_time}"


class RestaurantChoice(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    outing = models.ForeignKey(DateOuting, on_delete=models.CASCADE)


class UserPreference(models.Model):
    category = models.CharField(max_length=200)
    price = models.IntegerField(default=-1)
    has_parking = models.BooleanField(default=False)
    outing = models.ForeignKey(DateOuting, on_delete=models.CASCADE, related_name='outing')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    radius = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    # i think this needs an id to diffrentiate diffrent prefrences for different outings
