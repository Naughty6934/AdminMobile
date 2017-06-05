adminApp.controller('MoreCtrl', function ($scope, $rootScope, AuthService, $state, $ionicModal, RequestService, ReturnService, StockService, $stateParams, AccuralreceiptsService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $rootScope.userStore = AuthService.getUser();
    $scope.showInfiniteConfirmed = true;
    $scope.limitTo = 0;
    $scope.leftMoreStock = 0;
    if ($stateParams.data) {
        $scope.data = JSON.parse($stateParams.data);
    }
    $scope.logOut = function () {
        AuthService.signOut();
        $state.go('login');
    };

    $scope.initStock = function () {
        $scope.liststock();
    }//1
    $scope.initReturn = function () {
        $scope.returnorders();
        $scope.Returns = true;

    }//2
    $scope.initAr = function () {
        $scope.listaccuralreceipts();
        $scope.waitforreview = true;
        $scope.waitforconfirmed = false;
        $scope.confirmed = false;
        $scope.receipt = false;
    }//3
    $scope.initTran = function () {
        $scope.requestsorders();

        $scope.Request = true;

        $scope.Response = false;
        $scope.Received = false;

    };//4

    $scope.doRefresh = function (state) {
        if (state === 'stock') {
            $scope.initStock();
        } else if (state === 'return') {
            $scope.initReturn();
        } else if (state === 'ar') {
            $scope.initAr();
        } else if (state === 'tran') {
            $scope.initTran();
        }
        $scope.$broadcast('scroll.refreshComplete');

    };

    $scope.listaccuralreceipt = function () {
        $state.go('app.listar');
    };

    $scope.liststocks = function () {
        $state.go('app.liststock');
    };

    $scope.liststock = function () {
        StockService.getStocks()
            .then(function (data) {
                $scope.stocks = data;
                if ($scope.stocks.length > 20) {
                    $scope.limitTo = 20;
                    $scope.leftMoreStock = $scope.stocks.length - $scope.limitTo;
                    $scope.showInfiniteConfirmed = true;
                } else {
                    $scope.limitTo = 20;
                    $scope.leftMoreStock = 0;
                    $scope.showInfiniteConfirmed = false;
                }
            })
    };
    $scope.loadMore = function (orders, tab) {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if (orders && orders.length > 0) {
            $scope.limitTo += 20;
            $scope.leftMoreStock -= 20;

            if ($scope.leftMoreStock <= 0) {
                $scope.showInfiniteConfirmed = false;
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
    $scope.listtransports = function () {
        $state.go('app.listtransports');
    };

    $scope.listtreturn = function () {
        $state.go('app.listtreturn');
    };

    $scope.requestsorders = function () {
        RequestService.getRequests()
            .then(function (data) {
                var requestlist = data;

                $scope.listRequest = [];
                $scope.listResponse = [];
                $scope.listReceived = [];
                requestlist.forEach(function (request) {
                    if (request.deliverystatus === 'request') {
                        $scope.listRequest.push(request);
                        $scope.countRequest = $scope.listRequest.length;
                    }
                    else if (request.deliverystatus === 'response') {
                        $scope.listResponse.push(request);
                        $scope.countResponse = $scope.listResponse.length;
                    }
                    else if (request.deliverystatus === 'received') {
                        $scope.listReceived.push(request);
                        $scope.countReceived = $scope.listReceived.length;
                    }
                })
            })
    }

    $scope.listaccuralreceipts = function () {
        AccuralreceiptsService.getAccuralreceipts()
            .then(function (data) {
                var Arlist = data;

                $scope.listWaitforreview = [];
                $scope.listWaitforconfirmed = [];
                $scope.listConfirmed = [];
                $scope.listReceipt = [];
                Arlist.forEach(function (waitOr) {
                    if (waitOr.arstatus === 'wait for review') {
                        $scope.listWaitforreview.push(waitOr);
                        $scope.countWaitforreview = $scope.listWaitforreview.length;
                    }
                    else if (waitOr.arstatus === 'wait for confirmed') {
                        $scope.listWaitforconfirmed.push(waitOr);
                        $scope.countWaitforconfirmed = $scope.listWaitforconfirmed.length;
                    }
                    else if (waitOr.arstatus === 'confirmed') {
                        $scope.listConfirmed.push(waitOr);
                        $scope.countConfirmed = $scope.listConfirmed.length;
                    }
                    else if (waitOr.arstatus === 'receipt') {
                        $scope.listReceipt.push(waitOr);
                        $scope.countReceipt = $scope.listReceipt.length;
                    }
                })
                // console.log($scope.listWaitforreview.length);
                // console.log($scope.listWaitforconfirmed.length);
                // console.log($scope.listConfirmed.length);
                // console.log($scope.listReceipt.length);
            })
    }

    $scope.returnorders = function () {
        ReturnService.getReturns()
            .then(function (data) {
                var returnlist = data;
                $scope.listReturnRet = [];
                $scope.listReturnRes = [];
                $scope.listReturnRec = [];
                returnlist.forEach(function (returnOr) {
                    if (returnOr.deliverystatus === 'return') {
                        $scope.listReturnRet.push(returnOr);
                        $scope.countReturnRet = $scope.listReturnRet.length;
                    }
                    else if (returnOr.deliverystatus === 'response') {
                        $scope.listReturnRes.push(returnOr);
                        $scope.countReturnRes = $scope.listReturnRes.length;
                    }
                    else if (returnOr.deliverystatus === 'received') {
                        $scope.listReturnRec.push(returnOr);
                        $scope.countReturnRec = $scope.listReturnRec.length;
                    }
                })
            })
    }

    $scope.returnDetail = function (data) {
        $state.go('app.returndetail', { data: JSON.stringify(data) });
    }


    $scope.requestDetail = function (data) {
        $state.go('app.requestdetail', { data: JSON.stringify(data) });
    }

    $scope.detailstock = function (data) {
        $state.go('app.detailstock', { data: JSON.stringify(data) });
    }

    $scope.arDetail = function (data) {
        $state.go('app.detailar', { data: JSON.stringify(data) });
    }

});