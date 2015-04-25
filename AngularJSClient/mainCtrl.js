(function () {
    'use strict';
    var controllerId = 'mainCtrl';
    angular.module('app').controller(controllerId,
        ['userAccountService', mainCtrl]);
    function mainCtrl(userAccountService) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        // Bindable properties and functions are placed on vm.
        vm.title = 'mainCtrl';
        vm.isRegistered = false;
        vm.isLoggedIn = false;
        vm.userData = {
            userName: "",
            password: "",
            confirmPassword: "",
        };
        vm.registerUser = registerUser;
        vm.loginUser = loginUser;
        vm.getValues = getValues;
        function registerUser() {
            userAccountService.registerUser(vm.userData).then(function (data) {
                vm.isRegistered = true;
            }, function (error, status) {
                vm.isRegistered = false;
                console.log(status);
            });
        }
        function loginUser() {
            userAccountService.loginUser(vm.userData).then(function (data) {
                vm.isLoggedIn = true;
                vm.userName = data.userName;
                vm.bearerToken = data.access_token;
            }, function (error, status) {
                vm.isLoggedIn = false;
                console.log(status);
            });
        }
        function getValues() {
            userAccountService.getValues().then(function (data) {
                vm.values = data;
                console.log('back... with success');
            });
        }
    }
})();