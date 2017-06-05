adminApp.controller('FriendsCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, Socket, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.user = AuthService.getUser();
    $scope.listAccount = function () {
        $scope.listRoom = [];
        $scope.friends = [];
        roomService.getrooms().then(function (rooms) {
            rooms.forEach(function (room) {
                room.users.forEach(function (user) {
                    if ($scope.user._id === user._id) {
                        $scope.listRoom.push(room);
                    }
                });
            });
            if ($scope.listRoom.length > 0) {
                $scope.listRoom.forEach(function (room) {
                    room.users.forEach(function (user) {
                        if ($scope.user._id !== user._id) {
                            $scope.friends.push(user);
                        }
                    });
                });
            }
            AuthService.getusers().then(function (accounts) {
                $scope.accounts = accounts;
            }, function (err) {
                console.log(err);
            });
        });
    };
    $scope.listAccount();
    $scope.addFriend = function (user) {
        var data = {
            name: $scope.user.username + '' + user.username,
            type: 'P',
            users: [$scope.user, user],
            user: $scope.user
        };
        Socket.emit('createroom', data);
    };
});