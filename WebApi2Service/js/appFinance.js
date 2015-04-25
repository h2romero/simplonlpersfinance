var FinanceApp = angular.module("FinanceApp", ["ngRoute", "ngResource"]).
//var FinanceApp = angular.module("FinanceApp", ["ngRoute"]).
    config(function ($routeProvider) {
        $routeProvider
            .when('/', { controller: CompanyListCtrl, templateUrl: '../Home/Main.html' })

            .when('/company', { controller: CompanyListCtrl, templateUrl: '../Company/List.html' })
            .when('/newCompany', { controller: CompanyCreateCtrl, templateUrl: '../Company/Details.html' })
            .when('/editCompany/:editId', { controller: CompanyEditCtrl, templateUrl: '../Company/Details.html' })

            .when('/account', { controller: AccountListCtrl, templateUrl: '../Account/List.html' })
            .when('/newAccount', { controller: AccountCreateCtrl, templateUrl: '../Account/Details.html' })
            .when('/editAccount/:editId', { controller: AccountEditCtrl, templateUrl: '../Account/Details.html' })

            .when('/transaction', { controller: TransactionListCtrl, templateUrl: '../Transaction/List.html' })
            .when('/newTransaction', { controller: TransactionCreateCtrl, templateUrl: '../Transaction/Details.html' })
            .when('/editTransaction/:editId', { controller: TransactionEditCtrl, templateUrl: '../Transaction/Details.html' })

            .when('/login', { controller: 'LoginCtrl', templateUrl: '../partials/login.html'})

            .otherwise({ redirectTo: '/' });
    })
    //.config(function ($httpProvider) {
    //    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //})
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])
.directive('greet', function () {
    return {
        //scope: true,
        //transclude: true,
        //require: '',
        template: '<h2>Greetings from {{from}} to my dear {{to}}</h2>',
        //link: function (scope, elm, attrs, ctrl) {
        //},
        controller: function ($scope, $element, $attrs) {
            $scope.from = $attrs.from;
            $scope.to = $attrs.greet;
        }
    };
})
.directive('sorted', function () {
    return {
        scope: true,
        transclued: true,
        template: '<a ng-click="do_sort()" ng-transclude></a>' +
            '<span ng-show="do_show(true)"><i class="glyphicon glyphicon-arrow-down"></i></span>' +
            '<span ng-show="do_show(false)"><i class="glyphicon glyphicon-arrow-up"></i></span>',
        controller: function ($scope, $element, $attrs) {
            $scope.sort = $attrs.sorted;
            $scope.do_sort = function () { $scope.sort_by($scope.sort); };
            $scope.do_show = function (asc) {
                return (asc != $scope.sort_desc) && ($scope.sort_order == $scope.sort);
            }
        }
    };
})
.directive('datepicker', function () {
    return function (scope, element, attrs) {
        element.datepicker({
            inline: false,
            dateFormat: 'm/d/yy',
            showOtherMonths: true,
            showOn: "both",
            buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
            buttonImageOnly: true,
            onSelect: function (dateText) {
                var modelPath = $(this).attr('ng-model');
                putObject(modelPath, scope, dateText);
                scope.$apply();
            }
        });
    }
})
.directive('loginDirective', function () {
    return {
        templateUrl: '../partials/tpl/login.tpl.html'
    }

});

var port = '51088';  //57133 62000
//FinanceApp.factory('ApiCompany', function ($resource) {
//    //return $resource('/api/person/:id', { id: '@id' }, { update: { method: 'PUT' } });
//    return $resource('http://localhost:57133/api/ApiCompany/testuser/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
//});
//FinanceApp.factory('ApiAccount', function ($resource) {
//    return $resource('http://localhost:57133/api/ApiAccount/testuser/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
//});
//FinanceApp.factory('ApiTransaction', function ($resource) {
//    return $resource('http://localhost:57133/api/ApiTransaction/testuser/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
//});

FinanceApp.factory('ApiCompany', function ($resource) {
    //return $resource('/api/person/:id', { id: '@id' }, { update: { method: 'PUT' } });
    return $resource('http://localhost:' + port + '/api/ApiCompany/testuser/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
});
FinanceApp.factory('ApiAccount', function ($resource) {
    return $resource('http://localhost:' + port + '/api/ApiAccount/testuser/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
});
FinanceApp.factory('ApiTransaction', function ($resource) {
    return $resource('http://localhost:' + port + '/api/ApiTransaction/testuser/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
});

//FinanceApp.factory('LoginService', function ($resource) {   
//        return $resource('http://localhost:57133/Account/JsonLogin', { 'query': { method: 'GET', isArray: false } });

//});
//FinanceApp.factory('LoginService', function ($http) {
//    return {
//        login: function (data, scope) {
//            var $promise = $http.post('http://localhost:57133/Account/JsonLoginxxx', data, { withCredentials: true }); //send data to user.php
//            $promise.then(function (msg) {
//                if (msg.data == 'succes') scope.msgtxt = 'Correct information';
//                else scope.msgtxt = 'incorrect information';
//            });
//        }
//    }

//});
FinanceApp.factory('LoginService', function($http){
    return {
        login: function (data) {
            return $http.post('http://localhost:51088/Account/JsonLogin', data, { withCredentials: true });
        }
    }
});
//FinanceApp.factory('ApiCompany', ['$http', '$resource', function ($http, $resource) {
//    return function () {
//        return $resource('api/ApiCompany/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
//    };
//}]);

function navCtrl($scope, $location) {
    $scope.tabs = [
        { link: '#/', label: 'Home' },
        { link: '#/transaction', label: 'Transactions' },
        { link: '#/account', label: 'Accounts' },
        { link: '#/company', label: 'Companies' }
    ];

    $scope.selectedTab = $scope.tabs[0];
    $scope.setSelectedTab = function (tab) {
        $scope.selectedTab = tab;
    }

    $scope.tabClass = function (tab) {
        if ($scope.selectedTab == tab) {
            return "active";
        } else {
            return "";
        }
    }
    //$scope.navClass = function (page) {
    //    var currentRoute = $location.path().substring(1) || 'home';
    //    return page === currentRoute ? 'active' : '';
    //};
    //$scope.isActive = function (viewLocation) {
    //    return viewLocation === $location.path();
    //};

    //$scope.isActive = function (viewLocation) {
    //    var active = (viewLocation === $location.path());
    //    return active;
    //};
}




//////////////////////////////////////////////////

function putObject(path, object, value) {
    var modelPath = path.split(".");

    function fill(object, elements, depth, value) {
        var hasNext = ((depth + 1) < elements.length);
        if (depth < elements.length && hasNext) {
            if (!object.hasOwnProperty(modelPath[depth])) {
                object[modelPath[depth]] = {};
            }
            fill(object[modelPath[depth]], elements, ++depth, value);
        } else {
            object[modelPath[depth]] = value;
        }
    }
    fill(object, modelPath, 0, value);
}