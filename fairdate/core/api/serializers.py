from rest_framework import serializers
from core.models import CustomUser, Restaurant, DateOuting, RestaurantChoice




class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class DateOutingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DateOuting
        fields = '__all__'


class RestaurantChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantChoice
        fields = '__all__'