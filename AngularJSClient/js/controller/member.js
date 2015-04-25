
var memberCtrl = function ($scope, LoginService) {

    $scope.tabs = [
    { link: '#/transactions/transaction', label: 'Transactions' },
    { link: '#/transactions/account', label: 'Accounts' },
    { link: '#/transactions/company', label: 'Companies' }
    ];

    $scope.selectedTab = $scope.tabs[0];

    $scope.setSelectedTab = function (tab) {
        $scope.selectedTab = tab;
    };

    $scope.tabClass = function (tab) {
        if ($scope.selectedTab == tab) {
            return "active";
        } else {
            return "";
        }
    };

    $scope.getLogStatus = function () {
        return LoginService.isLogged();
    }
};