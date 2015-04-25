/* Company */

var CompanyEditCtrl = function ($scope, $location, $routeParams, ApiCompany) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.company = ApiCompany.get({ id: id });

    $scope.save = function () {
        //debugger;
        ApiCompany.update({ id: id }, $scope.company, function () {
            //debugger;
            $location.path('/');
        });
    };
};

var CompanyCreateCtrl = function ($scope, $location, ApiCompany) {
    $scope.action = "Add";
    $scope.save = function () {
        //debugger;
        ApiCompany.save($scope.company, function () {
            //debugger;
            $location.path('/');
        });
    };
};

var CompanyListCtrl = function ($scope, $location, ApiCompany) {
    $scope.search = function () {
        //$scope.companies = ApiCompany.query({ sort: $scope.sort_order, desc: $scope.is_desc });
        ApiCompany.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_desc,
            offset: $scope.offset,
            limit: $scope.limit
        },
            function (data) {
                $scope.more = data.length === 20;
                $scope.companies = $scope.companies.concat(data);
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
        $scope.companies = [];
        $scope.more = true;
        $scope.search();
    };

    $scope.delete = function () {
        //debugger;
        var id = this.company.CompanyID;
        ApiCompany.delete({ id: id }, function () {
            //debugger;
            $('#company_' + id).fadeOut();
        });
    };

    $scope.sort_order = "CompanyName";
    $scope.is_desc = false;

    $scope.reset();
};