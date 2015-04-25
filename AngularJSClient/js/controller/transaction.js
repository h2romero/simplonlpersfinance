/////// Edit Transaction /////////

var TransactionEditCtrl = function ($scope, $rootScope, $modal, $log, $location, $routeParams, sharedProperties) {
    //$location.path("/transactions/transaction/");   // show main grid on background on opening modal
    //$location.path("/transactions/editTransaction/" + $routeParams.editId);
    $scope.open = function (size) {

        var modalInstance = $modal.open({
            //templateUrl: 'Views/Transaction/Details.html',
            templateUrl: 'editModalContent.html',
            controller: ModalEditTransactionCtrl,
            size: size,
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            if (!sharedProperties.getValue('cancelgohome'))
                $location.path("/transactions/transaction");
            sharedProperties.setValue('cancelgohome', false);
        });
    };
    $scope.open();
    //$rootScope.$broadcast('handleChild', '');
};

/////// Add Transaction /////////

var TransactionCreateCtrl = function ($scope, $location, ApiTransaction, ApiAccount) {
    $scope.action = "Add";
    $scope.submitted = false;
    $scope.save = function () {
        $scope.submitted = true;
        ApiTransaction.save($scope.transaction, function () {
            //debugger;
            $location.path('/transactions/transaction');
        });
    };

    $scope.accountnames = []
    $scope.getAccountNames = function () {
        ApiAccount.query({
        },
            function (accounts) {
                angular.forEach(accounts, function (account) {
                    $scope.accountnames.push(account.AccountName);
                });
            });
    };
    $scope.getAccountNames();
};

var TransactionListCtrl = function ($scope, $rootScope, $modal, $log, $location, $routeParams, $filter, ApiTransaction, LoginService, sharedProperties) {    

    $scope.view = function () {
        sharedProperties.setValue('startdate', $scope.startdate);
        sharedProperties.setValue('enddate', $scope.enddate);
        ApiTransaction.query({
            //start: $filter('date')($scope.startdate, "yyyy-MM-dd"),
            //end: $filter('date')($scope.enddate, "yyyy-MM-dd"),
            start: $scope.startdate,
            end: $scope.enddate,
            q: $scope.query
        },
        function (data) {
            $scope.transactions = data;
            
            if (data.length > 0)
                $scope.getChart();
        });
    };

    $rootScope.$on('handleChild', function (event, args) {
        $scope.view();
    });

    $scope.updateAccount = function (data) {
        //$scope.transaction = data;
        //$scope.transaction.duedate = $filter('date')($scope.transaction.duedate, 'M/dd/yy');
        var dataProxy = jQuery.extend({}, data);
        dataProxy.duedate = $filter('date')(data.duedate, 'M/dd/yy');
        ApiTransaction.update({ id: dataProxy.transactionid }, dataProxy,
            function (result) {
                //$scope.transaction.duedate = $scope.toJsDate(data.duedate); // back to UTC for display
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
        $scope.search();
        //$scope.reset();
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

        
        $scope.startdate = sharedProperties.getValue('startdate') ? sharedProperties.getValue('startdate') : $filter('date')(new Date(d.getFullYear(), d.getMonth(), 1), "MM/dd/yyyy");
        $scope.enddate = sharedProperties.getValue('enddate') ? sharedProperties.getValue('enddate') : $filter('date')(new Date(d.getFullYear(), d.getMonth() + 1, 0), "MM/dd/yyyy");
        //$scope.startdate = sharedProperties.getValue('startdate') ? sharedProperties.getValue('startdate') : new Date(d.getFullYear(), d.getMonth(), 1);
        //$scope.enddate = sharedProperties.getValue('enddate') ? sharedProperties.getValue('enddate') : new Date(d.getFullYear(), d.getMonth() + 1, 0);

        //$scope.value = new Date(2014, 3, 19);
        $scope.query = "";
        $scope.view();
    };

    $scope.add_month = function (amount) {
        var d = $scope.toJsDate($scope.startdate);
        $scope.startdate = $filter('date')(new Date(d.getFullYear(), d.getMonth() + amount, 1), "MM/dd/yyyy");
        $scope.enddate = $filter('date')(new Date(d.getFullYear(), d.getMonth() + amount + 1, 0), "MM/dd/yyyy");
        //$scope.startdate = new Date(d.getFullYear(), d.getMonth() + amount, 1);
        //$scope.enddate = new Date(d.getFullYear(), d.getMonth() + amount + 1, 0);
        $scope.query = "";
        $scope.view();
    };

    $scope.delete = function () {
        //debugger;
        var id = this.transaction.transactionid;
        ApiTransaction.delete({ id: id }, function () {
            //debugger;
            $('#transaction_' + id).fadeOut();
        });
    };

    $scope.sort_order = "TransactionName";
    $scope.is_desc = false;
    $scope.predicate = '-duedate';

    $scope.reset();

    $scope.user = {
        dob: new Date(1984, 4, 15)
    };

    $scope.getLogStatus = function () {
        return LoginService.isLogged();
    };

    $scope.totPaid = function () {
        var tot = 0;
        angular.forEach($scope.transactions, function (transaction) {
            tot += transaction.amountpaid;
        })
        return tot;
    };

    $scope.toJsDate = function (str) {
        if (!str) return null;
        return new Date(str);
    }

    //$scope.editLink = function (editid) {
    //    sharedProperties.setValue('cancelgohome', true);
    //    $location.path("/transactions/editTransaction/" + editid );
    //}

    ////////////// edit //////////////////////

    $scope.open = function (editid) {
        $scope.editid = editid;

        var modalInstance = $modal.open({
            //templateUrl: 'Views/Transaction/Details.html',
            templateUrl: 'editModalContent.html',
            controller: ModalEditTransactionCtrl,
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            //if (!sharedProperties.getValue('cancelgohome'))
            //    $location.path("/transactions/transaction");
            //sharedProperties.setValue('cancelgohome', false);
        });
    };

    ////////////// chart //////////////////////

    $scope.getChart = function () {
        var chart1 = {};
        chart1.type = "PieChart";
        chart1.data = [
           ['Account', 'pay']
           //,
           //['Software', 50000],
           //['Hardware', 80000]
        ];
        //chart1.data.push(['Services', 20000]);

        //chart1.data = [['Account', 'Pay']];
        angular.forEach($scope.transactions, function (trans) {
            chart1.data.push([trans.accountname, trans.amountpaid]);
        });

        chart1.options = {
            displayExactValues: true,
            width: 400,
            height: 200,
            is3D: true,
            chartArea: { left: 10, top: 10, bottom: 0, height: "100%" }
        };

        chart1.formatters = {
            number: [{
                columnNum: 1,
                pattern: "$ #,##0.00"
            }]
        };

        $scope.chart = chart1;

        $scope.aa = 1 * $scope.chart.data[1][1];
        $scope.bb = 1 * $scope.chart.data[2][1];
        //$scope.cc = 1 * $scope.chart.data[3][1];
    }    

    ////////// end chart ////////////////////////

};


var ModalEditTransactionCtrl = function ($scope, $rootScope, $modalInstance, $location, $routeParams, $filter, $timeout, ApiTransaction, ApiAccount, $log, sharedProperties) {

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        //$location.path('/');
    };

    //////////////////////////////////////////////////    

    
    //var id = $routeParams.editId;
    var id = $scope.editid;
    $scope.action = id ? "Update" : "Add";
    $scope.submitted = false;

    $scope.transaction = ApiTransaction.get({ id: id });
    //$scope.mydate = $filter("date")(Date.now(), 'yyyy-MM-dd');
    //$scope.item = { birthDay: "10/25/2013" };
    //$scope.value = new Date(2013, 9, 22);
    $scope.$watch('transaction.duedate', function (unformattedDate) {
        $scope.transaction.duedate = $filter('date')(unformattedDate, 'MM/dd/yyyy');
        //$('#edittrans').click();
    });

    //editableForm.$show();

    $scope.save = function () {
        $scope.submitted = true;
        if (id) {
            ApiTransaction.update({ id: id }, $scope.transaction, function () {
                $modalInstance.dismiss('cancel');
                //$location.path('/transactions/transaction');
                $rootScope.$broadcast('handleChild', '');
            });
        } else {
            ApiTransaction.save($scope.transaction, function () {
                //$location.path('/transactions/transaction');
                $modalInstance.dismiss('cancel');
                $rootScope.$broadcast('handleChild', '');
            });
        }
        
    };

    $scope.accountnames = []
    $scope.getAccountNames = function () {
        ApiAccount.query({
        },
            function (accounts) {
                angular.forEach(accounts, function (account) {
                    $scope.accountnames.push(account.AccountName);
                });
            });
    };
    $scope.getAccountNames();
};


////app.controller('MainCtrl', function ($scope) {
//var TransactionChartCtrl = function ($scope) {              //// NOT USED YET /////
//    var chart1 = {};
//    chart1.type = "PieChart";
//    chart1.data = [
//       ['Component', 'cost'],
//       ['Software', 50000],
//       ['Hardware', 80000]
//    ];
//    chart1.data.push(['Services', 20000]);
//    chart1.options = {
//        displayExactValues: true,
//        width: 400,
//        height: 200,
//        is3D: true,
//        chartArea: { left: 10, top: 10, bottom: 0, height: "100%" }
//    };

//    chart1.formatters = {
//        number: [{
//            columnNum: 1,
//            pattern: "$ #,##0.00"
//        }]
//    };

//    $scope.chart = chart1;

//    $scope.aa = 1 * $scope.chart.data[1][1];
//    $scope.bb = 1 * $scope.chart.data[2][1];
//    $scope.cc = 1 * $scope.chart.data[3][1];
//};
////});
