angular.module('starter.services', [])
  .factory('OrderService', function ($http, config) {
    var apiURL = config.apiServiceUrl;
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

      return $http.get(apiURL + '/orders').then(function (response) {

        // when we get the results we store the data in user.profile
        self.orders = response.data

        // promises success should always return something in order to allow chaining
        return response;

      });
    };
    return OrderService;
  })
  .service('AuthService', ['$http', '$q', '$rootScope', '$auth', 'config', function ($http, $q, $rootScope, $auth, config) {
    var apiURL = config.apiServiceUrl;
    this.saveUser = function (user) {
      return $http.post(apiURL + '/auth/signup', user);

    };

    this.getusers = function () {
      var dfd = $q.defer();
      var user = this.getUser();
      $http.get(apiURL + '/users').success(function (data) {
        // window.localStorage.setItem("storage", JSON.stringify(data));
        dfd.resolve(data);
      }).error(function (err) {
        dfd.reject(err);
      })
      return dfd.promise;
    }

    this.successAuth = function (data) {
      // console.log(data.data);
      window.localStorage.user = JSON.stringify(data.data);
      $rootScope.$emit('userLoggedIn', data.data);
    };

    this.failedAuth = function (err) {
      $rootScope.$emit('userFailedLogin', err.data);
    };

    this.loginUser = function (login) {
      $auth
        .login(login, {
          url: apiURL + '/auth/signin'
        })
        .then(this.successAuth)
        .catch(this.failedAuth);
      // window.localStorage.credential = JSON.stringify(login);

      // var dfd = $q.defer();

      // $http.post(apiURL + '/auth/signin', login).success(function (database) {
      //   window.localStorage.user = JSON.stringify(database);
      //   // alert('Success');
      //   dfd.resolve(database);
      // }).error(function (error) {
      //   /* Act on the event */
      //   dfd.resolve(error);
      //   // return dfd.promise;
      // });
      // return dfd.promise;
    };

    this.saveUserPushNoti = function (push_user) {
      var dfd = $q.defer();

      $http.post(apiURL + '/pushnotiusers', push_user).success(function (database) {
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        // console.log(error);
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
      $http.get(apiURL + '/listorder/v2').success(function (orders) {
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

    this.getDeliverNearBy = function (item) {
      var dfd = $q.defer();
      var deliverOnly = [];
      var count = 0;
      $http.get(apiURL + '/users').success(function (delivers) {

        angular.forEach(delivers, function (deliver) {
          if (deliver.roles[0] === 'deliver') {
            if (deliver.address.sharelocation) {
              deliverOnly.push(deliver);
              $http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + deliver.address.sharelocation.latitude + ',' + deliver.address.sharelocation.longitude + '&destinations=' + item.shipping.sharelocation.latitude + ',' + item.shipping.sharelocation.longitude + '&key=AIzaSyBY4B67oPlLL9AdfXNTQl6JP_meTTzq8xY').success(function (distance) {
                // alert(JSON.stringify(distance.rows[0].elements[0].distance.value));
                count++;
                if (distance.rows[0].elements[0].distance.value) {
                  deliver.distanceText = (distance.rows[0].elements[0].distance.value / 1000) + ' กม.';
                  if (count === deliverOnly.length) {

                    deliverOnly.sort(function (a, b) {
                      if (a.distanceText < b.distanceText)
                        return -1;
                      if (a.distanceText > b.distanceText)
                        return 1;
                      return 0;
                    });

                    dfd.resolve(deliverOnly);

                  }
                }
              });


            }
          }
        });
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
      // $http.put('https://thamapptest.herokuapp.com/api/orders/'+orderId, order).success(function (database) {

      //   dfd.resolve(database);
      //   console.log(database);
      // });
      // return dfd.promise;

      return $http.put(apiURL + '/orders/' + orderId, order);

    }

  }])

  .service('ProductService', ['$http', '$q', '$rootScope', '$auth', 'config', 'AuthService', function ($http, $q, $rootScope, $auth, config, AuthService) {
    var apiURL = config.apiServiceUrl;

    this.getProducts = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/products').success(function (products) {
        // var order = [];
        // console.log(getUser);
        // angular.forEach(db, function (user) {
        //   if (user.namedeliver._id ===   getUser._id) {
        //     order.push(user);
        //   }
        // })
        //console.log(orders);
        dfd.resolve(products);
      });


      return dfd.promise;

    };

    this.getCartProducts = function () {
      return JSON.parse(window.localStorage.ionTheme1_cart || '[]');
    };

    this.getCountProduct = function () {

      var getCartProducts = this.getCartProducts();
      var count = 0;
      getCartProducts.forEach(function (product) {
        count += product.qty;
      });
      return count;
    };

    this.removeProductFromCart = function (index) {
      var cart_products = JSON.parse(window.localStorage.ionTheme1_cart);

      cart_products.splice(index, 1);

      window.localStorage.ionTheme1_cart = JSON.stringify(cart_products);
    };


    this.getProduct = function (productId) {
      var dfd = $q.defer();
      $http.get(apiURL + '/products/' + productId).success(function (database) {
        dfd.resolve(database);
      });
      return dfd.promise;
    };

    this.getPostcode = function (postcode) {
      var dfd = $q.defer();
      $http.get(apiURL + '/postcodes').success(function (database) {
        dfd.resolve(database);
      });
      return dfd.promise;
    };

    this.addProductToCart = function (productToAdd, update) {
      productToAdd.price = productToAdd.product.price;
      productToAdd.retailerprice = productToAdd.product.retailerprice;
      productToAdd.discountamount = 0;
      productToAdd.deliverycost = 0;
      var cart_products = window.localStorage.ionTheme1_cart ? JSON.parse(window.localStorage.ionTheme1_cart) : [];

      //check if this product is already saved
      // var existing_product = find(cart_products, function (product) {
      //   return product.product._id === productToAdd.product._id;
      // });

      var existing_product = cart_products.filter(function (product) { return product.product._id === productToAdd.product._id; });



      if (cart_products.length === 0) {
        this.getPromotion(productToAdd);
        cart_products.push(productToAdd);
      } else {
        if (existing_product != undefined && existing_product.length > 0 && existing_product[0].product._id === productToAdd.product._id) {
          if (update) {
            existing_product[0].qty = productToAdd.qty
          } else {
            existing_product[0].qty += productToAdd.qty;
          }
          this.getPromotion(existing_product[0]);


          existing_product[0].amount = 0;
          existing_product[0].amount += existing_product[0].qty * existing_product[0].product.price;
        } else {
          this.getPromotion(productToAdd);
          cart_products.push(productToAdd);
        }
      }

      window.localStorage.ionTheme1_cart = JSON.stringify(cart_products);
    };

    this.getPromotion = function (product) {
      console.log(product);
      for (var i = 0; i < product.product.promotions.length; i++) {
        var sumQtyCheckCondition = parseInt(product.qty / product.product.promotions[i].condition);
        product.discountamount = sumQtyCheckCondition * product.product.promotions[i].discount.fixBath;
      }
      this.getDeliveryCost(product);
    };

    this.getDeliveryCost = function (product) {
      if (product.product.deliveryratetype === 0) {
        product.deliverycost = 0;
      } else if (product.product.deliveryratetype === 1) {
        product.deliverycost = product.qty * product.product.valuetype1;
      } else if (product.product.deliveryratetype === 2) {
        for (var i = 0; i < product.product.rangtype2.length; i++) {
          if (product.qty >= product.product.rangtype2[i].min && product.qty <= product.product.rangtype2[i].max) {
            product.deliverycost = product.product.rangtype2[i].value;
          }
        }
      }
    };

    this.saveOrder = function (order) {
      var dfd = $q.defer();
      var user = AuthService.getUser();
      $http.post(apiURL + '/orders', order, user).then(function (res) {
        dfd.resolve(res.data);
        window.localStorage.removeItem('ionTheme1_cart');
      }, function (err) {
        dfd.reject(err);
      });
      return dfd.promise;
    };

    this.clearCart = function () {
      window.localStorage.removeItem('ionTheme1_cart');
      return true;
    };

  }])

  .service('RequestService', ['$http', '$q', 'config', function ($http, $q, config) {
    var apiURL = config.apiServiceUrl;
    this.getRequests = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/requestorders').success(function (requestsorders) {
        // console.log(requestsorders);

        dfd.resolve(requestsorders);
      });
      return dfd.promise;
    };
  }])
  .service('ReturnService', ['$http', '$q', 'config', function ($http, $q, config) {
    var apiURL = config.apiServiceUrl;
    this.getReturns = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/returnorders').success(function (returnorders) {
        // console.log(returnorders);

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
  .service('StockService', ['$http', '$q', 'config', function ($http, $q, config) {
    var apiURL = config.apiServiceUrl;
    this.getStocks = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/stocks').success(function (stocks) {
        // console.log(stocks);

        dfd.resolve(stocks);
      });
      return dfd.promise;
    };
  }])
  .service('AccuralreceiptsService', ['$http', '$q', 'config', function ($http, $q, config) {
    var apiURL = config.apiServiceUrl;
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
  }])
  // .service('roomService', function ($http, $q, config) {
  //   var apiURL = config.apiServiceUrl;
  //   this.getrooms = function () {
  //     var dfd = $q.defer();
  //     var user = (window.localStorage.user) ? JSON.parse(window.localStorage.user) : null;
  //     $http.get(apiURL + '/chatrooms', user).success(function (data) {
  //       // window.localStorage.setItem("storage", JSON.stringify(data));
  //       dfd.resolve(data);
  //     }).error(function (err) {
  //       dfd.reject(err);
  //     })
  //     return dfd.promise;
  //   };

  //   this.getRoom = function (roomId) {
  //     var dfd = $q.defer();
  //     $http.get(apiURL + '/chatrooms/' + roomId).success(function (database) {
  //       dfd.resolve(database);
  //     });
  //     return dfd.promise;
  //   };

  //   this.createRoom = function (data) {
  //     var dfd = $q.defer();
  //     $http.post(apiURL + '/chatrooms', data).success(function (data) {
  //       dfd.resolve(data);
  //     }).error(function (err) {
  //       dfd.reject(err);
  //     })
  //     return dfd.promise;
  //   };
  // })

  // .factory('Socket', function ($rootScope, config) {

  //   var url = config.url;
  //   var socket = io.connect(url);
  //   return {
  //     connect: function () {
  //       io.connect(url);
  //     },
  //     on: function (eventName, callback) {
  //       socket.on(eventName, function () {
  //         var args = arguments;
  //         $rootScope.$apply(function () {
  //           callback.apply(socket, args);
  //         });
  //       });
  //     },
  //     emit: function (eventName, data, callback) {
  //       socket.emit(eventName, data, function () {
  //         var args = arguments;
  //         $rootScope.$apply(function () {
  //           if (callback) {
  //             callback.apply(socket, args);
  //           }
  //         });
  //       })
  //     },
  //     removeAllListeners: function (eventName, callback) {
  //       socket.removeAllListeners(eventName, function () {
  //         var args = arguments;
  //         $rootScope.$apply(function () {
  //           callback.apply(socket, args);
  //         });
  //       });
  //     }
  //   };
  // })
  ;