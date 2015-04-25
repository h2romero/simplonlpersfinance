/* Account */

var AccountEditCtrl = function ($scope, $location, $routeParams, ApiAccount) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.account = ApiAccount.get({ id: id });

    $scope.save = function () {
        //debugger;
        ApiAccount.update({ id: id }, $scope.account, function () {
            //debugger;
            $location.path('/transactions/account');
        });
    };
};

var AccountCreateCtrl = function ($scope, $location, ApiAccount) {
    $scope.action = "Add";
    $scope.save = function () {
        //debugger;
        ApiAccount.save($scope.account, function () {
            //debugger;
            $location.path('/transactions/account');
        });
    };
};

var AccountListCtrl = function ($scope, $location, ApiAccount, LoginService) {
    $scope.search = function () {
        //$scope.accounts = ApiAccount.query({ sort: $scope.sort_order, desc: $scope.is_desc });
        ApiAccount.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_desc,
            offset: $scope.offset,
            limit: $scope.limit
        },
            function (data) {
                $scope.more = data.length === 20;
                $scope.accounts = $scope.accounts.concat(data);
            });
    };

    $scope.sort = function (col) {
        if ($scope.sort_order === col) {
            $scope.is_desc = !$scope.is_desc;
        } else {
            $scope.sort_order = col;
            $scope.is_desc = false;
        }
        //$scope.search();
        $scope.reset();
    };

    $scope.show_more = function () {
        $scope.offset += $scope.limit;
        $scope.search();
    };

    $scope.has_more = function () {
        return $scope.more;
    };

    $scope.reset = function () {
        //debugger;
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.accounts = [];
        $scope.more = true;
        $scope.search();
    };

    $scope.delete = function () {
        //debugger;
        var id = this.account.AccountID;
        ApiAccount.delete({ id: id }, function () {
            //debugger;
            $('#account_' + id).fadeOut();
        });
    };

    $scope.sort_order = "AccountName";
    $scope.is_desc = false;

    $scope.reset();

    $scope.getLogStatus = function () {
        return LoginService.isLogged();
    }
};