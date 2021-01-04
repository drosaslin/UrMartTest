class Product {
    constructor(product_id, stock_pcs, price, shop_id, vip) {
        this.product_id = product_id;
        this.stock_pcs = stock_pcs;
        this.price = price;
        this.shop_id = shop_id;
        this.vip = vip;
    }
}

class Order {
    constructor(order_id, product_id, qty, price, shop_id, customer_id) {
        this.order_id = order_id;
        this.product_id = product_id;
        this.qty = qty;
        this.price = price;
        this.shop_id = shop_id;
        this.customer_id = customer_id;
    }
}