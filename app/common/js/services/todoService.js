var todoServicesModule = angular.module('TODO.services', ['ngResource']);
var baseURL = 'http://localhost\::port/api/v1/';
todoServicesModule.factory('AuthenticateService', function($resource) {
   return $resource(baseURL + 'authenticate/:userEmail/:password',
                    {userEmail: '@userEmail',
                     password:  '@password',
                     port: 3000});
});
todoServicesModule.factory('UserService', function($resource) {
   return $resource(baseURL + 'user',
                    {port: 3000});
});
todoServicesModule.factory('TODOService', function($resource){
    return $resource(baseURL + 'todo/:userEmail/:password',
        {userEmail: '@userEmail',
         password:  '@password',
         port: 3000});
});
todoServicesModule.factory('TODOServiceById', function($resource){
    return $resource(baseURL + 'todo/:userEmail/:password/:id',
        {userEmail: '@userEmail',
            password:  '@password',
            id: '@id',
            port: 3000});
});