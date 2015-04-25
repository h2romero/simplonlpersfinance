function HeaderCtrl($scope, $location, LoginService) {
    $scope.loginService = LoginService;

    $scope.$watch('loginService.isLogged()', function (newVal) {
        $scope.isLogged = newVal;
    });

    $scope.logout = function () {
        accessToken = '';
        $location.path("/logout");
        LoginService.toggleIsLoggedIn();
    };
};