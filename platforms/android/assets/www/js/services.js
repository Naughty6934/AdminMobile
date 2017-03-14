angular.module('starter.services', [])
  .factory('OrderService', function ($http) {
    var apiUrl = 'https://thamapptest.herokuapp.com/api';
    // instantiate our initial object
    var OrderService = function () {
      this.orders = [];
      this.getOrder();
    };

    // define the getProfile method which will fetch data
    // from GH API and *returns* a promise
    OrderService.prototype.getOrder = function () {

      // Generally, javascript callbacks, like here the $http.get callback,
      // change the value of the "this" variable inside it
      // so we need to keep a reference to the current instance "this" :
      var self = this;

      return $http.get(apiUrl + '/orders').then(function (response) {

        // when we get the results we store the data in user.profile
        self.orders = response.data

        // promises success should always return something in order to allow chaining
        return response;

      });
    };
    return OrderService;
  })
  .service('AuthService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapptest.herokuapp.com/api';
    this.saveUser = function (user) {
      return $http.post(apiURL + '/auth/signup', user);

    };
    this.loginUser = function (login) {
      window.localStorage.credential = JSON.stringify(login);

      var dfd = $q.defer();

      $http.post(apiURL + '/auth/signin', login).success(function (database) {
        window.localStorage.user = JSON.stringify(database);
        // alert('Success');
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        dfd.resolve(error);
        // return dfd.promise;
      });
      return dfd.promise;
    };

    this.saveUserPushNoti = function (push_user) {
      var dfd = $q.defer();

      $http.post(apiURL + '/pushnotiusers', push_user).success(function (database) {
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        console.log(error);
        dfd.resolve(error);
        // return dfd.promise;
      });
      return dfd.promise;
    };


    this.getUser = function () {
      return JSON.parse(window.localStorage.user || null);
    };

    this.signOut = function () {
      // window.localStorage.clear();
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('credential');
      return true;
    };

    this.getOrder = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/orders').success(function (orders) {
        // var order = [];
        // console.log(getUser);
        // angular.forEach(db, function (user) {
        //   if (user.namedeliver._id ===   getUser._id) {
        //     order.push(user);
        //   }
        // })
        //console.log(orders);
        dfd.resolve(orders);
      });


      return dfd.promise;

    };

    this.getDeliver = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/users').success(function (delivers) {
        // var order = [];
        // console.log(getUser);
        // angular.forEach(db, function (user) {
        //   if (user.namedeliver._id ===   getUser._id) {
        //     order.push(user);
        //   }
        // })
        //console.log(delivers);
        dfd.resolve(delivers);
      });


      return dfd.promise;

    };

    this.Order = function (orderId) {
      var dfd = $q.defer();
      $http.get(apiURL + '/orders/' + orderId).success(function (database) {
        // var order = _.find(database, function (order) { return order._id == orderId; });

        dfd.resolve(database);

        //console.log(database);
      });
      return dfd.promise;
    };


    this.updateOrder = function (orderId, order) {
      //console.log(orderId);
      //console.log(order);
      // var dfd = $q.defer();
      // $http.put('https://thamapp.herokuapp.com/api/orders/'+orderId, order).success(function (database) {

      //   dfd.resolve(database);
      //   console.log(database);
      // });
      // return dfd.promise;

      return $http.put(apiURL + '/orders/' + orderId, order);

    }

  }])
  .service('RequestService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapptest.herokuapp.com/api';
    this.getRequests = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/requestorders').success(function (requestsorders) {
        console.log(requestsorders);

        dfd.resolve(requestsorders);
      });
      return dfd.promise;
    };
  }])

  .service('ReturnService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapptest.herokuapp.com/api';
    this.getReturns = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/returnorders').success(function (returnorders) {
        console.log(returnorders);

        dfd.resolve(returnorders);
      });
      return dfd.promise;
    };

    this.updateReturnOrder = function (returnorderId, returnorder) {
      var dfd = $q.defer();
      $http.put(apiURL + '/returnorders/' + returnorderId, returnorder).success(function (returnorders) {

        dfd.resolve(returnorders);
      });
      return dfd.promise;
    }
  }])

  .service('StockService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapptest.herokuapp.com/api';
    this.getStocks = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/stocks').success(function (stocks) {
        console.log(stocks);

        dfd.resolve(stocks);
      });
      return dfd.promise;
    };
  }])

  .service('AccuralreceiptsService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapptest.herokuapp.com/api';
    this.getAccuralreceipts = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/accuralreceipts').success(function (accuralreceipts) {
        // console.log(accuralreceipts);

        dfd.resolve(accuralreceipts);
      });
      return dfd.promise;
    };
    this.updateaccuralreceipt = function (accuralreceiptsId, accuralreceipts) {
      var dfd = $q.defer();
      $http.put(apiURL + '/accuralreceipts/' + accuralreceiptsId, accuralreceipts).success(function (accuralreceipts) {
        dfd.resolve(accuralreceipts);
      }).error(function (error) {
        dfd.reject(error);
      });
      return dfd.promise;
    };
  }]);