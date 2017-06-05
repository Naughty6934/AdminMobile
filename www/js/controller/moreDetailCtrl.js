adminApp.controller('MoreDetailCtrl', function ($scope, $rootScope, $stateParams, AuthService, $state, $ionicModal, RequestService, ReturnService, AccuralreceiptsService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $scope.data = JSON.parse($stateParams.data);
    console.log($scope.data);

    $scope.returnOrder = function (item) {
        var listord =
            {
                status: 'received',
                datestatus: new Date()
            };
        item.historystatus.push(listord);

        var status = item.deliverystatus;
        status = 'received';
        var returnorder = {
            deliverystatus: status,
            historystatus: item.historystatus,
            transport: $scope.userStore
        }
        var returnorderId = item._id;


        ReturnService.updateReturnOrder(returnorderId, returnorder)
            .then(function (received) {
                // alert('success'); 
                $state.go('app.listtreturn');
            }, function (error) {
                console.log(error);
                alert('dont success' + " " + error.data.message);
            });

    };

    $scope.updatewaitconfirmed = function (item) {
        var listwaitconfirmed =
            {
                status: 'wait for confirmed',
                datestatus: new Date()
            };
        item.historystatus.push(listwaitconfirmed);

        var status = item.deliverystatus;
        status = 'wait for confirmed';
        var accuralreceipt = {
            arstatus: status,
            historystatus: item.historystatus
        }
        var accuralreceiptsId = item._id;


        AccuralreceiptsService.updateaccuralreceipt(accuralreceiptsId, accuralreceipt)
            .then(function (response) {
                // alert('success');
                $state.go('tab.listar');
            }, function (error) {
                console.log(error);
                alert('dont success' + " " + error.data.message);
            });

    };

    $scope.updateconfirmed = function (item) {
        var listconfirmed =
            {
                status: 'receipt',
                datestatus: new Date()
            };
        item.historystatus.push(listconfirmed);

        var status = item.deliverystatus;
        status = 'receipt';
        var accuralreceipt = {
            arstatus: status,
            historystatus: item.historystatus
        }
        var accuralreceiptsId = item._id;


        AccuralreceiptsService.updateaccuralreceipt(accuralreceiptsId, accuralreceipt)
            .then(function (response) {
                // alert('success');
                $state.go('tab.listar');
            }, function (error) {
                console.log(error);
                alert('dont success' + " " + error.data.message);
            });

    };

});