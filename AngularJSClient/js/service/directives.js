FinanceApp.directive('greet', function () {
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
        templateUrl: 'Views/partials/tpl/login.tpl.html'
    }

})
.directive('logoutDirective', function () {
    return {
        templateUrl: 'Views/partials/tpl/logout.tpl.html'
    }

}).directive('registerDirective', function () {
    return {
        templateUrl: 'Views/partials/tpl/register.tpl.html'
    }

}).directive('contactDirective', function () {
    return {
        templateUrl: 'Views/partials/tpl/contact.tpl.html'
    }

}).directive('autoComplete', function ($timeout) {
    return function (scope, iElement, iAttrs) {
        iElement.autocomplete({
            source: scope[iAttrs.uiItems],
            select: function () {
                $timeout(function () {
                    iElement.trigger('input');
                }, 0);
            }
        });
    };
}).directive('xngFocus', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.xngFocus,
          function (newValue) {
              newValue && element.focus();
          }, true);
    };
});


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