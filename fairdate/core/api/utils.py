def get_restaurant_object(restaurant=None):
    if restaurant is None:
        return ""
    return {
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
