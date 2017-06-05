adminApp.controller('MapCtrl', function ($scope, $http, $state, AuthService, $stateParams, $cordovaGeolocation, $rootScope, $ionicSideMenuDelegate, $ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
        $ionicHistory.clearHistory();
        $ionicSideMenuDelegate.canDragContent(false);
    });
    $rootScope.userStore = AuthService.getUser();
    var lat = null;
    var long = null;
    var map;

    console.log('ok');
    $scope.init = function () {
        $scope.readMap();
    }

    $scope.clearItem = function () {
        window.localStorage.removeItem("point");
        $state.go('app.tab.map');
    }

    $scope.readMap = function () {
        if ($rootScope.loadData) {
            $rootScope.loadData();
        }
        $scope.locationOrders = [];
        $scope.locationOrdersApt = [];

        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                lat = position.coords.latitude
                long = position.coords.longitude
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                $scope.map = map;

                if (!window.localStorage.point || window.localStorage.point === "") {

                    $scope.locationConfirmed = $rootScope.ordersConfirmed;
                    $scope.locationWait = $rootScope.ordersWait;
                    $scope.locationAccept = $rootScope.ordersAccept;
                    $scope.locationReject = $rootScope.ordersReject;

                    AuthService.getDeliver()
                        .then(function (data) {
                            var Deliverlist = data;
                            $scope.locationDeliver = [];
                            angular.forEach(Deliverlist, function (deliver) {
                                if (deliver.roles[0] === 'deliver') {
                                    $scope.locationDeliver.push(deliver);
                                }
                                //console.log($scope.delivers);

                            })

                            //////ตำแหน่งที่ mark ปัจจุบัน/////////// 
                            var marker = new google.maps.Marker({
                                position: map.getCenter(),
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 15,
                                    fillColor: 'blue',
                                    fillOpacity: 0.2,
                                    strokeColor: 'blue',
                                    strokeWeight: 0
                                },
                                draggable: true,
                                map: map
                            });
                            var marker = new google.maps.Marker({
                                position: map.getCenter(),
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 10,
                                    fillColor: '#1c90f3',
                                    fillOpacity: 0.5,
                                    strokeColor: 'white',
                                    strokeWeight: 1
                                },
                                draggable: true,
                                map: map
                            });
                            $scope.locationDeliver.forEach(function (locations) {
                                var contentString = '<div>'
                                    + '<label>' + locations.displayName + '</label><br>'
                                    + 'โทร : ' + '<a href="tel:' + locations.address.tel + '">' + locations.address.tel + '</a>'
                                    + '</div>';
                                var location = locations.address.sharelocation;
                                if (location) {
                                    var marker = new google.maps.Marker({
                                        icon: {
                                            url: 'http://res.cloudinary.com/hflvlav04/image/upload/v1486371430/rbxhgg4rwbionmqfusxc.png',
                                            scaledSize: new google.maps.Size(28, 36),
                                            // The origin for this image is (0, 0). 
                                            origin: new google.maps.Point(0, 0),
                                            // The anchor for this image is the base of the flagpole at (0, 32). 
                                            // anchor: new google.maps.Point(0, 32)
                                        },
                                        position: new google.maps.LatLng(location.latitude, location.longitude),
                                        map: map
                                    });
                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString
                                    });
                                    marker.addListener('click', function () {
                                        console.log('click');
                                        infowindow.open($scope.map, this);
                                    });
                                }
                            });
                            $scope.locationConfirmed.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                })
                                var contentString = '<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '</div>';
                                var location = locations.shipping.sharelocation;
                                // console.log($scope.locationConfirmed.length);
                                var marker = new google.maps.Marker({
                                    icon: {
                                        url: ' http://res.cloudinary.com/hflvlav04/image/upload/v1486371637/zfx1xml50sn5rn8bu26h.png',
                                        scaledSize: new google.maps.Size(32, 51),
                                        // The origin for this image is (0, 0). 
                                        origin: new google.maps.Point(0, 0),
                                        // The anchor for this image is the base of the flagpole at (0, 32). 
                                        // anchor: new google.maps.Point(0, 32)
                                    },
                                    position: new google.maps.LatLng(location.latitude, location.longitude),
                                    map: map
                                });
                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });
                                marker.addListener('click', function () {
                                    console.log('click');
                                    infowindow.open($scope.map, this);
                                });
                            });

                            $scope.locationWait.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                })
                                var contentString = '<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '</div>';
                                var location = locations.shipping.sharelocation;
                                // console.log($scope.locationConfirmed.length);
                                var marker = new google.maps.Marker({
                                    icon: {
                                        url: ' http://res.cloudinary.com/hflvlav04/image/upload/v1486371643/riwxnxtjdfjganurw46m.png',
                                        scaledSize: new google.maps.Size(32, 51),
                                        // The origin for this image is (0, 0). 
                                        origin: new google.maps.Point(0, 0),
                                        // The anchor for this image is the base of the flagpole at (0, 32). 
                                        // anchor: new google.maps.Point(0, 32)
                                    },
                                    position: new google.maps.LatLng(location.latitude, location.longitude),
                                    map: map
                                });
                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });
                                marker.addListener('click', function () {
                                    console.log('click');
                                    infowindow.open($scope.map, this);
                                });
                            });

                            $scope.locationAccept.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                })
                                var contentString = '<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '</div>';
                                var location = locations.shipping.sharelocation;
                                // console.log($scope.locationConfirmed.length);
                                var marker = new google.maps.Marker({
                                    icon: {
                                        url: 'http://res.cloudinary.com/hflvlav04/image/upload/v1486371632/sj4niz8oykdqfadnwhbo.png',
                                        scaledSize: new google.maps.Size(30, 48),
                                        // The origin for this image is (0, 0). 
                                        origin: new google.maps.Point(0, 0),
                                        // The anchor for this image is the base of the flagpole at (0, 32). 
                                        // anchor: new google.maps.Point(0, 0)
                                    },
                                    position: new google.maps.LatLng(location.latitude, location.longitude),
                                    map: map
                                });
                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });
                                marker.addListener('click', function () {
                                    console.log('click');
                                    infowindow.open($scope.map, this);
                                });
                            });

                            $scope.locationReject.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                })
                                var contentString = '<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '</div>';
                                var location = locations.shipping.sharelocation;
                                // console.log($scope.locationConfirmed.length);
                                var marker = new google.maps.Marker({
                                    icon: {
                                        url: ' http://res.cloudinary.com/hflvlav04/image/upload/v1486371639/igflklgols9u1kflmmkh.png',
                                        scaledSize: new google.maps.Size(28, 45),
                                        // The origin for this image is (0, 0). 
                                        origin: new google.maps.Point(0, 0),
                                        // The anchor for this image is the base of the flagpole at (0, 32). 
                                        // anchor: new google.maps.Point(0, 32)
                                    },
                                    position: new google.maps.LatLng(location.latitude, location.longitude),
                                    map: map
                                });
                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });
                                marker.addListener('click', function () {
                                    console.log('click');
                                    infowindow.open($scope.map, this);
                                });
                            });

                        });
                } else {
                    AuthService.getDeliver()
                        .then(function (data) {
                            var Deliverlist = data;
                            $scope.locationDeliver = [];
                            var Deliver = [];
                            var count = 0;
                            var item = JSON.parse(window.localStorage.point);
                            angular.forEach(Deliverlist, function (deliver) {
                                if (deliver.roles[0] === 'deliver') {
                                    if (deliver.address.sharelocation) {
                                        // console.log(deliver);
                                        Deliver.push(deliver);
                                        $http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + deliver.address.sharelocation.latitude + ',' + deliver.address.sharelocation.longitude + '&destinations=' + item.shipping.sharelocation.latitude + ',' + item.shipping.sharelocation.longitude + '&key=AIzaSyBY4B67oPlLL9AdfXNTQl6JP_meTTzq8xY').success(function (distance) {
                                            // alert(JSON.stringify(distance.rows[0].elements[0].distance.value));
                                            count++;
                                            if (distance.rows[0].elements[0].distance.value) {
                                                deliver.distance = distance.rows[0].elements[0].distance.value;
                                                $scope.locationDeliver.push(deliver);

                                                if (count === Deliver.length) {

                                                    $scope.locationDeliver.sort(function (a, b) {
                                                        if (a.distance < b.distance)
                                                            return -1;
                                                        if (a.distance > b.distance)
                                                            return 1;
                                                        return 0;
                                                    });

                                                    var nearBy = $scope.locationDeliver.slice(0, 3);
                                                    nearBy[0].isShow = true;
                                                    nearBy[1].isShow = false;
                                                    nearBy[2].isShow = false;
                                                    // console.log(nearBy);
                                                    nearBy.forEach(function (near) {

                                                        var pointStart = {
                                                            deliver: near,
                                                            lat: parseFloat(near.address.sharelocation.latitude),
                                                            lng: parseFloat(near.address.sharelocation.longitude)
                                                        }

                                                        $scope.calcRoute(pointStart);
                                                    });

                                                }
                                            }
                                        }).error(function (err) {
                                            console.log(err);
                                        });

                                    }

                                }

                            })


                        });

                }

            }, function (err) {
                // error
            });
    }
    $scope.calcRoute = function (pointStart) {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        var item = JSON.parse(window.localStorage.point);

        if (item) {
            if (item.shipping.firstname) {
                $scope.firstname = item.shipping.firstname;
            }
            if (item.shipping.lastname) {
                $scope.lastname = item.shipping.lastname;
            }
            if (item.shipping.firstName) {
                $scope.firstname = item.shipping.firstName;
            }
            if (item.shipping.lastName) {
                $scope.lastname = item.shipping.lastName;
            }
        }
        if (item) {
            var pointEnd = {
                lat: parseFloat(item.shipping.sharelocation.latitude),
                lng: parseFloat(item.shipping.sharelocation.longitude)
            }
            var routePoints = {
                start: { lat: pointStart.lat, lng: pointStart.lng },
                end: { lat: pointEnd.lat, lng: pointEnd.lng }
            }
            // directionsDisplay.setDirections({ routes: [] });
            directionsDisplay.setMap($scope.map);

            var start = routePoints.start;
            var end = routePoints.end;
            // var journeyLeg = {
            //   "location": item.shipping.postcode,
            //   "stopover": true
            // };
            var request = {
                origin: start,
                destination: end,
                // waypoints: [journeyLeg],
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var step = 1;
                    var infoDeliver;
                    var infowindoworder;
                    var distantText = (pointStart.deliver.distance / 1000).toFixed(0) + ' กม.';
                    infoDeliver = distantText
                        + "<br>"
                        + pointStart.deliver.displayName
                        + "<br>"
                        + 'โทร : ' + '<a href="tel:' + pointStart.deliver.address.tel + '">' + pointStart.deliver.address.tel + '</a>'
                        + "<br>"
                        + pointStart.deliver.address.address + ' ' + pointStart.deliver.address.district + ' ' + pointStart.deliver.address.subdistrict + ' ' + pointStart.deliver.address.province + ' ' + pointStart.deliver.address.postcode;
                    // infoDeliver.setPosition(response.routes[0].legs[0].steps[step].end_location);
                    // infoDeliver.open($scope.map);

                    var product = '';
                    var price = null;
                    item.items.forEach(function (pro) {
                        product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                    })
                    // 
                    if (pointStart.deliver.isShow) {
                        var nearDeliver = new google.maps.InfoWindow();
                        nearDeliver.setContent(infoDeliver);
                        nearDeliver.setPosition(response.routes[0].legs[0].steps[step].start_location);
                        nearDeliver.open($scope.map);
                    }
                    // 
                    infowindoworder = '<label>' + $scope.firstname + ' ' + $scope.lastname + '</label><br>'
                        + '<p>' + item.shipping.address + ' ' + item.shipping.subdistrict + ' ' + item.shipping.district + ' ' + item.shipping.province + ' ' + item.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + item.shipping.tel + '">' + item.shipping.tel + '</a>' + '</p>'
                        + '<p>' + product + '</p>'
                        + '<label>' + 'ราคารวม : ' + item.amount + ' บาท' + '</label><br>'
                        + '<label>' + 'ค่าจัดส่ง : ' + item.deliveryamount + ' บาท' + '</label><br>'
                        + '<label>' + 'ส่วนลด : ' + item.discountpromotion + ' บาท' + '</label><br>'
                        + '<label>' + 'รวมสุทธิ : ' + item.totalamount + ' บาท' + '</label>'
                        ;
                    // infowindoworder.setPosition({ lat: pointEnd.lat, lng: pointEnd.lng });
                    // infowindoworder.open($scope.map);

                    response.routes[0].legs[0].start_address = infoDeliver;
                    response.routes[0].legs[0].end_address = infowindoworder;
                    response.routes[0].legs[0].start_address
                    directionsDisplay.setDirections(response);


                }
            });
        }

        // window.localStorage.removeItem("point");
        return;

    }
    $scope.pinDirection = function (lati, lngi) {
        var routePoints = {
            start: { lat: lat, lng: long },
            end: { lat: parseFloat(lati), lng: parseFloat(lngi) }
        }

        directionsDisplay.setDirections({ routes: [] });
        directionsDisplay.setMap($scope.map);

        var start = routePoints.start;
        var end = routePoints.end;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }

});