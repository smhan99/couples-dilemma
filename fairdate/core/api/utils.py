def get_restaurant_object(restaurant=None):
    return {
        "yelp_id": restaurant.yelp_id,
        "yelp_url": restaurant.yelp_url,
        "name": restaurant.name,
        "location": restaurant.location,
        "image_url": restaurant.image_url,
        "rating": restaurant.rating,
    }


def get_outing_object(outing=None):
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
