/*global angular*/
var todoModule = angular.module('TODO.directives', []);
todoModule.directive('appVersion', ['version', function (version) {
    'use strict';
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);