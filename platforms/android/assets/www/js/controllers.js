angular.module('starter.controllers', ['ionic'])

  .controller('LogInCtrl', function ($scope, $state, AuthService, $rootScope) {
    $rootScope.userStore = AuthService.getUser();

    var push = new Ionic.Push({
      "debug": true,
      "onNotification": function (notification) {
        //console.log(notification);
        if (notification._raw.additionalData.foreground) {
          // alert(notification.message);

          $rootScope.$broadcast('onNotification');
        }
      }
    });

    push.register(function (token) {
      console.log("My Device token:", token.token);
      // alert(token.token);
      window.localStorage.token = JSON.stringify(token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });

    $scope.userStore = AuthService.getUser();
    if ($scope.userStore) {

      var push_usr = {
        user_id: $scope.userStore._id,
        user_name: $scope.userStore.username,
        role: 'admin',
        device_token: JSON.parse(window.localStorage.token || null)
      };
      AuthService.saveUserPushNoti(push_usr)
        .then(function (res) {
          $state.go('app.tab.confirmed');
        });
    }
    $scope.credentials = {}

    $rootScope.$on('userLoggedIn', function (e, response) {
      $rootScope.userStore = AuthService.getUser();
      console.log(response);
      if (response.roles[0] === 'admin') {

        var push_usr = {
          user_id: response._id,
          user_name: response.username,
          role: 'admin',
          device_token: JSON.parse(window.localStorage.token || null)
        };
        AuthService.saveUserPushNoti(push_usr)
          .then(function (res) {
            $scope.credentials = {}
            $state.go('app.tab.confirmed');
            $rootScope.$broadcast('loading:hide');
          });
        // alert('success');
      } else {
        alert('คุณไม่มีสิทธิ์เข้าใช้งาน');
      }
    });

    $rootScope.$on('userFailedLogin', function (e, response) {
      console.log(response);
      // alert(response.message);
      if (response["message"]) {
        // $scope.credentials = {}
        $scope.credentials.password = '';
        $rootScope.$broadcast('loading:hide');
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    });

    $scope.doLogIn = function (credentials) {
      var login = {
        username: credentials.username,
        password: credentials.password
      }
      AuthService.loginUser(login);
      // .then(function (response) {
      //   //console.log(response);
      //   // alert('then');
      //   if (response["message"]) {
      //     $scope.credentials = {}
      //     alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      //   }
      //   else {
      //     if (response.roles[0] === 'admin') {

      //       var push_usr = {
      //         user_id: response._id,
      //         user_name: response.username,
      //         role: 'admin',
      //         device_token: JSON.parse(window.localStorage.token || null)
      //       };
      //       AuthService.saveUserPushNoti(push_usr)
      //         .then(function (res) {
      //           $scope.credentials = {}
      //           $state.go('app.tab.confirmed');
      //         });
      //       // alert('success');
      //     } else {
      //       alert('คุณไม่มีสิทธิ์เข้าใช้งาน');
      //     }
      //   }
      // });
      // console.log("doing sign up");

    };
  })

  .controller('menuCtrl', function ($scope, $ionicHistory, $http, $state, AuthService, $ionicModal, $rootScope, RequestService, ReturnService, StockService, $stateParams, AccuralreceiptsService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $scope.Platform = window.localStorage.adminAppPlatform;
    $scope.toggleLeftSideMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
      // alert('menuCtrl');
    };

    $scope.homes = function () {
      $state.go('app.tab.confirmed');
      $scope.toggleLeftSideMenu();
    };

    $scope.liststocks = function () {
      // $state.go('app.liststock');
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      $scope.toggleLeftSideMenu();
    };

    $scope.listtreturn = function () {
      // $state.go('app.listtreturn');
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $scope.toggleLeftSideMenu();
    };

    $scope.listaccuralreceipt = function () {
      // $state.go('app.listar');
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $scope.toggleLeftSideMenu();
    };

    $scope.listtransports = function () {
      // $state.go('app.listtransports');
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $scope.toggleLeftSideMenu();
    };

    $scope.logOut = function () {
      AuthService.signOut();
      $rootScope.userStore = AuthService.getUser();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('login');
      $scope.toggleLeftSideMenu();
    };

    StockService.getStocks()
      .then(function (data) {
        $rootScope.Stocks = data;
        $rootScope.countStocks = $rootScope.Stocks.length;
      });

    ReturnService.getReturns()
      .then(function (data) {
        $rootScope.countReturns = data.length;
      });

    AccuralreceiptsService.getAccuralreceipts()
      .then(function (data) {
        $rootScope.countAcc = data.length;
      });

    RequestService.getRequests()
      .then(function (data) {
        $rootScope.countTran = data.length;
      });


  })

  .controller('ConfirmedCtrl', function ($scope, $http, $state, AuthService, $ionicModal, $rootScope, $ionicSideMenuDelegate, Socket) {

    $rootScope.ordersConfirmed = [];
    $rootScope.ordersWait = [];
    $rootScope.ordersAccept = [];
    $rootScope.ordersReject = [];
    $rootScope.ordersCancel = [];
    $rootScope.ordersComplete = [];
    $scope.Wait = true;
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.userStore = AuthService.getUser();

    $scope.gotoConfirmed = function () {
      $state.go('app.tab.confirmed');
    }
    $scope.init = function () {
      $rootScope.loadData();
    }
    $rootScope.loadData = function () {
      $rootScope.orders = [];
      AuthService.getOrder()
        .then(function (data) {

          var userStore = AuthService.getUser();

          $rootScope.ordersConfirmed = data.confirmed;
          $rootScope.ordersWait = data.wait;
          $rootScope.ordersAccept = data.accept;
          $rootScope.ordersReject = data.reject;
          $rootScope.ordersCancel = data.cancel;
          $rootScope.ordersComplete = data.complete;
          var orders = [];
          orders = orders.concat($rootScope.ordersConfirmed, $rootScope.ordersWait, $rootScope.ordersReject);
          $rootScope.orders = orders;

          $rootScope.countOrder = $scope.orders.length;
          $rootScope.countOrderApt = $scope.ordersAccept.length;
          $rootScope.countOrderRjt = $scope.ordersReject.length;
          $rootScope.countOrderWt = $scope.ordersWait.length;
          $rootScope.countAccept = $scope.ordersAccept.length;
          $rootScope.countReject = $scope.ordersReject.length;
          $rootScope.countWait = $scope.ordersWait.length;
          // $scope เดิม
          $rootScope.orderApt = $rootScope.ordersAccept;
          $rootScope.orderRjt = $rootScope.ordersReject;
          $rootScope.orderWt = $rootScope.ordersWait;
        });
    }

    $scope.gotoDetail = function (data) {
      //alert('go to detail');

      $state.go('app.tab.detailorder', { data: JSON.stringify(data) });
      AuthService.getDeliverNearBy(data)
        .then(function (order) {
          console.log(order);
          $rootScope.delivers = order;
        });
    }

    $scope.gotoDetail2 = function (data) {
      //alert('go to detail');
      $state.go('app.tab.detailorder2', { data: JSON.stringify(data) });
      AuthService.getDeliverNearBy(data)
        .then(function (order) {
          console.log(order);
          $rootScope.delivers = order;
        });
    }

    $scope.doRefresh = function () {
      $scope.init();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };

    $scope.$on('onNotification', function (event, args) {
      // do what you want to do
      $scope.init();
    });

  })

  .controller('MapCtrl', function ($scope, $http, $state, AuthService, $stateParams, $cordovaGeolocation, $rootScope, $ionicSideMenuDelegate, $ionicHistory) {
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

  })

  .controller('MoreCtrl', function ($scope, $rootScope, AuthService, $state, $ionicModal, RequestService, ReturnService, StockService, $stateParams, AccuralreceiptsService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    if ($stateParams.data) {
      $scope.data = JSON.parse($stateParams.data);
    }
    $scope.logOut = function () {
      AuthService.signOut();
      $state.go('login');
    };


    $scope.init = function () {
      $scope.requestsorders();
      $scope.returnorders();
      $scope.liststock();
      $scope.listaccuralreceipts();

      $scope.waitforreview = true;
      $scope.waitforconfirmed = false;
      $scope.confirmed = false;
      $scope.receipt = false;

      $scope.Returns = true;
      $scope.Response = false;
      $scope.Received = false;

      $scope.Request = true;
    };

    $scope.listaccuralreceipt = function () {
      $state.go('app.listar');
    };

    $scope.liststocks = function () {
      $state.go('app.liststock');
    };

    $scope.liststock = function () {
      StockService.getStocks()
        .then(function (data) {
          $scope.stocks = data;
        })
    };
    // $ionicModal.fromTemplateUrl('templates/modal.html', {
    //   scope: $scope
    // }).then(function (modal) {
    //   $scope.modal = modal;
    // });
    // $scope.liststock = function () {
    //   $state.go('liststock');
    //   $scope.Request = true;
    //   $scope.Response = false;
    //   $scope.Received = false;
    //   $scope.ordersConfirmed = [];

    //   $scope.ordersResponse = [];
    //   $scope.ordersReceived = [];
    //   $scope.ordersRequest = [];
    //   $rootScope.countOrderRes = 0;
    //   $rootScope.countOrderRec = 0;
    //   $rootScope.countOrderReq = 0;
    // };
    $scope.listtransports = function () {
      $state.go('app.listtransports');
    };

    $scope.listtreturn = function () {
      $state.go('app.listtreturn');
    };

    $scope.requestsorders = function () {
      RequestService.getRequests()
        .then(function (data) {
          var requestlist = data;

          $scope.listRequest = [];
          $scope.listResponse = [];
          $scope.listReceived = [];
          requestlist.forEach(function (request) {
            if (request.deliverystatus === 'request') {
              $scope.listRequest.push(request);
              $scope.countRequest = $scope.listRequest.length;
            }
            else if (request.deliverystatus === 'response') {
              $scope.listResponse.push(request);
              $scope.countResponse = $scope.listResponse.length;
            }
            else if (request.deliverystatus === 'received') {
              $scope.listReceived.push(request);
              $scope.countReceived = $scope.listReceived.length;
            }
          })
          console.log($scope.listRequest.length);
          console.log($scope.listResponse.length);
          console.log($scope.listReceived.length);
        })
    }

    $scope.listaccuralreceipts = function () {
      AccuralreceiptsService.getAccuralreceipts()
        .then(function (data) {
          var Arlist = data;

          $scope.listWaitforreview = [];
          $scope.listWaitforconfirmed = [];
          $scope.listConfirmed = [];
          $scope.listReceipt = [];
          Arlist.forEach(function (waitOr) {
            if (waitOr.arstatus === 'wait for review') {
              $scope.listWaitforreview.push(waitOr);
              $scope.countWaitforreview = $scope.listWaitforreview.length;
            }
            else if (waitOr.arstatus === 'wait for confirmed') {
              $scope.listWaitforconfirmed.push(waitOr);
              $scope.countWaitforconfirmed = $scope.listWaitforconfirmed.length;
            }
            else if (waitOr.arstatus === 'confirmed') {
              $scope.listConfirmed.push(waitOr);
              $scope.countConfirmed = $scope.listConfirmed.length;
            }
            else if (waitOr.arstatus === 'receipt') {
              $scope.listReceipt.push(waitOr);
              $scope.countReceipt = $scope.listReceipt.length;
            }
          })
          // console.log($scope.listWaitforreview.length);
          // console.log($scope.listWaitforconfirmed.length);
          // console.log($scope.listConfirmed.length);
          // console.log($scope.listReceipt.length);
        })
    }

    $scope.returnorders = function () {
      ReturnService.getReturns()
        .then(function (data) {
          var returnlist = data;
          $scope.listReturnRet = [];
          $scope.listReturnRes = [];
          $scope.listReturnRec = [];
          returnlist.forEach(function (returnOr) {
            if (returnOr.deliverystatus === 'return') {
              $scope.listReturnRet.push(returnOr);
              $scope.countReturnRet = $scope.listReturnRet.length;
            }
            else if (returnOr.deliverystatus === 'response') {
              $scope.listReturnRes.push(returnOr);
              $scope.countReturnRes = $scope.listReturnRes.length;
            }
            else if (returnOr.deliverystatus === 'received') {
              $scope.listReturnRec.push(returnOr);
              $scope.countReturnRec = $scope.listReturnRec.length;
            }
          })
        })
    }

    $scope.returnDetail = function (data) {
      $state.go('app.returndetail', { data: JSON.stringify(data) });
    }


    $scope.requestDetail = function (data) {
      $state.go('app.requestdetail', { data: JSON.stringify(data) });
    }

    $scope.detailstock = function (data) {
      $state.go('app.detailstock', { data: JSON.stringify(data) });
    }

    $scope.arDetail = function (data) {
      $state.go('app.detailar', { data: JSON.stringify(data) });
    }

    $scope.doRefresh = function () {
      $scope.init();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };

  })

  .controller('MoreDetailCtrl', function ($scope, $rootScope, $stateParams, AuthService, $state, $ionicModal, RequestService, ReturnService, AccuralreceiptsService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);

    $scope.returnOrder = function (item) {
      var listord =
        {
          status: 'received',
          datestatus: new Date()
        };
      item.historystatus.push(listord);

      var status = item.deliverystatus;
      status = 'received';
      var returnorder = {
        deliverystatus: status,
        historystatus: item.historystatus,
        transport: $scope.userStore
      }
      var returnorderId = item._id;


      ReturnService.updateReturnOrder(returnorderId, returnorder)
        .then(function (received) {
          // alert('success'); 
          $state.go('app.listtreturn');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

    };

    $scope.updatewaitconfirmed = function (item) {
      var listwaitconfirmed =
        {
          status: 'wait for confirmed',
          datestatus: new Date()
        };
      item.historystatus.push(listwaitconfirmed);

      var status = item.deliverystatus;
      status = 'wait for confirmed';
      var accuralreceipt = {
        arstatus: status,
        historystatus: item.historystatus
      }
      var accuralreceiptsId = item._id;


      AccuralreceiptsService.updateaccuralreceipt(accuralreceiptsId, accuralreceipt)
        .then(function (response) {
          // alert('success');
          $state.go('tab.listar');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

    };

    $scope.updateconfirmed = function (item) {
      var listconfirmed =
        {
          status: 'receipt',
          datestatus: new Date()
        };
      item.historystatus.push(listconfirmed);

      var status = item.deliverystatus;
      status = 'receipt';
      var accuralreceipt = {
        arstatus: status,
        historystatus: item.historystatus
      }
      var accuralreceiptsId = item._id;


      AccuralreceiptsService.updateaccuralreceipt(accuralreceiptsId, accuralreceipt)
        .then(function (response) {
          // alert('success');
          $state.go('tab.listar');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

    };

  })

  .controller('OrderconCtrl', function ($scope, $rootScope, AuthService, $state, $stateParams, $ionicModal, $ionicSideMenuDelegate, Socket) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $rootScope.chattype = 'confirm';

    $scope.gotoChat = function (user) {
      if ($rootScope.chattype === 'normal' || $rootScope.chattype === 'accept') {
        $rootScope.chattype = 'confirm';
      }
      // alert($rootScope.chattype);
      var data = {
        name: $scope.userStore.username + '' + user.username,
        type: 'P',
        users: [$scope.userStore, user],
        user: $scope.userStore
      };

      Socket.emit('createroom', data);
      // Add an event listener to the 'invite' event
      Socket.on('invite', function (res) {
        console.log('invite ConfirmedCtrl');
        // alert('invite : ' + JSON.stringify(data));
        Socket.emit('join', res);
      });

      // Add an event listener to the 'joinsuccess' event
      Socket.on('joinsuccess', function (data) {
        console.log('joinsuccess ConfirmedCtrl');
        $scope.room = data;
        if ($rootScope.chattype === 'confirm') {
          $state.go('app.tab.chat-detailconfirm', { chatId: data._id });
        }
        // $state.go('app.tab.chat-detail', { chatId: data._id });
        // $scope.pageDown();
        // alert('joinsuccess : ' + JSON.stringify(data));
      });
    }


    $scope.setItem = function () {
      window.localStorage.point = $stateParams.data;
    }

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;

    });

    $scope.btnGoProfile = function (data) {
      console.log(data);
      $state.go('app.tab.deliver-profile3', { data: JSON.stringify(data) });
    };

    $scope.btnGoProfileAccept = function (data) {
      console.log(data);
      $state.go('app.tab.deliver-profile', { data: JSON.stringify(data) });
    };

    // console.log(JSON.parse($stateParams.data));
    //var orderId = $stateParams.orderId;
    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);

    // $scope.data = JSON.parse($stateParams.data);
    // $scope._id = $scope.data._id


    // AuthService.getDeliver()
    //   .then(function (data) {
    //     var Deliverlist = data;
    //     $scope.delivers = [];
    //     angular.forEach(Deliverlist, function (deliver) {
    //       if (deliver.roles[0] === 'deliver') {
    //         $scope.delivers.push(deliver);
    //       }
    //     })

    //   });



    $scope.chooseDeliver = function (deli) {
      /*
      var history = {
        status: 'wait deliver',
        datestatus: new Date()
      }
      $scope.data.historystatus.push(history);
      $scope.data = {
        namedeliver: deli,
        deliverystatus: 'wait deliver',
        historystatus: $scope.order.historystatus
      }
      */
      $scope.data.namedeliver = deli;

      $scope.modal.hide();
      //var order = $scope.order;
      //var orderId = $scope._id;

    }
    $scope.save = function () {
      var history = {
        status: 'wait deliver',
        datestatus: new Date()
      };
      var oldStatus = $scope.data.deliverystatus;
      $scope.data.deliverystatus = 'wait deliver';
      $scope.data.historystatus.push(history);


      AuthService.updateOrder($scope.data._id, $scope.data)
        .then(function (response) {
          //alert('Success');
          if (oldStatus == 'confirmed') {
            $state.go('app.tab.confirmed');
          } else {
            $state.go('app.tab.detailaccept');
          }

          //app.tab.confirmed
        }, function (error) {
          console.log(error);
          //alert('dont success' + " " + error.data.message);
        });

    }
    $scope.$on('onNotification', function (event, args) {
      // do what you want to do
      //$scope.init();
      //alert('');
    });
    $scope.tel = function (telnumber) {
      var reNumber = '';
      var regex = /(\d+)/g;
      var reNum = telnumber.match(regex);
      reNum.forEach(function (item) {
        reNumber += item
      });
      // alert(reNumber);
      window.location = 'tel:' + reNumber;

    };

  })

  .controller('OrderaccCtrl', function ($scope, $rootScope, AuthService, $state, $stateParams, $ionicModal, $ionicSideMenuDelegate, Socket) {

    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $rootScope.chattype = 'accept';

    $scope.gotoChat = function (user) {
      if ($rootScope.chattype === 'normal' || $rootScope.chattype === 'confirm') {
        $rootScope.chattype = 'accept';
      }
      // alert($rootScope.chattype);
      var data = {
        name: $scope.userStore.username + '' + user.username,
        type: 'P',
        users: [$scope.userStore, user],
        user: $scope.userStore
      };

      Socket.emit('createroom', data);
      // Add an event listener to the 'invite' event
      Socket.on('invite', function (res) {
        console.log('invite ConfirmedCtrl');
        // alert('invite : ' + JSON.stringify(data));
        Socket.emit('join', res);
      });

      // Add an event listener to the 'joinsuccess' event
      Socket.on('joinsuccess', function (data) {
        console.log('joinsuccess ConfirmedCtrl');
        $scope.room = data;
        if ($rootScope.chattype === 'accept') {
          $state.go('app.tab.chat-detailaccept', { chatId: data._id });
        }
        // $state.go('app.tab.chat-detail', { chatId: data._id });
        // $scope.pageDown();
        // alert('joinsuccess : ' + JSON.stringify(data));
      });
    }


    $scope.setItem = function () {
      window.localStorage.point = $stateParams.data;
    }

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;

    });

    $scope.btnGoProfile = function (data) {
      console.log(data);
      $state.go('app.tab.deliver-profile3', { data: JSON.stringify(data) });
    };

    $scope.btnGoProfileAccept = function (data) {
      console.log(data);
      $state.go('app.tab.deliver-profile', { data: JSON.stringify(data) });
    };

    // console.log(JSON.parse($stateParams.data));
    //var orderId = $stateParams.orderId;
    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);

    // $scope.data = JSON.parse($stateParams.data);
    // $scope._id = $scope.data._id


    // AuthService.getDeliver()
    //   .then(function (data) {
    //     var Deliverlist = data;
    //     $scope.delivers = [];
    //     angular.forEach(Deliverlist, function (deliver) {
    //       if (deliver.roles[0] === 'deliver') {
    //         $scope.delivers.push(deliver);
    //       }
    //     })

    //   });



    $scope.chooseDeliver = function (deli) {
      /*
      var history = {
        status: 'wait deliver',
        datestatus: new Date()
      }
      $scope.data.historystatus.push(history);
      $scope.data = {
        namedeliver: deli,
        deliverystatus: 'wait deliver',
        historystatus: $scope.order.historystatus
      }
      */
      $scope.data.namedeliver = deli;

      $scope.modal.hide();
      //var order = $scope.order;
      //var orderId = $scope._id;

    }
    $scope.save = function () {
      var history = {
        status: 'wait deliver',
        datestatus: new Date()
      };
      var oldStatus = $scope.data.deliverystatus;
      $scope.data.deliverystatus = 'wait deliver';
      $scope.data.historystatus.push(history);


      AuthService.updateOrder($scope.data._id, $scope.data)
        .then(function (response) {
          //alert('Success');
          if (oldStatus == 'confirmed') {
            $state.go('app.tab.confirmed');
          } else {
            $state.go('app.tab.detailaccept');
          }

          //app.tab.confirmed
        }, function (error) {
          console.log(error);
          //alert('dont success' + " " + error.data.message);
        });

    }
    $scope.$on('onNotification', function (event, args) {
      // do what you want to do
      //$scope.init();
      //alert('');
    });
    $scope.tel = function (telnumber) {
      var reNumber = '';
      var regex = /(\d+)/g;
      var reNum = telnumber.match(regex);
      reNum.forEach(function (item) {
        reNumber += item
      });
      // alert(reNumber);
      window.location = 'tel:' + reNumber;

    };

  })

  .controller('ProfileDeliverconfirmCtrl', function ($scope, $rootScope, $state, $stateParams, AuthService, $ionicSideMenuDelegate, Socket) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $rootScope.chattype = 'Proconfirm';

    $scope.gotoChat = function (user) {
      if ($rootScope.chattype === 'normal') {
        $rootScope.chattype = 'Proconfirm';
      }
      // alert($rootScope.chattype);
      var data = {
        name: $scope.userStore.username + '' + user.username,
        type: 'P',
        users: [$scope.userStore, user],
        user: $scope.userStore
      };

      Socket.emit('createroom', data);
      // Add an event listener to the 'invite' event
      Socket.on('invite', function (res) {
        console.log('invite ConfirmedCtrl');
        // alert('invite : ' + JSON.stringify(data));
        Socket.emit('join', res);
      });

      // Add an event listener to the 'joinsuccess' event
      Socket.on('joinsuccess', function (data) {
        console.log('joinsuccess ConfirmedCtrl');
        $scope.room = data;
        if ($rootScope.chattype === 'Proconfirm') {
          $state.go('app.tab.chat-detailproconfirm', { chatId: data._id });
        }
        // $state.go('app.tab.chat-detail', { chatId: data._id });
        // $scope.pageDown();
        // alert('joinsuccess : ' + JSON.stringify(data));
      });
    }


    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);


    $scope.tel = function (telnumber) {
      var reNumber = '';
      var regex = /(\d+)/g;
      var reNum = telnumber.match(regex);
      reNum.forEach(function (item) {
        reNumber += item
      });
      // alert(reNumber);
      window.location = 'tel:' + reNumber;

    };

  })

  .controller('ProfileDeliveracceptCtrl', function ($scope, $rootScope, $state, $stateParams, AuthService, $ionicSideMenuDelegate, Socket) {
    // alert('ProfileDeliveracceptCtrl');
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $rootScope.chattype = 'Proaccept';

    $scope.gotoChat = function (user) {
      if ($rootScope.chattype === 'normal') {
        $rootScope.chattype = 'Proaccept';
      }
      // alert($rootScope.chattype);
      var data = {
        name: $scope.userStore.username + '' + user.username,
        type: 'P',
        users: [$scope.userStore, user],
        user: $scope.userStore
      };

      Socket.emit('createroom', data);
      // Add an event listener to the 'invite' event
      Socket.on('invite', function (res) {
        console.log('invite ConfirmedCtrl');
        // alert('invite : ' + JSON.stringify(data));
        Socket.emit('join', res);
      });

      // Add an event listener to the 'joinsuccess' event
      Socket.on('joinsuccess', function (data) {
        console.log('joinsuccess ConfirmedCtrl');
        $scope.room = data;
        if ($rootScope.chattype === 'Proaccept') {
          $state.go('app.tab.chat-detailproaccept', { chatId: data._id });
        }
        // $state.go('app.tab.chat-detail', { chatId: data._id });
        // $scope.pageDown();
        // alert('joinsuccess : ' + JSON.stringify(data));
      });
    }


    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);


    $scope.tel = function (telnumber) {
      var reNumber = '';
      var regex = /(\d+)/g;
      var reNum = telnumber.match(regex);
      reNum.forEach(function (item) {
        reNumber += item
      });
      // alert(reNumber);
      window.location = 'tel:' + reNumber;

    };

  })

  .controller('ChatCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, Socket, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.user = AuthService.getUser();
    //  alert(JSON.stringify($scope.user));
    $scope.listRoom = function () {
      roomService.getrooms().then(function (res) {
        // alert(JSON.stringify(res));
        $scope.chats = res;
      }, function (err) {
        // alert(JSON.stringify(err));
        console.log(err);
      });
    };
    $scope.listRoom();
    $scope.createRoom = function (data) {
      roomService.createRoom(data).then(function (res) {
        $scope.listRoom();
      }, function (err) {
        console.log(err);
      });
    };

    Socket.on('invite', function (res) {
      $scope.listRoom();
    });

  })

  .controller('ChatDetailCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, $stateParams, Socket, $ionicScrollDelegate, $timeout, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });

    if ($rootScope.chattype) {
      $rootScope.chattype = 'normal';
    } else {
      $rootScope.chattype = 'normal';
    }

    $scope.user = AuthService.getUser();
    $scope.messages = [];
    $scope.chat = null;
    $scope.room = {};
    Socket.connect();
    // ทดสอบ mobile connect
    // Socket.on('mobile', function (message) {
    //   $scope.messages.unshift(message);
    // });
    $scope.loadRoom = function () {
      var roomId = $stateParams.chatId;
      roomService.getRoom(roomId).then(function (res) {
        res.users.forEach(function (user) {
          if ($scope.user._id != user._id) {
            $scope.title = user.displayName;
          }
        });
        $scope.chat = res;
        Socket.emit('join', $scope.chat);
      }, function (err) {
        console.log(err);
      });
    };

    // Add an event listener to the 'invite' event
    Socket.on('invite', function (res) {
      console.log('invite Chat');

      // alert('invite : ' + JSON.stringify(data));
      Socket.emit('join', res);
    });

    // Add an event listener to the 'joinsuccess' event
    Socket.on('joinsuccess', function (data) {
      console.log('joinsuccess Chat');

      $scope.room = data;
      $scope.pageDown();
      // alert('joinsuccess : ' + JSON.stringify(data));
    });

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (data) {
      // alert(JSON.stringify(data));
      $scope.room = data;
    });
    $scope.hideTime = true;
    var alternate,
      isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // alternate = !alternate
      // if (!$scope.room.messages) {
      //     $scope.room.messages = [];
      $scope.room.messages.unshift({
        type: 'message',
        created: Date.now(),
        profileImageURL: $scope.user.profileImageURL,
        username: $scope.user.displayName,
        text: this.message
      });
      // } else {
      //     $scope.room.messages.unshift({
      //         type: 'message',
      //         created: Date.now(),
      //         profileImageURL: $scope.user.profileImageURL,
      //         username: $scope.user.username,
      //         text: this.message
      //     });
      // }
      $ionicScrollDelegate.scrollBottom(true);

      Socket.emit('chatMessage', $scope.room);
      this.message = '';
    };


    $scope.pageDown = function () {
      $timeout(function () {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);
    };







    // $scope.sendMessage = function () {
    //     alternate = !alternate;

    //     // var d = new Date();
    //     // d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    //     // $scope.room.messages.forEach(function(message){

    //     // });
    //     $scope.messages.push({
    //         userId: alternate ? '12345' : '54321',
    //         text: $scope.room.message,
    //         time: d
    //     });

    //     delete $scope.room.message;
    //     $ionicScrollDelegate.scrollBottom(true);

    // };

    $scope.inputUp = function () {
      // if (isIOS) $scope.room.keyboardHeight = 216;
      $timeout(function () {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);

    };

    $scope.inputDown = function () {
      // if (isIOS) $scope.room.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function () {
      // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = $scope.user.displayName;
  })

  .controller('FriendsCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, Socket, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.user = AuthService.getUser();
    $scope.listAccount = function () {
      $scope.listRoom = [];
      $scope.friends = [];
      roomService.getrooms().then(function (rooms) {
        rooms.forEach(function (room) {
          room.users.forEach(function (user) {
            if ($scope.user._id === user._id) {
              $scope.listRoom.push(room);
            }
          });
        });
        if ($scope.listRoom.length > 0) {
          $scope.listRoom.forEach(function (room) {
            room.users.forEach(function (user) {
              if ($scope.user._id !== user._id) {
                $scope.friends.push(user);
              }
            });
          });
        }
        AuthService.getusers().then(function (accounts) {
          $scope.accounts = accounts;
        }, function (err) {
          console.log(err);
        });
      });
    };
    $scope.listAccount();
    $scope.addFriend = function (user) {
      var data = {
        name: $scope.user.username + '' + user.username,
        type: 'P',
        users: [$scope.user, user],
        user: $scope.user
      };
      Socket.emit('createroom', data);
    };
  })
  ;
