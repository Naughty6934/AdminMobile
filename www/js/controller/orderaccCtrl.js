adminApp.controller('OrderaccCtrl', function ($scope, $rootScope, AuthService, $state, $stateParams, $ionicModal, $ionicSideMenuDelegate, Socket) {

    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $rootScope.chattype = 'accept';

    $scope.gotoChat = function (user) {
        if ($rootScope.chattype === 'normal' || $rootScope.chattype === 'confirm') {
            $rootScope.chattype = 'accept';
        }
        // alert($rootScope.chattype);
        var data = {
            name: $scope.userStore.username + '' + user.username,
            type: 'P',
            users: [$scope.userStore, user],
            user: $scope.userStore
        };

        Socket.emit('createroom', data);
        // Add an event listener to the 'invite' event
        Socket.on('invite', function (res) {
            console.log('invite ConfirmedCtrl');
            // alert('invite : ' + JSON.stringify(data));
            Socket.emit('join', res);
        });

        // Add an event listener to the 'joinsuccess' event
        Socket.on('joinsuccess', function (data) {
            console.log('joinsuccess ConfirmedCtrl');
            $scope.room = data;
            if ($rootScope.chattype === 'accept') {
                $state.go('app.tab.chat-detailaccept', { chatId: data._id });
            }
            // $state.go('app.tab.chat-detail', { chatId: data._id });
            // $scope.pageDown();
            // alert('joinsuccess : ' + JSON.stringify(data));
        });
    }


    $scope.setItem = function () {
        window.localStorage.point = $stateParams.data;
    }

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;

    });

    $scope.btnGoProfile = function (data) {
        console.log(data);
        $state.go('app.tab.deliver-profile3', { data: JSON.stringify(data) });
    };

    $scope.btnGoProfileAccept = function (data) {
        console.log(data);
        $state.go('app.tab.deliver-profile', { data: JSON.stringify(data) });
    };

    // console.log(JSON.parse($stateParams.data));
    //var orderId = $stateParams.orderId;
    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);

    // $scope.data = JSON.parse($stateParams.data);
    // $scope._id = $scope.data._id


    // AuthService.getDeliver()
    //   .then(function (data) {
    //     var Deliverlist = data;
    //     $scope.delivers = [];
    //     angular.forEach(Deliverlist, function (deliver) {
    //       if (deliver.roles[0] === 'deliver') {
    //         $scope.delivers.push(deliver);
    //       }
    //     })

    //   });



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
                    $state.go('app.tab.confirmed');
                } else {
                    $state.go('app.tab.detailaccept');
                }

                //app.tab.confirmed
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
    $scope.tel = function (telnumber) {
        var reNumber = '';
        var regex = /(\d+)/g;
        var reNum = telnumber.match(regex);
        reNum.forEach(function (item) {
            reNumber += item
        });
        // alert(reNumber);
        window.location = 'tel:' + reNumber;

    };

});