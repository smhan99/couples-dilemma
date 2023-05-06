import core.api.api_key as api_key
import requests
from core.models import Restaurant, RestaurantChoice
from django.db.models import Count


def get_restaurant_object(restaurant=None):
    if restaurant is None:
        return ""
    return {
        "id": restaurant.id,
        "yelp_id": restaurant.yelp_id,
        "yelp_url": restaurant.yelp_url,
        "name": restaurant.name,
        "location": restaurant.location,
        "image_url": restaurant.image_url,
        "rating": restaurant.rating,
    }


def get_outing_object(outing=None):
    if outing is None:
        return ""
    return {
        "id": outing.id,
        "creator": outing.creator.username,
        "partner": outing.partner.username if outing.partner else "",
        "location": outing.location,
        "venue": get_restaurant_object(outing.restaurant) if outing.restaurant else "",
        "time": str(outing.date_time),
        "state": outing.state,
        "action_pending_from": outing.action_needed_from
    }


def get_user_preference(user_preference=None):
    if user_preference is None:
        return {}
    return {
        "outing_id": user_preference.outing.id,
        "category": user_preference.category,
        "price": user_preference.price,
        "rating": user_preference.rating,
        "has_parking": user_preference.has_parking,
        "radius": user_preference.radius
    }


def get_yelp_request_params(location, user_preference, isRepeat=False):
    request_body = {}

    request_body['location'] = location
    if user_preference.category != '':
        request_body['categories'] = user_preference.category

    if user_preference.price != -1:
        request_body['price'] = ','.join([str(i) for i in range(1, user_preference.price + 1)])

    if user_preference.rating != 0.0:
        request_body['sort_by'] = 'rating'

    if user_preference.radius != 0:
        request_body['radius'] = user_preference.radius

    if user_preference.has_parking:
        request_body['attributes'] = 'parking_lot'
    if isRepeat:
        request_body['limit'] = 6
    else:
        request_body['limit'] = 3

    return request_body


def get_yelp_response(location, user_preference, isRepeat=False):
    headers = {'Authorization': 'bearer %s' % api_key.API_KEY}
    if not isRepeat:
        request_params = get_yelp_request_params(location, user_preference)
    else:
        request_params = get_yelp_request_params(location, user_preference, True)

    creator_response = requests.get('https://api.yelp.com/v3/businesses/search', headers=headers, params=request_params)
    return creator_response.json()


def create_restaurant_entries(outing, yelp_response):
    restaurants = []
    for business in yelp_response['businesses']:

        restaurant, created = Restaurant.objects.get_or_create(
            yelp_id=business['id'],
            outing=outing,
            defaults={
                'name': business['name'],
                'location': ', '.join(business['location']['display_address']),
                'yelp_url': business['url'],
                'image_url': business['image_url'],
                'rating': business['rating'],
                'outing': outing
            }
        )
        if created:
            restaurants.append(restaurant)

    return restaurants


def get_final_restaurant(outing):
    choices = RestaurantChoice.objects.filter(outing=outing)
    choice_counts = choices.values('restaurant').annotate(dcount=Count('restaurant')).order_by()

    for choice_count in choice_counts:
        if choice_count['dcount'] == 2:
            return Restaurant.objects.get(id=choice_count['restaurant'])

    return None
