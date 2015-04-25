function navCtrl($scope, $location) {
    $scope.tabs = [
        { link: '#/', label: 'Home' },
        { link: '#/transactions/transaction', label: 'Transactions' },
        { link: '#/transactions/account', label: 'Accounts' },
        { link: '#/transactions/company', label: 'Companies' }
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
};