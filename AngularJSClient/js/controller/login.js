//app.controller('loginCtrl', ['$scope', 'loginService', function ($scope, loginService) {
//    $scope.msgtxt = '';
//    $scope.login = function (data) {
//        loginService.login(data, $scope); //call login service
//    };
//}]);

var LoginCtrl = function ($scope, $location, LoginService) {
    $scope.UserName = '';
    $scope.login = function () {
        LoginService.login({
            UserName: $scope.user.UserName,
            Password: $scope.user.Password,
            RememberMe: $scope.user.RememberMe
        }, $scope).success(function(data){
            if (data.error) {
                console.log(data.error);
            } else {
                console.log("You are signed in!")
            }
        }); //call login service
    };
}

var mainCtrl = function ($scope, $modal, $log, $location, sharedProperties) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'Views/partials/login.html',
            controller: 'ModalLoginCtrl',
            size: size,
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
                $location.path("/");
            sharedProperties.setValue('cancelgohome', false);
        });
    };
    $scope.open();
};

FinanceApp.controller('ModalLoginCtrl', function ($scope, $modalInstance, $location, $q, $log, userAccountService, LoginService, sharedProperties) {

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        //$location.path('/');
    };

    //////////////////////////////////////////////////    

    $scope.title = 'mainCtrl';
    $scope.isRegistered = false;
    $scope.isLoggedIn = false;
    sharedProperties.setValue('cancelgohome', false);
    $scope.msgtxt = "";
    $scope.userData = {
        userName: "",
        password: "",
        //userName: "hromero",
        //password: "hecrom",
        //userName: "testuser2",
        //password: "testuser2",
        confirmPassword: ""
    };

    $scope.loginUser = function () {
        $scope.loading = true;
        userAccountService.loginUser($scope.userData).then(function (data) {
            $scope.isLoggedIn = true;
            $scope.userName = data.userName;
            $scope.bearerToken = data.access_token;
            LoginService.toggleIsLoggedIn($scope.userName);
            sharedProperties.setValue('cancelgohome', true);
            $location.path("/transactions/transaction");
            $scope.loading = false;
            $modalInstance.dismiss('cancel');
        }, function (error, status, result) {
            $scope.isLoggedIn = false;
            $scope.msgtxt = error.error_description;
            console.log(status);
            LoginService.toggleIsLoggedIn();
            $scope.loading = false;
        });
    }
    $scope.getValues = function () {
        userAccountService.getValues().then(function (data) {
            $scope.values = data;
            console.log('back... with success');
        });
    }
    $scope.registerLink = function () {
        $modalInstance.dismiss('cancel');
        sharedProperties.setValue('cancelgohome', true);
        $location.path("/register");
    }
});

///////

var registerCtrl = function ($scope, $modal, $log, $location) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'Views/partials/register.html',
            controller: 'ModalRegisterCtrl',
            size: size
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            $location.path("/");
        });
    };
    $scope.open();
};

FinanceApp.controller('ModalRegisterCtrl', function ($scope, $modalInstance, $location, $q, $log, userAccountService) {

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        //$location.path('/');
    };

    //////////////////////////////////////////////////

    //$scope.registerUser = registerUser;
    //$scope.loginUser = loginUser;
    //$scope.getValues = getValues;
    $scope.registerUser = function () {
        userAccountService.registerUser($scope.userData).then(function (data) {
            $scope.isRegistered = true;
            //$modalInstance.dismiss('cancel');
            //$location.path("/login");

        }, function (error, status) {
            $scope.isRegistered = false;
            $scope.msgtxt = error[0];
            console.log(response);
        });
    }

    $scope.loginLink = function () {
        $modalInstance.dismiss('cancel');
        $location.path("/login");
    }
   
});

////// Log Out //////////

var logoutCtrl = function ($scope, $modal, $log, $location) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'Views/partials/logout.html',
            controller: 'ModalLogoutCtrl',
            size: size
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            $location.path("/");
        });
    };
    $scope.open();
};

FinanceApp.controller('ModalLogoutCtrl', function ($scope, $modalInstance, $location, $q, $log, userAccountService) {

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        //$location.path('/');
    };

    //////////////////////////////////////////////////

    ////$scope.registerUser = registerUser;
    ////$scope.loginUser = loginUser;
    ////$scope.getValues = getValues;
    //$scope.registerUser = function () {
    //    userAccountService.registerUser($scope.userData).then(function (data) {
    //        $scope.isRegistered = true;
    //        //$modalInstance.dismiss('cancel');
    //        //$location.path("/login");

    //    }, function (error, status) {
    //        $scope.isRegistered = false;
    //        $scope.msgtxt = error[0];
    //        console.log(response);
    //    });
    //}

    //$scope.loginLink = function () {
    //    $modalInstance.dismiss('cancel');
    //    $location.path("/login");
    //}

});
