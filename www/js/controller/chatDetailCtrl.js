adminApp.controller('ChatDetailCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, $stateParams, Socket, $ionicScrollDelegate, $timeout, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    if ($rootScope.chattype) {
        $rootScope.chattype = 'normal';
    } else {
        $rootScope.chattype = 'normal';
    }

    $scope.user = AuthService.getUser();
    $scope.messages = [];
    $scope.chat = null;
    $scope.room = {};
    Socket.connect();
    // ทดสอบ mobile connect
    // Socket.on('mobile', function (message) {
    //   $scope.messages.unshift(message);
    // });
    $scope.loadRoom = function () {
        var roomId = $stateParams.chatId;
        roomService.getRoom(roomId).then(function (res) {
            res.users.forEach(function (user) {
                if ($scope.user._id != user._id) {
                    $scope.title = user.displayName;
                }
            });
            $scope.chat = res;
            Socket.emit('join', $scope.chat);
        }, function (err) {
            console.log(err);
        });
    };

    // Add an event listener to the 'invite' event
    Socket.on('invite', function (res) {
        console.log('invite Chat');

        // alert('invite : ' + JSON.stringify(data));
        Socket.emit('join', res);
    });

    // Add an event listener to the 'joinsuccess' event
    Socket.on('joinsuccess', function (data) {
        console.log('joinsuccess Chat');

        $scope.room = data;
        $scope.pageDown();
        // alert('joinsuccess : ' + JSON.stringify(data));
    });

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (data) {
        // alert(JSON.stringify(data));
        $scope.room = data;
    });
    $scope.hideTime = true;
    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    // Create a controller method for sending messages
    $scope.sendMessage = function () {
        // alternate = !alternate
        // if (!$scope.room.messages) {
        //     $scope.room.messages = [];
        $scope.room.messages.unshift({
            type: 'message',
            created: Date.now(),
            profileImageURL: $scope.user.profileImageURL,
            username: $scope.user.displayName,
            text: this.message
        });
        // } else {
        //     $scope.room.messages.unshift({
        //         type: 'message',
        //         created: Date.now(),
        //         profileImageURL: $scope.user.profileImageURL,
        //         username: $scope.user.username,
        //         text: this.message
        //     });
        // }
        $ionicScrollDelegate.scrollBottom(true);

        Socket.emit('chatMessage', $scope.room);
        this.message = '';
    };


    $scope.pageDown = function () {
        $timeout(function () {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);
    };







    // $scope.sendMessage = function () {
    //     alternate = !alternate;

    //     // var d = new Date();
    //     // d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    //     // $scope.room.messages.forEach(function(message){

    //     // });
    //     $scope.messages.push({
    //         userId: alternate ? '12345' : '54321',
    //         text: $scope.room.message,
    //         time: d
    //     });

    //     delete $scope.room.message;
    //     $ionicScrollDelegate.scrollBottom(true);

    // };

    $scope.inputUp = function () {
        // if (isIOS) $scope.room.keyboardHeight = 216;
        $timeout(function () {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);

    };

    $scope.inputDown = function () {
        // if (isIOS) $scope.room.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function () {
        // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = $scope.user.displayName;
});