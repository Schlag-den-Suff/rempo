from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('user/', views.user_info, name='user_info'),
    path('token/refresh/', views.token_refresh, name='token_refresh'),
]
