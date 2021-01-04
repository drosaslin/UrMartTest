from rest_framework import generics
from rest_framework import status
from django.db.models import Sum
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import OrderSerializer, ProductSerializer
from .models import Product, Order
from .restrictions import in_stock, is_vip_authorized

class ProductView(generics.ListAPIView):
    queryset = Product.objects.order_by('product_id')
    serializer_class = ProductSerializer

class OrderView(generics.CreateAPIView, generics.ListAPIView, generics.DestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @in_stock
    @is_vip_authorized
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.get(pk=request.data['product_id'])
        product.substract_stock(stock_amount=request.data['qty'])        

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class OrderDetailView(generics.DestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_url_kwarg = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        product_id = instance.product_id.product_id
        amount = instance.qty

        self.perform_destroy(instance)

        product = Product.objects.get(pk=product_id)
        product.add_stock(stock_amount=amount)

        return Response(status=status.HTTP_204_NO_CONTENT)