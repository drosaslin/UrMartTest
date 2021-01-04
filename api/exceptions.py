
from rest_framework.exceptions import APIException

class NoStockException(APIException):
    status_code = 403
    default_detail = 'Insufficient stock'
    default_code = 'detail'

class MemberNotVipException(APIException):
    status_code = 401
    default_detail = 'Not VIP Member'
    default_code = 'detail'