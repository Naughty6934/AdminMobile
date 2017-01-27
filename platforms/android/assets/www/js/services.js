angular.module('starter.services', [])

  .service('AuthService', ['$http', '$q', function ($http, $q) {

    this.saveUser = function (user) {
      return $http.post('https://thamapp.herokuapp.com/api/auth/signup', user);

    };
    this.loginUser = function (login) {

      var dfd = $q.defer();

      $http.post('https://thamapp.herokuapp.com/api/auth/signin', login).success(function (database) {
        window.localStorage.user = JSON.stringify(database);
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
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
      return true;
    };

    this.getOrder = function () {
      var dfd = $q.defer();
      $http.get('https://thamapp.herokuapp.com/api/orders').success(function (orders) {
        // var order = [];
        // console.log(getUser);
        // angular.forEach(db, function (user) {
        //   if (user.namedeliver._id ===   getUser._id) {
        //     order.push(user);
        //   }
        // })
        console.log(orders);
        dfd.resolve(orders);
      });


      return dfd.promise;

    };

    this.getDeliver = function () {
      var dfd = $q.defer();
      $http.get('https://thamapp.herokuapp.com/api/users').success(function (delivers) {
        // var order = [];
        // console.log(getUser);
        // angular.forEach(db, function (user) {
        //   if (user.namedeliver._id ===   getUser._id) {
        //     order.push(user);
        //   }
        // })
        console.log(delivers);
        dfd.resolve(delivers);
      });


      return dfd.promise;

    };

    this.Order = function (orderId) {
      var dfd = $q.defer();
      $http.get('https://thamapp.herokuapp.com/api/orders/' + orderId).success(function (database) {
        // var order = _.find(database, function (order) { return order._id == orderId; });

        dfd.resolve(database);

        console.log(database);
      });
      return dfd.promise;
    };


    this.updateOrder = function (orderId, order) {
      console.log(orderId);
      console.log(order);
      // var dfd = $q.defer();
      // $http.put('https://thamapp.herokuapp.com/api/orders/'+orderId, order).success(function (database) {

      //   dfd.resolve(database);
      //   console.log(database);
      // });
      // return dfd.promise;

      return $http.put('https://thamapp.herokuapp.com/api/orders/' + orderId, order);

    }

  }]);