adminApp.controller('ConfirmedCtrl', function ($scope, $http, $ionicLoading, $timeout, $state, AuthService, $ionicModal, $stateParams, $rootScope, $ionicSideMenuDelegate, Socket) {

    $rootScope.ordersConfirmed = [];
    $rootScope.ordersWait = [];
    $rootScope.ordersAccept = [];
    $rootScope.ordersReject = [];
    $rootScope.ordersCancel = [];
    $rootScope.ordersComplete = [];
    $rootScope.orderApt = [];
    $scope.Wait = true;
    $scope.limitTo = 20;
    $scope.leftMoreConfirmed = 0;
    $scope.leftMoreWait = 0;
    $scope.leftMoreReject = 0;
    $scope.leftMoreAccept = 0;
    $scope.showInfiniteConfirmed = true;
    $scope.showInfiniteWait = true;
    $scope.showInfiniteReject = true;
    $scope.showInfiniteAccept = true;

    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.userStore = AuthService.getUser();

    $scope.gotoConfirmed = function () {
        $state.go('app.tab.confirmed');
    }
    $scope.init = function () {
        $rootScope.loadData();
    }

    $rootScope.loadData = function () {
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        $scope.limitTo = 0;
        $rootScope.orders = [];
        $rootScope.orderApt = [];
        $scope.leftMoreReject = 0;
        $scope.leftMoreAccept = 0;
        $scope.showInfiniteConfirmed = true;
        $scope.showInfiniteWait = true;
        $scope.showInfiniteReject = true;
        $scope.showInfiniteAccept = true;
        AuthService.getOrder()
            .then(function (data) {
                var userStore = AuthService.getUser();

                $rootScope.ordersConfirmed = data.confirmed;
                $rootScope.ordersWait = data.wait;
                $rootScope.ordersAccept = data.accept;
                $rootScope.ordersReject = data.reject;
                $rootScope.ordersCancel = data.cancel;
                $rootScope.ordersComplete = data.complete;
                var orders = [];
                orders = orders.concat($rootScope.ordersConfirmed, $rootScope.ordersReject);
                $rootScope.orders = orders;
                $rootScope.countOrder = orders.length;
                $rootScope.countOrderApt = $rootScope.ordersAccept.length;
                $rootScope.countOrderRjt = $rootScope.ordersReject.length;
                $rootScope.countOrderWt = $rootScope.ordersWait.length;
                $rootScope.countAccept = $rootScope.ordersAccept.length;
                $rootScope.countReject = $rootScope.ordersReject.length;
                $rootScope.countWait = $rootScope.ordersWait.length;
                // $scope เดิม
                $rootScope.orderApt = $rootScope.ordersAccept;
                $rootScope.orderRjt = $rootScope.ordersReject;
                $rootScope.orderWt = $rootScope.ordersWait;

                // loadmore 
                $scope.limitTo = 20;
                if ($rootScope.orders.length > 20) {
                    $scope.limitTo = 20;
                    $scope.leftMoreConfirmed = $rootScope.orders.length - $scope.limitTo;
                    $scope.showInfiniteNew = true;
                } else {
                    $scope.limitTo = 20;
                    $scope.leftMoreConfirmed = 0;
                    $scope.showInfiniteNew = false;
                }
                if ($rootScope.orderWt.length > 20) {
                    $scope.limitTo = 20;
                    $scope.leftMoreWait = $rootScope.orderWt.length - $scope.limitTo;
                    $scope.showInfiniteMe = true;
                } else {
                    $scope.limitTo = 20;
                    $scope.leftMoreWait = 0;
                    $scope.showInfiniteMe = false;
                }
                if ($rootScope.orderRjt.length > 20) {
                    $scope.limitTo = 20;
                    $scope.leftMoreReject = $rootScope.orderRjt.length - $scope.limitTo;
                    $scope.showInfiniteMe = true;
                } else {
                    $scope.limitTo = 20;
                    $scope.leftMoreReject = 0;
                    $scope.showInfiniteMe = false;
                }
                if ($rootScope.orderApt.length > 20) {
                    $scope.limitTo = 20;
                    $scope.leftMoreAccept = $rootScope.orderApt.length - $scope.limitTo;
                    $scope.showInfiniteMe = true;
                } else {
                    $scope.limitTo = 20;
                    $scope.leftMoreAccept = 0;
                    $scope.showInfiniteMe = false;
                }
                $rootScope.loadMenuService();
                $ionicLoading.hide();
            });
    }

    $scope.loadMore = function (orders, tab) {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if (orders.length > 0) {
            $scope.limitTo += 20;
            $scope.leftMoreConfirmed -= 20;
            $scope.leftMoreWait -= 20;
            $scope.leftMoreReject -= 20;
            $scope.leftMoreAccept -= 20;

            if (tab === 'confirmed' && $scope.leftMoreConfirmed <= 0) {
                $scope.showInfiniteConfirmed = false;
            } else if (tab === 'wait' && $scope.leftMoreWait <= 0) {
                $scope.showInfiniteWait = false;
            } else if (tab === 'reject' && $scope.leftMoreReject <= 0) {
                $scope.showInfiniteReject = false;
            } else if (tab === 'accept' && $scope.leftMoreAccept <= 0) {
                $scope.showInfiniteAccept = false;
            } else {
                if (tab === 'confirmed') {
                    $scope.showInfiniteConfirmed = true;
                } else if (tab === 'wait') {
                    $scope.showInfiniteWait = true;
                } else if (tab === 'reject') {
                    $scope.showInfiniteReject = true;
                } else if (tab === 'accept') {
                    $scope.showInfiniteAccept = true;
                }
            }
        }
    };

    $scope.filter = function (filter, orders) {
        if (filter.length > 4) {
            $scope.limitTo = orders.length;
            $scope.filterText = filter;
            $scope.showInfiniteConfirmed = false;
            $scope.showInfiniteWait = false;
            $scope.showInfiniteReject = false;
            $scope.showInfiniteAccept = false;
        } else {
            $scope.limitTo = 20;
            $scope.filterText = "";
            $scope.showInfiniteConfirmed = true;
            $scope.showInfiniteWait = true;
            $scope.showInfiniteReject = true;
            $scope.showInfiniteAccept = true;
        }
    };

    $scope.gotoDetail = function (data) {
        //alert('go to detail');

        $state.go('app.tab.detailorder', { data: JSON.stringify(data) });
        AuthService.getDeliverNearBy(data)
            .then(function (order) {
                console.log(order);
                $rootScope.delivers = order;
            });
    }

    $scope.gotoDetail2 = function (data) {
        //alert('go to detail');
        $state.go('app.tab.detailorder2', { data: JSON.stringify(data) });
        AuthService.getDeliverNearBy(data)
            .then(function (order) {
                console.log(order);
                $rootScope.delivers = order;
            });
    }

    $scope.doRefresh = function () {
        $scope.init();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

    };

    $scope.$on('onNotification', function (event, args) {
        // do what you want to do
        $scope.init();
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        $scope.limitTo = 20;
    });

});