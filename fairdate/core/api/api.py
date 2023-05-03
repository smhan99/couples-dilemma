from rest_framework.decorators import authentication_classes, api_view
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import IntegrityError
from django.contrib.auth import authenticate
from .serializers import CustomUserSerializer, RestaurantSerializer, DateOutingSerializer, RestaurantPreferenceSerializer, RestaurantChoiceSerializer
from core.models import CustomUser, Restaurant, DateOuting, RestaurantPreference, RestaurantChoice



@api_view(['POST'])
def validate_user(request):
    """
    Authenticates a user with their credentials and returns a token that can be used for subsequent requests.

    Input JSON:
    {
        "username": <username>,
        "password": <password>
    }

    Output JSON:
    Success case:
    {
        "response":
        {
            "validated": <True if credentials are valid else False
        }
    }


    Error case:
    {
        "error": <error message>
    }

    Request Type: POST
    Authentication Required: No
    """
    try:
        username = request.data['username']
        password = request.data['password']
    except KeyError as missing_key:
        return Response({'error': 'Missing key: ' + str(missing_key) + ' in the request'})

    user = authenticate(request, username=username, password=password)
    return Response({'response':  {'validated': user is not None}})




@api_view(['POST'])
def register_user(request):
    """
    Registers the user with the given username and password

    Input JSON:
    {
        "username": <username of the user to be created>
        "password": <password of the user to be created>
    }


    Output JSON:

    Success case:
    {
        "response": "User successfully created"
    }

    Error case:
    {
        "error": <Error Message>
    }

    Request Type: POST
    Authentication Required: No
    """
    try:
        username = request.data['username']
        password = request.data['password']
    except KeyError as missing_key:
        return Response({'error': 'Missing key: ' + str(missing_key) + ' in the request'})

    try:
        user = CustomUser.objects.create_user(username=username, password=password)
        user.save()
        return Response({'response': 'User successfully created'})
    except IntegrityError as error:
        return Response({'error': 'Username already exists'})
    except BaseException as message:
        return Response({'error': str(message)})



# @api_view(['POST'])
# @authentication_classes([BasicAuthentication])
# def create_outing(request, outing_id):