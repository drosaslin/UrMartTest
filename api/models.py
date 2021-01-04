from .exceptions import NoStockException
from django.db import models

class Shop(models.Model):
    shop_id = models.CharField(max_length=5, primary_key=True)

class Product(models.Model):
    product_id = models.CharField(max_length=10, primary_key=True)
    stock_pcs = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    shop_id = models.ForeignKey(Shop, on_delete=models.CASCADE)
    vip = models.BooleanField(default=False)

    def in_stock(self, stock_amount):
        return self.stock_pcs >= int(stock_amount);

    def substract_stock(self, stock_amount):
        stock_amount = int(stock_amount)
        if not self.in_stock(stock_amount):
            raise NoStockException

        self.stock_pcs -= stock_amount
        self.save()
    
    def add_stock(self, stock_amount):
        self.stock_pcs += stock_amount
        self.save()

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    shop_id = models.ForeignKey(Shop, null=True, on_delete=models.SET_NULL)
    product_id = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    price = models.IntegerField(default=0)
    qty = models.IntegerField()
