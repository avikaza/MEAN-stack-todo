angular.module('TODO', ['TODO.filters', 'TODO.services', 'TODO.directives', 'ui.bootstrap']).
    config(['$routeProvider', function ($routeProvider) {
        'use strict';
       $routeProvider.when('/sign-up', {templateUrl: 'partials/signUp.html?' + VERSION, controller: 'LoginSignUpController'});
       $routeProvider.when('/todos', {templateUrl: 'partials/todoScreen.html?' + VERSION, controller: 'TODOsController'});
       $routeProvider.otherwise({templateUrl: 'partials/login.html?' + VERSION, controller: 'LoginSignUpController'});
    }]);
