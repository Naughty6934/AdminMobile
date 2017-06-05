adminApp.controller('menuCtrl', function ($scope, $ionicHistory, $http, $state, AuthService, $ionicModal, $rootScope, RequestService, ReturnService, StockService, $stateParams, AccuralreceiptsService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();

    $scope.Platform = window.localStorage.adminAppPlatform;
    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
        // alert('menuCtrl');
    };

    $scope.homes = function () {
        $state.go('app.tab.confirmed');
        $scope.toggleLeftSideMenu();
    };

    $scope.liststocks = function () {
        // $state.go('app.liststock');
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $scope.toggleLeftSideMenu();
    };

    $scope.listtreturn = function () {
        // $state.go('app.listtreturn');
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.toggleLeftSideMenu();
    };

    $scope.listaccuralreceipt = function () {
        // $state.go('app.listar');
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.toggleLeftSideMenu();
    };

    $scope.listtransports = function () {
        // $state.go('app.listtransports');
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.toggleLeftSideMenu();
    };

    $scope.logOut = function () {
        AuthService.signOut();
        $rootScope.userStore = AuthService.getUser();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');
        $scope.toggleLeftSideMenu();
    };
    $rootScope.loadMenuService = function () {
        StockService.getStocks()
            .then(function (data) {
                $rootScope.Stocks = data;
                $rootScope.countStocks = $rootScope.Stocks.length;
            });

        ReturnService.getReturns()
            .then(function (data) {
                $rootScope.countReturns = data.length;
            });

        AccuralreceiptsService.getAccuralreceipts()
            .then(function (data) {
                $rootScope.countAcc = data.length;
            });

        RequestService.getRequests()
            .then(function (data) {
                $rootScope.countTran = data.length;
            });
    };
});