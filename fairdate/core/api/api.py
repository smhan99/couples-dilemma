from rest_framework.decorators import authentication_classes, api_view
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import IntegrityError
from django.contrib.auth import authenticate
from .serializers import CustomUserSerializer, RestaurantSerializer, DateOutingSerializer, RestaurantChoiceSerializer
from core.models import CustomUser, Restaurant, DateOuting, RestaurantChoice
import core.api.utils as utils
from django.db.models import Q


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
    return Response({'response': {'validated': user is not None}})


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
    Authentication Required: Yes
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


@api_view(['POST'])
@authentication_classes([BasicAuthentication])
def create_outing(request):
    """
        Takes input as outing date time, location and returns outing details.

        Input JSON:
        {
            "date_time" : <Date and time of the event in the format YYYY-MM-HH:MM>
            "location" : <Location string>
        }

        Output JSON:

        Success case:
        {
            "response":
            {
                "outing" : {
                    id : <id_of the outing>
                    creator : <username_of_creator>
                    partner: <username_of_partner>
                    location: <location>
                    venue: <venue object if available>,
                    time: <date_time_string in the format YYYY-MM-DD HH:MM>
                    state: <state_of_outing>
                    action_pending_from: <both or none or username>
                }
            }
        }

        Error case:
        {
            "error": <Error Message>
        }

        Request Type: POST
        Authentication Required: Yes - Basic Auth
        """
    try:
        location = request.data['location']
        date_time = request.data['date_time']
        partner_username = request.data['partner']
    except KeyError as missing_key:
        return Response({'error': 'Missing key: ' + str(missing_key) + ' in the request'})

    try:
        partner = CustomUser.objects.get(username=partner_username)
    except ObjectDoesNotExist:
        return Response({'error': "User doesn\'t exist with the username: '" + partner_username + "' provided"})
    try:
        outing = DateOuting(creator=request.user, date_time=date_time, location=location, partner=partner,
                            action_needed_from='both')
        outing.save()

        return Response({'response': {
            'outing': utils.get_outing_object(outing)
        }})
    except IntegrityError as error:
        return Response({'error': error})
    except BaseException as message:
        return Response({'error': str(message)})


@api_view(['GET'])
@authentication_classes([BasicAuthentication])
def get_my_outings(request):
    """
    Returns all the outings of the authenticated user

    Output JSON:

    Success case:
    {
        "response": {
            "outings" : [
                {
                    id : <id_of the outing>
                    creator : <username_of_creator>
                    partner: <username_of_partner>
                    location: <location>
                    venue: <venue object if available>,
                    time: <date_time_string in the format YYYY-MM-DD HH:MM>
                    state: <state_of_outing>
                    action_pending_from: <both or none or username>
                },

                ...
            ]
        }
    }

    Error case:
    {
        "error": <Error Message>
    }

    Request Type: GET
    Authentication Required: Yes - Basic Auth
    """
    outings = DateOuting.objects.filter(Q(creator=request.user) | Q(partner=request.user))
    outing_list = []

    for outing in outings:
        outing_list.append(utils.get_outing_object(outing))

    return Response({'response': {
        'outings': outing_list
    }})


