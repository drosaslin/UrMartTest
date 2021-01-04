from django.shortcuts import render
from django.views import View

def order(request):
    return render(request, 'views/order.html')