angular.module('starter.controllers', ['ionic'])

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
            $state.go('tab.confirmed');
            alert('success');
          } else {
            alert('คุณไม่มีสิทธิ์');
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
