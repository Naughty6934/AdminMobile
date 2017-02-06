angular.module('starter.controllers', ['ionic'])

  .controller('LogInCtrl', function ($scope, $state, AuthService, $rootScope) {
    /*
    var push = new Ionic.Push({
      "debug": true,
      "onNotification": function (notification) {
        //console.log(notification);
        if (notification._raw.additionalData.foreground) {
          //alert(notification.message);

          $rootScope.$broadcast('onNotification');
        }
      }
    });

    push.register(function (token) {
      console.log("My Device token:", token.token);
      window.localStorage.token = JSON.stringify(token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });
    */
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
          $state.go('tab.confirmed');
        });
    }
    $scope.credentials = {}
    $scope.doLogIn = function (credentials) {
      var login = {
        username: credentials.username,
        password: credentials.password
      }
      AuthService.loginUser(login)
        .then(function (response) {
          //console.log(response);
          // alert('then');
          if (response["message"]) {
            $scope.credentials = {}
            alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
          }
          else {
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
                  $state.go('tab.confirmed');
                });
              // alert('success');
            } else {
              alert('คุณไม่มีสิทธิ์เข้าใช้งาน');
            }
          }
        });
      // console.log("doing sign up");

    };
  })

  .controller('ConfirmedCtrl', function ($scope, $http, $state, AuthService, $ionicModal, $rootScope) {
    $scope.init = function () {
      $scope.loadData();
    }

    $scope.loadData = function () {
      AuthService.getOrder()
        .then(function (data) {
          $rootScope.Order = data;
          $rootScope.countOrder = 0;
          if ($rootScope.countOrderApt) {
            $rootScope.countOrderApt = $rootScope.countOrderApt;
          }
          if ($rootScope.countOrderRjt) {
            $rootScope.countOrderRjt = $rootScope.countOrderRjt;
          }
          if ($rootScope.countOrdeWt) {
            $rootScope.countOrdeWt = $rootScope.countOrdeWt;
          }
          $scope.Wait = true;
          $scope.Accept = false;
          $scope.Reject = false;
          $scope.ordersConfirmed = [];

          $scope.ordersAccept = [];
          $scope.ordersReject = [];
          $scope.ordersWait = [];
          $rootScope.countOrderApt = 0;
          $rootScope.countOrderRjt = 0;
          $rootScope.countOrderWt = 0;
          angular.forEach($rootScope.Order, function (order) {
            if (order.deliverystatus === 'confirmed') {
              $scope.ordersConfirmed.push(order);
            } else if (order.deliverystatus === 'accept') {
              $scope.ordersAccept.push(order);
            }
            else if (order.deliverystatus === 'reject') {
              $scope.ordersReject.push(order);
            } else if (order.deliverystatus === 'wait deliver') {
              $scope.ordersWait.push(order);
            }
          })
          $rootScope.countOrder = $scope.ordersConfirmed.length;
          $rootScope.countOrderApt = $scope.ordersAccept.length;
          $rootScope.countOrderRjt = $scope.ordersReject.length;
          $rootScope.countOrderWt = $scope.ordersWait.length;
          $rootScope.orderApt = $scope.ordersAccept;
          $rootScope.orderRjt = $scope.ordersReject;
          $rootScope.orderWt = $scope.ordersWait;

        });


    }

    $scope.gotoDetail = function (data) {
      //alert('go to detail');

      $state.go('tab.detailorder', { data: JSON.stringify(data) });
    }

    $scope.gotoDetail2 = function (data) {
      //alert('go to detail');

      $state.go('tab.detailorder2', { data: JSON.stringify(data) });
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

  .controller('MapCtrl', function ($scope, $http, $state, AuthService, $stateParams, $cordovaGeolocation) {

    console.log('ok');
    $scope.init = function () {
      $scope.readService();
    }
    $scope.readService = function(){
       AuthService.getOrder()
        .then(function (data) {
          $scope.locationConfirmed = [];
          $scope.locationWait = [];
          $scope.locationAccept = [];
          $scope.locationReject = [];
          data.forEach(function (order) {
            if (order.deliverystatus === 'confirmed') {
              //  $scope.mapConfirmed.push(order); 
              if (order.shipping.sharelocation) {
                $scope.locationConfirmed.push(order);
              }
            } else if (order.deliverystatus === 'wait deliver') {
              if (order.shipping.sharelocation) {
                $scope.locationWait.push(order);
              }
            } else if (order.deliverystatus === 'accept') {
              if (order.shipping.sharelocation) {
                $scope.locationAccept.push(order);
              }
            } else if (order.deliverystatus === 'reject') {
              if (order.shipping.sharelocation) {
                $scope.locationReject.push(order);
              }
            }
          });
        });
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

        });
        $scope.readMap();
    }
    $scope.readMap = function () {

      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude

          // alert(lat + ':' + long); 
          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ 
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

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
                title: locations.firstName + " " + locations.lastName,
                map: map
              });
            }
          });
          $scope.locationConfirmed.forEach(function (locations) {
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
          });

          $scope.locationWait.forEach(function (locations) {
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
          });

          $scope.locationAccept.forEach(function (locations) {
            var location = locations.shipping.sharelocation;
            // console.log($scope.locationConfirmed.length);
            var marker = new google.maps.Marker({
              icon: {
                  url: 'http://res.cloudinary.com/hflvlav04/image/upload/v1486371632/sj4niz8oykdqfadnwhbo.png',
                  scaledSize: new google.maps.Size(28, 45),
                  // The origin for this image is (0, 0). 
                  origin: new google.maps.Point(0, 0),
                  // The anchor for this image is the base of the flagpole at (0, 32). 
                  // anchor: new google.maps.Point(0, 0)
                },
              position: new google.maps.LatLng(location.latitude, location.longitude),
              map: map
            });
          });

          $scope.locationReject.forEach(function (locations) {
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
          });

          $scope.map = map;
        }, function (err) {
          // error 
        });


    }

  })

  .controller('MoreCtrl', function ($scope, AuthService, $state) {
    $scope.logOut = function () {
      AuthService.signOut();
      $state.go('login');
    }
  })

  .controller('OrderCtrl', function ($scope, AuthService, $state, $stateParams, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // console.log(JSON.parse($stateParams.data));
    //var orderId = $stateParams.orderId;
    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);

    // $scope.data = JSON.parse($stateParams.data);
    // $scope._id = $scope.data._id

    AuthService.getDeliver()
      .then(function (data) {
        var Deliverlist = data;
        $scope.delivers = [];
        angular.forEach(Deliverlist, function (deliver) {
          if (deliver.roles[0] === 'deliver') {
            $scope.delivers.push(deliver);
          }
          //console.log($scope.delivers);
        })

      });



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
            $state.go('tab.confirmed');
          } else {
            $state.go('tab.detailaccept');
          }

          //tab.confirmed
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
  });
