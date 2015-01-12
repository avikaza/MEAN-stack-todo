function LoginSignUpController($scope, $rootScope, $location, AuthenticateService, UserService) {
    $scope.showError = false;
    $scope.errorMessage = "";
    $scope.userEmail = "";
    $scope.password = "";
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.confirmPassword = "";
    $scope.loginHandler = function () {
        $scope.validateLogin();
        if($scope.errorMessage.length > 0) {
           $scope.showError = true;
        } else {
            AuthenticateService.get({userEmail:$scope.userEmail, password:$scope.password}, function(userInfo) {
                 if(userInfo.status === 'win') {
                     $rootScope.user = userInfo.user;
                     $location.path('todos');
                 } else if(userInfo.status === 'fail') {
                     $scope.errorMessage = "Login Failed";
                     $scope.showError = true;
                 }
            });
        }
    }
    $scope.signUpHandler = function () {
       $scope.validateLogin();
       $scope.validateSignUp();
       if($scope.errorMessage.length > 0) {
           $scope.showError = true;
       } else {
           var newUser = new UserService({user_email:$scope.userEmail, password:$scope.password,
                                          profile: {name : {first: $scope.firstName, last: $scope.lastName}}});
           newUser.$save(function(u) {
               if(u.status === 'win') {
                   $rootScope.user = u.user;
                   $location.path('todos');
               } else {
                   $scope.errorMessage = u.errorString;
                   $scope.showError = true;
               }
           });
       }
    }
    $scope.loadSingUp = function () {
        $location.path('sign-up');
    }
    $scope.validateLogin = function () {
        $scope.errorMessage = "";
        $scope.showError = false;
        if($scope.userEmail === "") {
            $scope.errorMessage = "User Email blank";
        }else if (!$scope.userEmail.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
            $scope.errorMessage = "User Email not valid";
        }
        if($scope.password === "") $scope.errorMessage = $scope.errorMessage + " | Password blank";
    }
    $scope.validateSignUp = function () {
       if ($scope.lastName.length < 1) $scope.errorMessage = "Last Name blank | " + $scope.errorMessage;
       if ($scope.firstName.length < 1) $scope.errorMessage = "First Name blank | " + $scope.errorMessage;
       if ($scope.password !== $scope.confirmPassword) $scope.errorMessage = $scope.errorMessage + " | Passwords don't match";
    }
}
LoginSignUpController.$inject = ['$scope', '$rootScope', '$location', 'AuthenticateService', 'UserService'];