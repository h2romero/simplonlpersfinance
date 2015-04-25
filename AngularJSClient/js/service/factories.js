/// <reference path="factories.js" />


// Execute bootstrapping code and any dependencies.
//FinanceApp.run(['$q', '$rootScope',
//    function ($q, $rootScope) {
//    }]);

var accessToken = "";

//FinanceApp.run(function (editableOptions) {
//    editableOptions.theme = 'bs3';
//});

FinanceApp.factory('httpErrorsInterceptor', function ($q, $rootScope, EventsDict) {
    function successHandler(response) {
        return response;
    }

    function errorHandler(response) {
        var config = respose.config;
        if (config.bypassErrorInterceptor) {
            return $q.reject(response);
        }
        $rootScope.$broadcast(EventsDict.httpError, response.data.cause);
        return $q.reject(response);
    }

    return function (promise) {
        return promise.then(successHandler, errorHandler);
    };
});

FinanceApp.run(function ($rootScope, $location, api, editableOptions) {
    $rootScope.$watch(function () {
        editableOptions.theme = 'bs3';
        return $location.path();
    },
     function (a) {
         console.log('url has changed: ' + a);
         // show loading div, etc...
         //if (a != '/login')
         api.init(a);
     });
});

FinanceApp.factory('api', function ($http) {
    return {
        init: function (a) {
            //$http.defaults.headers.common['X-Access-Token'] = token || $cookies.token;
            //$http.defaults.headers.common['Authorization'] = "Bearer " + (token || $cookies.token);
            //$http.defaults.headers.common['Accept'] = "application/json, text/plain, */*";
            $http.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
            if (a == '/login')
                delete $http.defaults.headers.common['Authorization'];
        }
    };
});

//var serverBaseUrl = 'http://localhost:51088';
//var serverBaseUrl = 'http://localhost'
var serverBaseUrl = 'http://financeserver.simpleonlinepersonalfinance.com';

FinanceApp.factory('ApiCompany', function ($resource) {
    //return $resource('/api/person/:id', { id: '@id' }, { update: { method: 'PUT' } });
    return $resource(serverBaseUrl + '/api/ApiCompany/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
});
FinanceApp.factory('ApiAccount', function ($resource) {
    return $resource(serverBaseUrl + '/api/ApiAccount/:id', { id: '@id' }, { 'update': { method: 'PUT' } }, { 'query': { method: 'GET', isArray: false } });
});
FinanceApp.factory('ApiTransaction', function ($resource) {
    return $resource(
            serverBaseUrl + '/api/ApiTransaction/:id', {
                id: '@id'
            }, {
                'update': { method: 'PUT' }
            }, {
                'query': {
                    method: 'GET',
                    isArray: false
                }
            }, {
                post: {
                    method: "POST",
                    isArray: false
                }
            }
        );
});
FinanceApp.factory('LoginService', function () {
    var loggedIn = ''; //false;

    return {
        isLogged: function () {
            return loggedIn ? true : false;
        },
        toggleIsLoggedIn: function (data) {
            loggedIn = data;
        }
    }
});
//////FinanceApp.factory('api', function ($http) {
//////    return {
//////        init: function (accessToken) {
//////            $http.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
//////        }
//////    };
//////});

//////FinanceApp.run(function (api) {
//////    api.init();
//////});