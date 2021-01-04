from .models import Product
from .exceptions import MemberNotVipException, NoStockException

def in_stock(api_func):
    def wrapper(request, *args, **kwargs):
        product_id = args[0].data['product_id']
        order_amount = args[0].data['qty']

        product = Product.objects.get(pk=product_id)
        if not product.in_stock(stock_amount=order_amount):
            raise NoStockException

        return api_func(request, *args, **kwargs)

    return wrapper

def is_vip_authorized(api_func):
    def wrapper(request, *args, **kwargs):
        product_id = args[0].data['product_id']
        product = Product.objects.get(pk=product_id)

        if product.vip and not args[0].data['vip']:
            raise MemberNotVipException
            
        return api_func(request, *args, **kwargs)
    
    return wrapper

