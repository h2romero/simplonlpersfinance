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

    //$scope.login = function (data) {
    //    LoginService.query({
    //        data: data
    //    },
    //    function (data) {
    //        $scope.transactions = data;
    //    });
    //};
};