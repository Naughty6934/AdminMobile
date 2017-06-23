adminApp.controller('ProductCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, $ionicSideMenuDelegate, ProductService, $ionicLoading) {

    $scope.user = AuthService.getUser();
    $scope.limitTo = 0;
    $scope.leftMoreProduct = 0;
    $scope.showInfiniteConfirmed = true;
    $scope.readProduct = function () {
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        ProductService.getProducts().then(function (res) {
            $scope.products = res;
            if ($scope.products.length > 6) {
                $scope.limitTo = 6;
                $scope.leftMoreProduct = $scope.products.length - $scope.limitTo;
                $scope.showInfiniteConfirmed = true;
            } else {
                $scope.limitTo = 6;
                $scope.leftMoreProduct = 0;
                $scope.showInfiniteConfirmed = false;
            }
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            alert(err.message);
        });
    };
    $scope.gotoDetail = function (product) {
        $state.go('app.tab.productdetail', { product: JSON.stringify(product) });
    };

    $scope.filter = function (filter) {
        if (filter.length > 4) {
            $scope.filterText = filter;
            $scope.showInfiniteConfirmed = false;
        } else {
            $scope.limitTo = 4;
            $scope.filterText = "";
            $scope.showInfiniteConfirmed = true;
        }
    };

    $scope.loadMore = function (products) {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if (products) {
            if (products.length > 0) {
                $scope.limitTo += 6;
                $scope.leftMoreProduct -= 6;
                if ($scope.leftMoreProduct <= 0) {
                    $scope.showInfiniteConfirmed = false;
                }
            }
        }

    };
});