// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
  });
})

.config(function($stateProvider, $urlRouterProvider) {

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

  .state('tab.accept', {
      url: '/accept',
      views: {
        'tab-accept': {
          templateUrl: 'templates/tab-accept.html',
          controller: 'AcceptCtrl'
        }
      }
    })
    .state('tab.complete', {
      url: '/complete',
      views: {
        'tab-complete': {
          templateUrl: 'templates/tab-complete.html',
          controller: 'CompleteCtrl'
        }
      }
    })

  .state('tab.reject', {
    url: '/reject',
    views: {
      'tab-reject': {
        templateUrl: 'templates/tab-reject.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.detailaccept', {
    url: '/detailaccept',
    views: {
      'tab-detailaccept': {
        templateUrl: 'templates/tab-detailaccept.html',
        controller: 'AcceptCtrl'
      }
    }
  })
  
  .state('listorder', {
    url: '/listorder',
        templateUrl: 'templates/listorder.html',
        controller: 'DeliverCtrl'
     
  })
  
  .state('listaccepted', {
    url: '/listaccepted',
        templateUrl: 'templates/listaccept.html',
        controller: 'AcceptCtrl'
     
  })
   .state('detailorder', {
    url: '/detailorder/:orderId',
        templateUrl: 'templates/detailorder.html',
        controller: 'OrderCtrl'
     
  })
  
  .state('listrejected', {
    url: '/listrejected',
        templateUrl: 'templates/listreject.html',
        controller: 'AcceptCtrl'
     
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
