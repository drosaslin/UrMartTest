from rest_framework import serializers
from .models import Product, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id', 'stock_pcs', 'price', 'shop_id', 'vip']

class OrderSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(required=False)
    vip = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_id', 'product_id', 'price', 'qty', 'vip', 'shop_id']

    def get_vip(self, obj):
        return None