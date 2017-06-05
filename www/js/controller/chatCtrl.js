adminApp.controller('ChatCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, Socket, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.user = AuthService.getUser();
    //  alert(JSON.stringify($scope.user));
    $scope.listRoom = function () {
        roomService.getrooms().then(function (res) {
            // alert(JSON.stringify(res));
            $scope.chats = res;
        }, function (err) {
            // alert(JSON.stringify(err));
            console.log(err);
        });
    };
    $scope.listRoom();
    $scope.createRoom = function (data) {
        roomService.createRoom(data).then(function (res) {
            $scope.listRoom();
        }, function (err) {
            console.log(err);
        });
    };

    Socket.on('invite', function (res) {
        $scope.listRoom();
    });

});