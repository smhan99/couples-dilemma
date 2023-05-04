# from django.db import models
# from django.contrib.auth.models import User
#
#
# class Restaurant(models.Model):
#     name = models.CharField(max_length=100)
#     location = models.CharField(max_length=200)
#
#     def __str__(self):
#         return self.name
#
#
# class DateOuting(models.Model):
#     STATE_CHOICES = (
#         ('CREATED', 'Created'),
#         ('PENDING', 'Pending'),
#         ('CHOOSING_PREFERENCES', 'Choosing Preferences'),
#         ('CHOOSING_RESTAURANT', 'Choosing Restaurant'),
#         ('FINALIZED', 'Finalized'),
#         ('DECLINED', 'Declined')
#     )
#
#     invite_id = models.UUIDField(default=uuid.uuid4, editable=False)
#     creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_outing')
#     partner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='invited_outing', blank=True)
#     date_time = models.DateTimeField()
#     restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True, blank=True, NU)
#     state = models.CharField(max_length=50, choices=STATE_CHOICES, default='CREATED')
#
#     def __str__(self):
#         return f"Outing between {self.creator} and {self.partner} on {self.date_time}"
#
#
# class RestaurantPreference(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='restaurant_preferences')
#     restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
#     outing = models.ForeignKey(DateOuting, on_delete=models.CASCADE, related_name='restaurant_preferences')
#     yelp_url = models.URLField(blank=True, max_length=500)
#
#
# class RestaurantChoice(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='restaurant_choices')
#     restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
#     outing = models.ForeignKey(DateOuting, on_delete=models.CASCADE, related_name='restaurant_choices')
