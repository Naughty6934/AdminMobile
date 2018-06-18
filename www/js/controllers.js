angular.module('starter.controllers', ['ionic'])

  .controller('LogInCtrl', function ($scope, $state, AuthService, $rootScope) {
    // $rootScope.userStore = AuthService.getUser();

    // var push = new Ionic.Push({
    //   "debug": true,
    //   "onNotification": function (notification) {
    //     //console.log(notification);
    //     if (notification._raw.additionalData.foreground) {
    //       // alert(notification.message);

    //       $rootScope.$broadcast('onNotification');
    //     }
    //   }
    // });

    // push.register(function (token) {
    //   console.log("My Device token:", token.token);
    //   // alert(token.token);
    //   window.localStorage.token = JSON.stringify(token.token);
    //   push.saveToken(token);  // persist the token in the Ionic Platform
    // });

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
  });







