adminApp.controller('ProfileDeliverconfirmCtrl', function ($scope, $rootScope, $state, $stateParams, AuthService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $rootScope.chattype = 'Proconfirm';

    // $scope.gotoChat = function (user) {
    //     if ($rootScope.chattype === 'normal') {
    //         $rootScope.chattype = 'Proconfirm';
    //     }
    //     // alert($rootScope.chattype);
    //     var data = {
    //         name: $scope.userStore.username + '' + user.username,
    //         type: 'P',
    //         users: [$scope.userStore, user],
    //         user: $scope.userStore
    //     };

    //     Socket.emit('createroom', data);
    //     // Add an event listener to the 'invite' event
    //     Socket.on('invite', function (res) {
    //         console.log('invite ConfirmedCtrl');
    //         // alert('invite : ' + JSON.stringify(data));
    //         Socket.emit('join', res);
    //     });

    //     // Add an event listener to the 'joinsuccess' event
    //     Socket.on('joinsuccess', function (data) {
    //         console.log('joinsuccess ConfirmedCtrl');
    //         $scope.room = data;
    //         if ($rootScope.chattype === 'Proconfirm') {
    //             $state.go('app.tab.chat-detailproconfirm', { chatId: data._id });
    //         }
    //         // $state.go('app.tab.chat-detail', { chatId: data._id });
    //         // $scope.pageDown();
    //         // alert('joinsuccess : ' + JSON.stringify(data));
    //     });
    // }


    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);


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