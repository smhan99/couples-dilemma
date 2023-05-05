from rest_framework.decorators import authentication_classes, api_view
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import IntegrityError
from django.contrib.auth import authenticate
from .serializers import CustomUserSerializer, RestaurantSerializer, DateOutingSerializer, RestaurantChoiceSerializer
from core.models import CustomUser, Restaurant, DateOuting, RestaurantChoice, UserPreference
import core.api.utils as utils
from django.db.models import Q
import core.api.api_key as api_key
import requests
import json


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
        Takes input as outing date time, location, partner's username and returns outing details.

        Input JSON:
        {
            "date_time" : <Date and time of the event in the format YYYY-MM-HH:MM>
            "location" : <Location string>
            "partner" : <username of the partner>
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

    #

    try:
        partner = CustomUser.objects.get(username=partner_username)
    except ObjectDoesNotExist:
        return Response({'error': "User doesn\'t exist with the username: '" + partner_username + "' provided"})
    try:
        outing = DateOuting(creator=request.user, date_time=date_time, location=location, partner=partner,
                            action_needed_from='both', state='CHOOSING_PREFERENCES')
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


@api_view(['POST'])
@authentication_classes([BasicAuthentication])
def post_preference(request):
    """
    Takes input as preference details and update the state of the outing and return the outing object

    Input JSON:
    {
        "outing_id": <ID of the outing>
       "rating" : "1 to 5 in 0.5 steps",
       "category": "category of the restaurant",
       "has_parking": "true or false",
       "radius": "distance in m"
       "price" : "1 to 4"
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
        outing_id = request.data['outing_id']

    except KeyError:
        return Response({'error': "Missing 'outing_id' in the request"})

    try:
        outing = DateOuting.objects.get(id=outing_id)
        if not (outing.creator == request.user or outing.partner == request.user):
            return Response({'error': "Outing being updated doesn't involve user"})
    except ObjectDoesNotExist:
        return Response({'error': "Outing doesn't exist with the given ID"})

    if outing.state != 'CHOOSING_PREFERENCES':
        return Response({'error': 'The outing is in invalid state to submit preferences. State: ' + outing.state})

    try:
        UserPreference.objects.get(outing=outing, user=request.user)
        return Response({'error': "User preference already submitted"})
    except ObjectDoesNotExist:
        pass

    category = request.data['category'] if 'category' in request.data.keys() else ''

    try:
        price = int(request.data['price']) if 'price' in request.data.keys() else ''
        if price < 1 or price > 4:
            raise ValueError
    except ValueError:
        return Response({'error': "Invalid value for 'price' must be a int between 1 and 4 (both included)"})

    try:
        rating = float(request.data['rating']) if 'rating' in request.data.keys() else -1
        if rating < 0.0 or rating > 5.0:
            raise ValueError
    except ValueError:
        return Response({'error': "Invalid value for 'rating' must be a float between 0.0 and 5.0"})

    has_parking = str.lower(request.data['has_parking']) if 'has_parking' in request.data.keys() else 'false'

    if not (has_parking == 'false' or has_parking == 'true'):
        return Response({'error': "Invalid value for 'has_parking' must be a true or false"})

    has_parking = True if has_parking == 'true' else False

    try:
        radius = int(request.data['radius']) if 'radius' in request.data.keys() else -1
    except ValueError:
        return Response({'error': "Invalid value for 'radius' must be int, specifying meters"})

    try:
        preference = UserPreference(outing=outing, user=request.user, category=category, price=price, rating=rating,
                                    has_parking=has_parking, radius=radius)
        preference.save()

        if outing.action_needed_from == 'both':
            outing.action_needed_from = outing.creator.username if outing.partner == request.user else outing.partner.username
        else:
            outing.state = 'CHOOSING_RESTAURANT'
            outing.action_needed_from = 'both'
        outing.save()

        return Response({'response': 'User preference successfully captured'})
    except BaseException as message:
        return Response({'error': message})


@api_view(['GET'])
@authentication_classes([BasicAuthentication])
def get_user_preference(request):
    """
    Takes input as outing_id and returns the user preference of the authenticated user for the provided outing

    Input JSON:
    {
        "outing_id": <ID of the outing>
    }

    Output JSON:

    Success case:
    {
        "response":
        {
            "user_preference": {
                "outing_id": <id of the outing>,
                "category": <category>,
                "price": <price, if nothing is provided -1>,
                "rating" : <rating, if nothing is provided 0.0>,
                "has_parking": <has parking, if nothing is provided false>,
                "radius": <radius in m, if nothing is provided 0>
            }

        }
    }

    Error case:
    {
        "error": <Error Message>
    }

    Request Type: GET
    Authentication Required: Yes - Basic Auth
    """

    try:
        outing_id = request.data['outing_id']

    except KeyError:
        return Response({'error': "Missing 'outing_id' in the request"})

    try:
        outing = DateOuting.objects.get(id=outing_id)
        if not (outing.creator == request.user or outing.partner == request.user):
            return Response({'error': "Outing being updated doesn't involve user"})
    except ObjectDoesNotExist:
        return Response({'error': "Outing doesn't exist with the given ID"})

    try:
        user_preference = UserPreference.objects.get(outing=outing, user=request.user)
        return Response({'response': {
            'preference': utils.get_user_preference(user_preference)
        }})
    except ObjectDoesNotExist:
        return Response({'error': "User preference hasn't been submitted yet"})


@api_view(['POST'])
@authentication_classes([BasicAuthentication])
def get_restaurants(request):
    try:
        outing_id = request.data['outing_id']
    except KeyError:
        return Response({'error': "Missing 'outing_id' in the request"})

    try:
        date_outing = DateOuting.objects.get(id=outing_id)
    except ObjectDoesNotExist:
        return Response({'error': "Outing doesn't exist with the given ID"})

    # check if the records already exist, if they do, send them directly
    try:
        restaurants = Restaurant.objects.filter(outing=date_outing)
        restaurant_list = []
        if len(restaurants) != 0:
            for restaurant in restaurants:
                restaurant_list.append(utils.get_restaurant_object(restaurant))

            return Response({'response': {'restaurants': restaurant_list}})
    except BaseException as message:
        return Response({'error': str(message)})

    try:
        creator_preferences = UserPreference.objects.get(outing=date_outing, user=date_outing.creator)
        participant_preferences = UserPreference.objects.get(outing=date_outing, user=date_outing.partner)
    except ObjectDoesNotExist:
        return Response({'error': 'One of the preferences missing'})

    creator_response = utils.get_yelp_response(date_outing.location, creator_preferences)
    participant_response = utils.get_yelp_response(date_outing.location, participant_preferences)

    if not ('businesses' in creator_response.keys() and 'businesses' in participant_response.keys()):
        return Response({'error': 'Error in fetching response from Yelp'})

    creator_restaurants = utils.create_restaurant_entries(date_outing, creator_response)
    participant_restaurants = utils.create_restaurant_entries(date_outing, participant_response)

    restaurant_list = []

    for restaurant in creator_restaurants:
        restaurant_list.append(utils.get_restaurant_object(restaurant))

    for restaurant in participant_restaurants:
        restaurant_list.append(utils.get_restaurant_object(restaurant))

    return Response({'restaurants': restaurant_list})
