adminApp.controller('ProductDetailCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, $ionicSideMenuDelegate, ProductService, $ionicLoading, $stateParams, $ionicPopup) {

    $scope.user = AuthService.getUser();
    var productID = JSON.parse($stateParams.product);
    $ionicLoading.show({ template: 'กรุณารอสักครู่' });
    ProductService.getProduct(productID._id).then(function (res) {
        $scope.product = res;
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        alert(err.message);
    });
    $scope.productGotoCart = {
        qty: 1
    };

    $scope.showAddToCartPopup = function (product, now) {
        $scope.data = {};
        $scope.data.product = product;
        $scope.data.productOption = 1;
        $scope.data.productQuantity = 1;

        if (now) {
            if (ProductService.getCartProducts().length === 0) {
                $ionicLoading.show({ template: 'กรุณารอสักครู่', duration: 1000 });
                $scope.productGotoCart.product = product;
                $scope.productGotoCart.qty = 1;
                $scope.productGotoCart.amount = product.price * $scope.productGotoCart.qty;
                $scope.productGotoCart.qty = parseInt($scope.productGotoCart.qty);
                ProductService.addProductToCart($scope.productGotoCart);
                $rootScope.countProduct()
                $state.go('app.tab.cart');
            } else {
                var cartQty = 0;
                ProductService.getCartProducts().forEach(function (cart) {
                    if (product._id === cart.product._id) {
                        cartQty = cart.qty;
                    }
                });

                if (cartQty > 0) {
                    $state.go('app.tab.cart');
                } else {
                    $ionicLoading.show({ template: 'กรุณารอสักครู่', duration: 1000 });
                    $scope.productGotoCart.product = product;
                    $scope.productGotoCart.qty = 1;
                    $scope.productGotoCart.amount = product.price * $scope.productGotoCart.qty;
                    $scope.productGotoCart.qty = parseInt($scope.productGotoCart.qty);
                    ProductService.addProductToCart($scope.productGotoCart);
                    $rootScope.countProduct()
                    $state.go('app.tab.cart');
                }
            }
        } else {
            $scope.showError = false;
            $scope.productGotoCart = {
                qty: 1
            };
            var myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'templates/popup/add-to-cart-popup.html',
                title: 'ใส่ตะกร้า',
                scope: $scope,
                buttons: [
                    { text: 'ยกเลิก' }, {
                        text: 'ตกลง',
                        onTap: function (e) {
                            if ($scope.productGotoCart.qty) {
                                if ($scope.productGotoCart.qty.toString().indexOf('.') !== -1) {
                                    e.preventDefault();
                                    $scope.showError = true;
                                } else {
                                    $scope.showError = false;
                                    return $scope.data;
                                }
                            } else {
                                e.preventDefault();
                                $scope.showError = true;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    // if ($scope.productGotoCart.qty) {
                    $ionicLoading.show({ template: 'กรุณารอสักครู่', duration: 1000 });
                    $scope.productGotoCart.product = res.product;
                    $scope.productGotoCart.amount = res.product.price * $scope.productGotoCart.qty;
                    $scope.productGotoCart.qty = parseInt($scope.productGotoCart.qty);
                    ProductService.addProductToCart($scope.productGotoCart);
                    console.log('Item added to cart!', $scope.productGotoCart);
                    $rootScope.countProduct()
                    $state.go('app.tab.products');
                } else {
                    console.log('Popup closed');
                }
            });
        }

    };

    $scope.chkPopupNumber = function (numID) {
        var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var status = false;
        nums.forEach(function (num) {
            if (numID.length > 1) {
                if (numID.substr(numID.length - 1) === num) {
                    status = true;
                }
            } else {
                if (numID === num) {
                    status = true;
                }
            }

        });

        if (!status) {
            $scope.productGotoCart.qty = $scope.productGotoCart.qty.slice(0, $scope.productGotoCart.qty.length - 1);
        }
    };
});