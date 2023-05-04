from django.urls import path
from . import api

urlpatterns = [

    # path('newGame', new_api.new_game, name='new_game'),
    # path('gameDetails', new_api.get_game_details, name='get_game_details'),
    # path('submitGame', new_api.submit_game, name='submit_game'),
    # path('leaderboard', new_api.get_leaderboard, name='get_leaderboard'),

    # Auth API
    path('validateUser', api.validate_user, name='validate_user'),
    path('registerUser', api.register_user, name='register_user'),
    path('createOuting', api.create_outing, name='create_outing'),
    path('getOutings', api.get_my_outings, name='get_my_outings')
]