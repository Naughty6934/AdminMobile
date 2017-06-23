adminApp.controller('CheckoutCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, $ionicSideMenuDelegate, ProductService, $ionicLoading, $http, $cordovaGeolocation, $ionicActionSheet, $timeout) {

    $scope.user = AuthService.getUser();
    $scope.postcodes = [];
    $scope.order = {
        shipping: {},
        delivery: {
            deliveryid: '0'
        },
        deliveryamount: 0,
        discountpromotion: 0,
        amount: 0,
        totalamount: 0


    };
    $scope.products = ProductService.getCartProducts();
    $scope.order.items = ProductService.getCartProducts();

    $scope.calculateCheckout = function () {
        $scope.confirmedOrder = false;
        $scope.order.amount = 0;
        $scope.order.totalamount = 0;
        $scope.order.deliveryamount = 0;
        $scope.order.discountpromotion = 0;
        var allDeliverycost = 0;
        var allDiscountAmount = 0;
        $scope.order.items.forEach(function (item) {
            $scope.order.amount += item.amount;
            allDeliverycost += item.deliverycost;
            allDiscountAmount += item.discountamount;
        });
        $scope.order.deliveryamount = allDeliverycost;
        $scope.order.discountpromotion = allDiscountAmount;
        $scope.order.totalamount = $scope.order.amount + $scope.order.deliveryamount - $scope.order.discountpromotion;
    };

    $scope.calculateCheckout();

    $scope.getPostcode = function () {
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        ProductService.getPostcode().then(function (res) {
            $scope.postcodes = res;
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert(err.message);
        });
    };

    $scope.onCheckOutPostcodeSelected = function (item) {
        $scope.order.shipping.subdistrict = item.subdistrict;
        $scope.order.shipping.district = item.district;
        $scope.order.shipping.province = item.province;
    };

    $scope.onCheckOutPostcodeInvalid = function () {
        $scope.order.shipping.subdistrict = '';
        $scope.order.shipping.district = '';
        $scope.order.shipping.province = '';
    };


    $scope.getTotal = function () {
        $scope.total = 0;
        var alldiscountamount = 0;
        var alldeliverycost = 0;
        var subTotal = 0;
        $scope.products = ProductService.getCartProducts();
        $scope.products.forEach(function (item) {
            alldiscountamount += item.discountamount;
            alldeliverycost += item.deliverycost;
            subTotal += item.amount;
        });
        $scope.total = subTotal + alldeliverycost - alldiscountamount;
    };

    $scope.removeProductFromCart = function (index) {
        $ionicActionSheet.show({
            destructiveText: 'ลบสินค้าออกจากตะกร้า',
            cancelText: 'ยกเลิก',
            cancel: function () {
                return true;
            },
            destructiveButtonClicked: function () {
                ProductService.removeProductFromCart(index);
                $scope.products = ProductService.getCartProducts();
                $rootScope.countProduct();
                $scope.getTotal();
                return true;
            }
        });
    };
    $scope.calculate = function (product) {
        ProductService.addProductToCart(product, true);
        $scope.products = ProductService.getCartProducts();
        product.amount = product.qty * product.product.price;
        $rootScope.countProduct();
        $scope.getTotal();
    };

    $scope.getTotal();

    $scope.confirm = function (status) {
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        $scope.confirmedOrder = true;
        $scope.order.docno = (+new Date());
        $scope.order.docdate = new Date();
        if (window.localStorage.platform) {
            $scope.order.src = window.localStorage.platform;
        }
        $scope.order.user = AuthService.getUser();
        $scope.order.platform = 'Mobile';
        $scope.order.shipping.postcode = $scope.order.shipping.postcode ? $scope.order.shipping.postcode.toString() : '';
        // $scope.order.shipping.tel = $scope.order.shipping.tel ? $scope.order.shipping.tel : $scope.order.user.address.tel;
        $scope.order.historystatus = [{
            status: 'confirmed',
            datestatus: new Date()
        }];
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                $scope.order.shipping.sharelocation = {};
                // $scope.order.shipping.sharelocation.latitude = lat;
                // $scope.order.shipping.sharelocation.longitude = lng;
                // เส้นทางตามถนน
                var fullAddress = $scope.order.shipping.address + '+' + $scope.order.shipping.subdistrict + '+' + $scope.order.shipping.district + '+' + $scope.order.shipping.province + '+' + $scope.order.shipping.postcode;
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyATqyCgkKXX1FmgzQJmBMw1olkYYEN7lzE').success(function (response) {
                    if (response.status.toUpperCase() === 'OK') {
                        $scope.order.shipping.sharelocation.latitude = response.results[0].geometry.location.lat;
                        $scope.order.shipping.sharelocation.longitude = response.results[0].geometry.location.lng;
                        ProductService.saveOrder($scope.order).then(function (res) {
                            $ionicLoading.hide();
                            ProductService.clearCart();
                            alert('สร้างการสั่งซื้อเรียบร้อยแล้ว');
                            $state.go('app.tab.confirmed');
                        }, function (err) {
                            $ionicLoading.hide();
                            alert(err.data.message);
                        });
                    } else {

                        $scope.order.shipping.sharelocation.latitude = lat;
                        $scope.order.shipping.sharelocation.longitude = lng;
                        ProductService.saveOrder($scope.order).then(function (res) {
                            $ionicLoading.hide();
                            ProductService.clearCart();
                            alert('สร้างการสั่งซื้อเรียบร้อยแล้ว');
                            $state.go('app.tab.confirmed');
                        }, function (err) {
                            $ionicLoading.hide();
                            alert(err.data.message);
                        });
                    }
                    function successCallback(res) {
                        ProductService.clearCart();
                        $state.go('app.tab.confirmed');

                        $ionicLoading.hide();
                    }
                    function errorCallback(res) {
                        $ionicLoading.hide();
                        vm.error = res.data.message;
                    }
                }).error(function (err) {
                    $ionicLoading.hide();
                    console.log(err);
                });




            }, function (err) {

                $scope.order.shipping.sharelocation = {};
                var fullAddress = $scope.order.shipping.address + '+' + $scope.order.shipping.subdistrict + '+' + $scope.order.shipping.district + '+' + $scope.order.shipping.province + '+' + $scope.order.shipping.postcode;
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyATqyCgkKXX1FmgzQJmBMw1olkYYEN7lzE').success(function (response) {
                    if (response.status.toUpperCase() === 'OK') {
                        $scope.order.shipping.sharelocation.latitude = response.results[0].geometry.location.lat;
                        $scope.order.shipping.sharelocation.longitude = response.results[0].geometry.location.lng;
                        ProductService.saveOrder($scope.order).then(function (res) {
                            ProductService.clearCart();
                            alert('สร้างการสั่งซื้อเรียบร้อยแล้ว');
                            $state.go('app.tab.confirmed');
                            $ionicLoading.hide();
                        }, function (err) {
                            $ionicLoading.hide();
                            alert(err.data.message);
                        });
                    } else {
                        $scope.order.shipping.sharelocation.latitude = '';
                        $scope.order.shipping.sharelocation.longitude = '';
                        ProductService.saveOrder($scope.order).then(function (res) {             
                            ProductService.clearCart();
                            alert('สร้างการสั่งซื้อเรียบร้อยแล้ว');
                            $state.go('app.tab.confirmed');
                            $ionicLoading.hide();
                        }, function (err) {
                            $ionicLoading.hide();
                            alert(err.data.message);
                        });
                    }
                });

                $ionicLoading.hide();

                if (error.code == PositionError.PERMISSION_DENIED) {
                    alert("Permission denied. check setting");
                } else if (error.code == PositionError.POSITION_UNAVAILABLE) {
                    alert("Cannot get position. May be problem with network or can't get a satellite fix.");
                } else if (error.code == PositionError.TIMEOUT) {
                    alert("Geolocation is timed out.");
                } else {
                    alert(error.message);
                }
            });
    };
});