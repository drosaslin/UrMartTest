class OrderView {
    constructor() {
        this.orderAmountInput = $('#value');
        this.productTable = $('#productTable');
        this.orderTable = $('#orderTable');
        this.productDropdown = $('#productDropdown');
        this.vipCheckBox = $('#vipCheckBox')
        this.orderProductAmount = 1;
        this.isVipMember = false;
        this.productList = [];
        this.orderList = [];

        this.buildView = async function() {
            this.setDefaultView();

            this.productTable.empty();
            this.productList = await this.getProducts();
            this.populateProductTable();
            this.populateProductList();

            this.orderList = await this.getOrders();
            this.populateOrderTable();
        }

        this.setDefaultView = function() {
            this.orderAmountInput.val(this.orderProductAmount);
            this.productDropdown.empty();
            this.productTable.empty();
            this.vipCheckBox.prop("checked", this.isVipMember);
        }

        this.populateProductList = function() {
            var optionsString = '<option disabled selected hidden>Select Product</option>';
            for (const product of this.productList) {
                optionsString += '<option value="' + product.product_id + '">' + product.product_id + '</option>';
            };

            this.productDropdown.append(optionsString);
        }

        this.populateProductTable = function() {
            for (const product of this.productList) {
                var checked = product.vip ? "checked" : "";

                var row = '<tr>' +
                    '<td>' + product.product_id + '</td>' +
                    '<td>' + product.stock_pcs + '</td>' +
                    '<td>' + product.price + '</td>' +
                    '<td>' + product.shop_id + '</td>' +
                    '<td><input disabled type="checkbox" ' + checked + '></checkbox>';
                '</tr>';

                this.productTable.append(row);
            }
        }

        this.populateOrderTable = function() {
            for (const order of this.orderList) {
                this.insertOrderRow(order);
            }
        }

        this.insertOrderRow = function(order) {
            var row = '<tr>' +
                '<td>' + order.order_id + '</td>' +
                '<td>' + order.product_id + '</td>' +
                '<td>' + order.qty + '</td>' +
                '<td>' + order.price + '</td>' +
                '<td>' + order.shop_id + '</td>' +
                '<td>' + Math.floor(Math.random() * Math.floor(5)) + '</td>' +
                '<td><button type="button" class="btn btn-danger" value="' + order.order_id + '" onclick="orderView.onDeleteOrder(this.value)">Delete</button></td>' +
                '</tr>';

            this.orderTable.append(row);
        }

        this.getProducts = async function() {
            var products = []
            var response = await fetch('http://127.0.0.1:5050/api/product')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network Error');
                    }

                    return res.json();
                })
                .catch(err => {
                    alert(err);
                    return null;
                })

            if (response != null) {
                for (const product of response) {
                    products.push(new Product(
                        product['product_id'],
                        product['stock_pcs'],
                        product['price'],
                        product['shop_id'],
                        product['vip']))
                };
            }

            return products;
        }

        this.getOrders = async function() {
            var orders = [];
            var response = await fetch('http://127.0.0.1:5050/api/order/')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network Error');
                    }

                    return res.json();
                })
                .catch(err => {
                    alert(err);
                    return null;
                })

            if (response != null) {
                for (const order of response) {
                    orders.push(new Order(
                        order['order_id'],
                        order['product_id'],
                        order['qty'],
                        order['price'],
                        order['shop_id'],
                        1));
                };
            }

            return orders;
        }

        this.onDeleteOrder = async function(orderId) {
            var response = await fetch('http://127.0.0.1:5050/api/order/' + orderId + '/', {
                    method: 'DELETE',
                    mode: 'cors',
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network Error');
                    }

                    return true;
                })
                .catch(err => {
                    alert(err);
                    return false
                })

            if (response) {
                this.deleteOrder(orderId);
                this.updateOrderTable();

                this.productList = await this.getProducts();
                this.updateProductTable();
            }
        }

        this.updateProductTable = function() {
            this.productTable.empty();
            this.populateProductTable();
        }

        this.updateOrderTable = function() {
            this.orderTable.empty();
            this.populateOrderTable();
        }

        this.deleteOrder = function(orderId) {
            for (var n = 0; n < this.orderList.length; n++) {
                if (this.orderList[n]['order_id'] == orderId) {
                    this.orderList.splice(n, 1);
                }
            }
        }

        this.onIncreaseValue = function() {
            this.orderProductAmount++;
            this.orderAmountInput.val(this.orderProductAmount);
        }

        this.onDecreaseValue = function() {
            if (this.orderProductAmount > 1) {
                this.orderProductAmount--;
            }

            this.orderAmountInput.val(this.orderProductAmount);
        }

        this.onVipCheckBoxClick = function() {
            this.isVipMember = !this.isVipMember;
            this.vipCheckBox.prop("checked", this.isVipMember);
        }

        this.onOrderButtonClick = async function() {
            var productSelected = this.productDropdown.children("option:selected").val();
            for (const product of this.productList) {
                if (product.product_id == productSelected) {
                    await this.postOrder(product, this.orderProductAmount);
                }
            }
        }

        this.postOrder = async function(product, amount) {
            var payload = {
                'product_id': product.product_id,
                'price': product.price,
                'shop_id': product.shop_id,
                'qty': amount,
                'vip': this.isVipMember
            };

            var response = await fetch('http://127.0.0.1:5050/api/order/', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => {
                    if (res.status == 403) {
                        throw new Error('Insufficient Stock');
                    }
                    if (res.status == 401) {
                        throw new Error('Not a VIP memeber');
                    }
                    if (!res.ok) {
                        throw new Error('Network Error');
                    }

                    return res.json();
                })
                .catch(err => {
                    alert(err);
                    return null;
                })

            if (response != null) {
                var newOrder = new Order(
                    response['order_id'],
                    response['product_id'],
                    response['qty'],
                    response['price'],
                    response['shop_id'],
                    1);

                this.orderList.push(newOrder);
                this.insertOrderRow(newOrder);

                this.productList = await this.getProducts();
                this.updateProductTable();

                this.orderProductAmount = 1;
                this.orderAmountInput.val(this.orderProductAmount);
            }
        }

        this.resetOrderProductAmount = function() {
            this.orderProductAmount = 1;
            this.orderAmountInput.val(this.orderProductAmount);
        }
    }
}

orderView = new OrderView();
orderView.buildView();