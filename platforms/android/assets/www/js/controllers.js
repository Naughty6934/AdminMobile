angular.module('starter.controllers', ['ionic'])

.controller('MapCtrl', function ($scope,$cordovaGeolocation ,AuthService) {
    console.log('ok');

    var locations = [
      [13.9351084, 100.715099],
      [13.9341505, 100.7141161],
      [13.9347128, 100.7163853]
    ]
    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 18,
          center: new google.maps.LatLng(13.9351084, 100.715099), //เปลี่ยนตามต้องการ
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        for (var i = 0; i < locations.length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][0], locations[i][1]),
            map: map
          });
        }
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
        
var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var lat = position.coords.latitude
        var long = position.coords.longitude
        alert(lat + ':' + long);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 18,
          center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
          mapTypeId: google.maps.MapTypeId.ROADMAP
})
        });
        $scope.map = map;
     

    



  


///////////////////////////


  })




  .controller('ConfirmedCtrl', function ($scope, $http, $state, AuthService, $ionicModal) {

    $scope.init = function () {
      $scope.ordersConfirmed = [];
      AuthService.getOrder()
        .then(function (data) {
          var orderlist = data;
          angular.forEach(orderlist, function (order) {
            if (order.deliverystatus === 'confirmed' || order.deliverystatus === 'wait deliver') {
              $scope.ordersConfirmed.push(order);
            }
          })
          console.log($scope.ordersConfirmed.length);
        });
    }
    $scope.DetailOrder = function (data) {
      $state.go('detailorder', { data: JSON.stringify(data) });
    }

    $scope.doRefresh = function () {
      $scope.init();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };


  })

  .controller('LogInCtrl', function ($scope, $state, AuthService) {
     $scope.userStore = AuthService.getUser();
     if( $scope.userStore){
           $state.go('tab.confirmed');
     }
    $scope.credentials = {}
    $scope.doLogIn = function (credentials) {
      var login = {
        username: credentials.username,
        password: credentials.password
      }
      AuthService.loginUser(login)
        .then(function (response) {
          if (response.roles[0] === 'admin') {
            $scope.credentials = {}
            $state.go('tab.confirmed');
            alert('เข้าสู่ระบบผู้ดูแลระบบ');
          } else {
            alert('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
          }

        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });
      // console.log("doing sign up");

    };
  })


  .controller('AcceptCtrl', function ($scope, AuthService, $state) {

    $scope.init = function () {
      $scope.ordersAccept = [];
      $scope.ordersReject = [];
      AuthService.getOrder()
        .then(function (data) {
          var orderlist = data;
          angular.forEach(orderlist, function (order) {
            if (order.deliverystatus === 'accept') {
              $scope.ordersAccept.push(order);
            }
            else if (order.deliverystatus === 'reject') {
              $scope.ordersReject.push(order);
            }

          })
        });
    }
      $scope.accepted = function () {
        $state.go('listaccepted');
      };
      $scope.rejected = function () {
        $state.go('listrejected');
      };

      $scope.doRefresh = function () {
        $scope.init();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

      };
    
  })
  .controller('DeliverCtrl', function ($scope, AuthService, $state, $stateParams) {
    
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
    var orderId = $stateParams.orderId;
    console.log(orderId);
    AuthService.Order(orderId).then(function (order) {
      $scope.order = order;
      $scope._id = $scope.order._id;
    });
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
          console.log($scope.delivers);
        })
      });

    $scope.chooseDeliver = function (deli) {

      var history = {
        status: 'wait deliver',
        datestatus: new Date()
      }
      $scope.order.historystatus.push(history);
      $scope.order = {
        namedeliver: deli,
        deliverystatus: 'wait deliver',
        historystatus: $scope.order.historystatus
      }
      var order = $scope.order;
      var orderId = $scope._id;
      AuthService.updateOrder(orderId, order)
        .then(function (response) {
          alert('success');
          $scope.modal.hide();
          AuthService.Order(orderId).then(function (order) {
            $scope.order = order;
          });
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });
    }
  });
