/* Transaction */

var TransactionEditCtrl = function ($scope, $location, $routeParams, $filter, ApiTransaction) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.transaction = ApiTransaction.get({ id: id });
    //$scope.mydate = $filter("date")(Date.now(), 'yyyy-MM-dd');
    //$scope.item = { birthDay: "10/25/2013" };
    //$scope.value = new Date(2013, 9, 22);
    $scope.$watch('transaction.duedate', function (unformattedDate) {
        $scope.transaction.duedate = $filter('date')(unformattedDate, 'MM/dd/yyyy');
    });

    $scope.save = function () {
        //debugger;
        ApiTransaction.update({ id: id }, $scope.transaction, function () {
            //debugger;
            $location.path('/transaction');
        });
    };
};

var TransactionCreateCtrl = function ($scope, $location, ApiTransaction) {
    $scope.action = "Add";
    $scope.save = function () {
        //debugger;
        ApiTransaction.save($scope.transaction, function () {
            //debugger;
            $location.path('/transaction');
        });
    };
};

var TransactionListCtrl = function ($scope, $location, $filter, ApiTransaction) {
    $scope.view = function () {
        ApiTransaction.query({
            start: $filter('date')($scope.startdate, "yyyy-MM-dd"),
            end: $filter('date')($scope.enddate, "yyyy-MM-dd"),
            q: $scope.query
        },
        function (data) {
            $scope.transactions = data;
        });
    };

    $scope.search = function () {
        //$scope.transactions = ApiTransaction.query({ sort: $scope.sort_order, desc: $scope.is_desc });
        ApiTransaction.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_desc,
            offset: $scope.offset,
            limit: $scope.limit
        },
            function (data) {
                $scope.more = data.length === 20;
                $scope.transactions = $scope.transactions.concat(data);
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
        var d = new Date()
        $scope.startdate = $filter('date')(new Date(d.getFullYear(), d.getMonth(), 1), "MM/dd/yyyy");
        $scope.enddate = $filter('date')(new Date(d.getFullYear(), d.getMonth() + 1, 0), "MM/dd/yyyy");
        $scope.query = "";
        $scope.view();
    };

    $scope.delete = function () {
        //debugger;
        var id = this.transaction.TransactionID;
        ApiTransaction.delete({ id: id }, function () {
            //debugger;
            $('#transaction_' + id).fadeOut();
        });
    };

    $scope.sort_order = "TransactionName";
    $scope.is_desc = false;

    $scope.reset();
};
