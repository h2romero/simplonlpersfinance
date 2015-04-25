var FinanceApp = angular.module("FinanceApp", ["ngRoute", "ngResource", "xeditable", 'mgcrea.ngStrap', 'googlechart', 'ngInputDate',"ui.bootstrap"]).        //"ui.bootstrap"    , 'ngAnimate', 'ngSanitize'
//var FinanceApp = angular.module("FinanceApp", ["ngRoute"]).
    config(function ($routeProvider) {
        $routeProvider
            .when('/', { controller: CarouselCtrl, templateUrl: 'Views/Home/Main.html' })

            .when('/transactions/company', { controller: CompanyListCtrl, templateUrl: 'Views/Company/List.html' })
            .when('/transactions/newCompany', { controller: CompanyCreateCtrl, templateUrl: 'Views/Company/Details.html' })
            .when('/transactions/editCompany/:editId', { controller: CompanyEditCtrl, templateUrl: 'Views/Company/Details.html' })

            .when('/transactions/account', { controller: AccountListCtrl, templateUrl: 'Views/Account/List.html' })
            .when('/transactions/newAccount', { controller: AccountCreateCtrl, templateUrl: 'Views/Account/Details.html' })
            .when('/transactions/editAccount/:editId', { controller: AccountEditCtrl, templateUrl: 'Views/Account/Details.html' })

            .when('/transactions/transaction', { controller: TransactionListCtrl, templateUrl: 'Views/Transaction/List.html' })
            .when('/transactions/newTransaction', { controller: TransactionCreateCtrl, templateUrl: 'Views/Transaction/Details.html' })
            .when('/transactions/editTransaction/:editId', { controller: TransactionEditCtrl, templateUrl: 'Views/Transaction/Details.html' })
            //.when('/transactions/editTransaction/:editId', { controller: TransactionEditCtrl, templateUrl: 'modal-base.html' })
            .when('/transactions/chartTransaction', { controller: 'TransactionChartCtrl', templateUrl: 'Views/Transaction/Chart.html' })

            //.when('/login', { controller: 'mainCtrl', templateUrl: 'Views/partials/login.html' })
            .when('/login', { controller: 'mainCtrl', templateUrl: 'modal-base.html' })
            .when('/logout', { controller: 'logoutCtrl', templateUrl: 'modal-base.html' })
            //.when('/register', { controller: 'mainCtrl', templateUrl: 'Views/partials/register.html' })
            .when('/register', { controller: 'registerCtrl', templateUrl: 'modal-base.html' })
            .when('/contact', { templateUrl: 'Views/partials/contact.html' })

            .otherwise({ redirectTo: '/' });
    })
    //.config(function ($httpProvider) {
    //    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //})
    //.config(['$httpProvider', function ($httpProvider) {
    //    $httpProvider.defaults.useXDomain = true;
    //    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //}
    //])

    .config(['$httpProvider', function ($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }])

    .config(["$httpProvider", function ($httpProvider) {
        $httpProvider.defaults.transformResponse.push(function (responseData) {
            convertDateStringsToDates(responseData);
            return responseData;
        });
    }]);

//var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
var regexIso8601 = /^20[\d]{2}(\/|-)[\d]{2}(\/|-)[\d]{2}(\s|T)[\d]{2}:[\d]{2}:[\d]{2}((\+|-)[0-1][\d]:?(0|3)0)?$/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                var localDate = new Date(milliseconds);
                var localTime = localDate.getTime();
                var localOffset = localDate.getTimezoneOffset() * 60000;
                input[key] = new Date(localTime + localOffset);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}