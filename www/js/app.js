// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var adminApp = angular.module('starter', ['ionic', 'ngCordova', 'angularMoment', 'starter.controllers', 'starter.services', 'satellizer', 'autocomplete.directive']);
adminApp.constant('config', {
  apiServiceUrl: 'https://thamapptest.herokuapp.com/api',
  url: 'https://thamapptest.herokuapp.com/'
  //https://thamapp.herokuapp.com/      for production
  //https://thamapptest.herokuapp.com/  for heroku test
  //http://localhost:3000/              for local
})
adminApp.run(function ($ionicPlatform, AuthService) {
  $ionicPlatform.ready(function () {
    // var devicePlatform = device.platform;
    // window.localStorage.adminAppPlatform = devicePlatform;

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.localStorage.credential) {
      var user = JSON.parse(window.localStorage.credential);
      AuthService.loginUser(user);
    }

    var notificationOpenedCallback = function (jsonData) {
      // alert("Notification opened:\n" + JSON.stringify(jsonData));
      // console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    // TODO: Update with your OneSignal AppId before running.
    if (window.OneSignal) {
      window.plugins.OneSignal
        .startInit("d70cd18c-0d4a-49eb-ab23-97be42a22fa4")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

      window.plugins.OneSignal.getIds(function (ids) {
        window.localStorage.setItem('oneSignalUserID', ids.userId);
      });
    }
  });
  $ionicPlatform.on("resume", function (event) {
    // user opened the app from the background
    if (window.localStorage.credential) {
      var user = JSON.parse(window.localStorage.credential);
      AuthService.loginUser(user);
    }
  });
})

adminApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
      request: function (config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function (response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  })
})

adminApp.run(function ($rootScope, $ionicLoading) {
  $rootScope.$on('loading:show', function () {
    $ionicLoading.show({
      template: 'กรุณารอสักครู่'
    })
  })

  $rootScope.$on('loading:hide', function () {
    $ionicLoading.hide()
  })
})

adminApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position("bottom")
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })
    // setup an abstract state for the tabs directive
    // .state('tab', {
    //   url: '/tab',
    //   abstract: true,
    //   templateUrl: 'templates/tabs.html'
    // })

    .state('app.tab', {
      url: '/tab',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/tabs.html'
        }
      }
    })


    // Each tab has its own nav history stack:

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LogInCtrl'
    })

    .state('app.tab.confirmed', {
      url: '/confirmed',
      views: {
        'tab-confirmed': {
          templateUrl: 'templates/tab-confirmed.html',
          controller: 'ConfirmedCtrl'
        }
      }
    })

    .state('app.tab.more', {
      url: '/more',
      views: {
        'tab-more': {
          templateUrl: 'templates/tab-more.html',
          controller: 'MoreCtrl'
        }
      }
    })

    .state('app.liststock', {
      url: '/liststock',
      views: {
        'menuContent': {
          templateUrl: 'templates/liststock.html',
          controller: 'MoreCtrl'
        }
      }
    })

    .state('app.detailstock', {
      url: '/detailstock:{data}',
      views: {
        'menuContent': {
          templateUrl: 'templates/detailstock.html',
          controller: 'MoreCtrl'
        }
      }
    })

    .state('app.tab.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    })

    .state('app.tab.detailaccept', {
      url: '/detailaccept',
      views: {
        'tab-detailaccept': {
          templateUrl: 'templates/tab-detailaccept.html',
          controller: 'ConfirmedCtrl'
        }
      }
    })

    .state('app.tab.detailorder', {
      url: '/detailorder:{data}',
      views: {
        'tab-confirmed': {
          templateUrl: 'templates/detailorder.html',
          controller: 'OrderconCtrl'
        }
      }
    })

    .state('app.tab.products', {
      url: '/products',
      views: {
        'tab-confirmed': {
          templateUrl: 'templates/products.html',
          controller: 'ProductCtrl'
        }
      }
    })

    .state('app.tab.productdetail', {
      url: '/products/:{product}',
      views: {
        'tab-confirmed': {
          templateUrl: 'templates/productDetail.html',
          controller: 'ProductDetailCtrl'
        }
      }
    })

    .state('app.tab.cart', {
      url: '/cart',
      views: {
        'tab-checkout': {
          templateUrl: 'templates/cart.html',
          controller: 'CheckoutCtrl'
        }
      }
    })

    .state('app.tab.checkout', {
      url: '/checkout',
      views: {
        'tab-checkout': {
          templateUrl: 'templates/checkout.html',
          controller: 'CheckoutCtrl'
        }
      }
    })

    .state('app.tab.detailorder2', {
      url: '/detailorder:{data}',
      views: {
        'tab-detailaccept': {
          templateUrl: 'templates/detailorder.html',
          controller: 'OrderaccCtrl'
        }
      }
    })

    .state('app.tab.chat-detailconfirm', {
      url: "/detailorder/:chatId",
      views: {
        'tab-confirmed': {
          templateUrl: "templates/chat-detail.html",
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('app.tab.chat-detailproconfirm', {
      url: "/deliver-profile/:chatId",
      views: {
        'tab-confirmed': {
          templateUrl: "templates/chat-detail.html",
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('app.tab.chat-detailproaccept', {
      url: "/deliver-profile/:chatId",
      views: {
        'tab-detailaccept': {
          templateUrl: "templates/chat-detail.html",
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('app.tab.chat-detailaccept', {
      url: "/detailorder/:chatId",
      views: {
        'tab-detailaccept': {
          templateUrl: "templates/chat-detail.html",
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('app.tab.deliver-profile', {
      url: '/deliver-profile:{data}',
      views: {
        'tab-detailaccept': {
          templateUrl: 'templates/deliver-profile.html',
          controller: 'ProfileDeliveracceptCtrl'
        }
      }
    })

    .state('app.tab.deliver-profile3', {
      url: '/deliver-profile:{data}',
      views: {
        'tab-confirmed': {
          templateUrl: 'templates/deliver-profile.html',
          controller: 'ProfileDeliverconfirmCtrl'
        }
      }
    })

    // .state('app.tab.chat', {
    //   url: '/chat',
    //   views: {
    //     'tab-detailaccept': {
    //       templateUrl: 'templates/chat.html',
    //       controller: 'ChatCtrl'
    //     }
    //   }
    // })

    .state('app.listar', {
      url: '/listar',
      views: {
        'menuContent': {
          templateUrl: 'templates/listar.html',
          controller: 'MoreCtrl'
        }
      }
    })

    .state('app.detailar', {
      url: '/detailar:{data}',
      views: {
        'menuContent': {
          templateUrl: 'templates/detailar.html',
          controller: 'MoreDetailCtrl'
        }
      }
    })

    .state('app.listtreturn', {
      url: '/listtreturn',
      views: {
        'menuContent': {
          templateUrl: 'templates/listtreturn.html',
          controller: 'MoreCtrl'
        }
      }
    })

    .state('app.returndetail', {
      url: '/returndetail:{data}',
      views: {
        'menuContent': {
          templateUrl: 'templates/returndetail.html',
          controller: 'MoreDetailCtrl'
        }
      }
    })

    .state('app.listtransports', {
      url: '/listtransports',
      views: {
        'menuContent': {
          templateUrl: 'templates/listtransports.html',
          controller: 'MoreCtrl'
        }
      }
    })

    .state('app.requestdetail', {
      url: '/requestdetail:{data}',
      views: {
        'menuContent': {
          templateUrl: 'templates/requestdetail.html',
          controller: 'MoreDetailCtrl'
        }
      }
    })

    .state('app.tab.chat', {
      url: "/chat",
      views: {
        'tab-chat': {
          templateUrl: "templates/tab-chat.html",
          controller: 'ChatCtrl'
        }
      }
    })

    .state('app.tab.chat-detail', {
      url: "/chat/:chatId",
      views: {
        'tab-chat': {
          templateUrl: "templates/chat-detail.html",
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('app.tab.listfriend', {
      url: "/listfriend",
      views: {
        'tab-chat': {
          templateUrl: "templates/listfriend.html",
          controller: 'FriendsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})

adminApp.directive('showHideContainer', function () {
  return {
    scope: {

    },
    controller: function ($scope, $element, $attrs) {
      $scope.show = false;

      $scope.toggleType = function ($event) {
        $event.stopPropagation();
        $event.preventDefault();

        $scope.show = !$scope.show;

        // Emit event
        $scope.$broadcast("toggle-type", $scope.show);
      };
    },
    templateUrl: 'templates/show-hide-password.html',
    restrict: 'A',
    replace: false,
    transclude: true
  };
})

adminApp.directive('showHideInput', function () {
  return {
    scope: {

    },
    link: function (scope, element, attrs) {
      // listen to event
      scope.$on("toggle-type", function (event, show) {
        var password_input = element[0],
          input_type = password_input.getAttribute('type');

        if (!show) {
          password_input.setAttribute('type', 'password');
        }

        if (show) {
          password_input.setAttribute('type', 'text');
        }
      });
    },
    require: '^showHideContainer',
    restrict: 'A',
    replace: false,
    transclude: false
  };
});
