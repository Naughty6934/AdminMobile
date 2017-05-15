// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'angularMoment', 'starter.controllers', 'starter.services', 'satellizer'])

  .run(function ($ionicPlatform, AuthService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      if (window.localStorage.credential) {
        var user = JSON.parse(window.localStorage.credential);
        AuthService.loginUser(user);
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

  .config(function ($httpProvider) {
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

  .run(function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({ template: 'กรุณารอสักครู่' })
    })

    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide()
    })
  })

  .config(function ($stateProvider, $urlRouterProvider, $authProvider) {

    var commonConfig = {
      popupOptions: {
        location: 'no',
        toolbar: 'yes',
        width: window.screen.width,
        height: window.screen.height
      }
    };

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      commonConfig.redirectUri = 'https://thamapp.herokuapp.com/';
    }

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LogInCtrl'
      })

      .state('tab.confirmed', {
        url: '/confirmed',
        views: {
          'tab-confirmed': {
            templateUrl: 'templates/tab-confirmed.html',
            controller: 'ConfirmedCtrl'
          }
        }
      })

      .state('tab.more', {
        url: '/more',
        views: {
          'tab-more': {
            templateUrl: 'templates/tab-more.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.liststock', {
        url: '/liststock',
        views: {
          'tab-more': {
            templateUrl: 'templates/liststock.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.detailstock', {
        url: '/detailstock:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/detailstock.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.map', {
        url: '/map',
        views: {
          'tab-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('tab.detailaccept', {
        url: '/detailaccept',
        views: {
          'tab-detailaccept': {
            templateUrl: 'templates/tab-detailaccept.html',
            controller: 'ConfirmedCtrl'
          }
        }
      })

      .state('tab.detailorder', {
        url: '/detailorder:{data}',
        views: {
          'tab-confirmed': {
            templateUrl: 'templates/detailorder.html',
            controller: 'OrderCtrl'
          }
        }
      })

      .state('tab.detailorder2', {
        url: '/detailorder:{data}',
        views: {
          'tab-detailaccept': {
            templateUrl: 'templates/detailorder.html',
            controller: 'OrderCtrl'
          }
        }
      })
      .state('tab.listar', {
        url: '/listar',
        views: {
          'tab-more': {
            templateUrl: 'templates/listar.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('tab.listtreturn', {
        url: '/listtreturn',
        views: {
          'tab-more': {
            templateUrl: 'templates/listtreturn.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.returndetail', {
        url: '/returndetail:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/returndetail.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })

      .state('tab.listtransports', {
        url: '/listtransports',
        views: {
          'tab-more': {
            templateUrl: 'templates/listtransports.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.requestdetail', {
        url: '/requestdetail:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/requestdetail.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })

      .state('tab.detailar', {
        url: '/detailar:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/detailar.html',
            controller: 'MoreDetailCtrl'
          }
        }
      });



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
