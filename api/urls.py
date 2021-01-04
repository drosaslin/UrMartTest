from django.urls import path
from .views import ProductView, OrderView, OrderDetailView


urlpatterns = [
    path('product', ProductView.as_view()),
    path('order/', OrderView.as_view()),
    path('order/<int:pk>/', OrderDetailView.as_view())
]