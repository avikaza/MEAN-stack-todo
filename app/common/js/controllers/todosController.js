function TODOsController($scope, $rootScope, $location, TODOService, TODOServiceById) {
    if(!$rootScope.user) {
        $location.path('login');
    }
    $scope.task = "";
    $scope.priority = 1;
    $scope.dueDate = new Date();
    $scope.taskDescription = "";
    $scope.errorMessage = "";
    $scope.showError = false;
    $scope.errorMessage2 = "";
    $scope.showError2 = false;
    $scope.todos = [];
    $scope.selSort = "priority";
    $scope.editModeIndex = -1;
    TODOService.get({userEmail:$rootScope.user.user_email, password:$rootScope.user.password}, function(obj) {
        if(obj.status === 'win') {
            $scope.todos = obj.todos;
            $scope.priority = $scope.todos.length + 1;
        } else if(obj.status === 'fail') {
            throw obj.error;
        }
    });
    $scope.addTask = function () {
        $scope.errorMessage = "";
        $scope.showError = false;
        if ($scope.task === "") $scope.errorMessage = "Task Blank";
        if (!$scope.priority || isNaN($scope.priority)) $scope.errorMessage = $scope.errorMessage + " | Priority not a number";
        if (!$scope.dueDate || isNaN($scope.dueDate.getTime())) $scope.errorMessage = $scope.errorMessage + " | Due Date is not valid";
        if ($scope.errorMessage.length > 0) {$scope.showError = true;} else {
           var newTODO = new TODOService({user_id: $rootScope.user._id,
                                          task: $scope.task,
                                          task_description: $scope.taskDescription,
                                          priority: $scope.priority,
                                          due_date: $scope.dueDate,
                                          complete: false,
                                          last_update: new Date()
                                          });
           newTODO.$save({userEmail:$rootScope.user.user_email, password:$rootScope.user.password}, function(t) {
               if(t.status === 'win') {
                   $scope.todos.push(t.todo);
                   $scope.task = "";
                   $scope.taskDescription = "";
                   $scope.priority = $scope.todos.length + 1;
                   $scope.showAddNewTask = false;
               } else {
                   $scope.errorMessage = t.errorString;
                   $scope.showError = true;
               }
           });
       }
    }
    $scope.updateTask = function (todo) {
       $scope.errorMessage2 = "";
       $scope.showError2 = false;
       if (todo.task === "") $scope.errorMessage2 = "Task Blank";
       if (!todo.priority || isNaN(todo.priority)) $scope.errorMessage2 = $scope.errorMessage2 + " | Priority not a number";

       if (!todo.due_date || isNaN(Date.parse(todo.due_date))) $scope.errorMessage2 = $scope.errorMessage2 + " | Due Date is not valid";
       if ($scope.errorMessage2.length > 0) {$scope.showError2 = true;} else {
        var updateTODO = new TODOService(todo);
        updateTODO.$update({userEmail:$rootScope.user.user_email, password:$rootScope.user.password}, function(t) {
            if(t.status === 'win') {
                $scope.editModeIndex = -1;
            }else {
                throw t.error;
            }
        });
       }
    }
    $scope.deleteTask = function (todo) {
        var deleteTODO = new TODOServiceById();
        deleteTODO.$delete({userEmail:$rootScope.user.user_email, password:$rootScope.user.password, id:todo._id}, function(t) {
            if(t.status === 'win') {
                for(var i = 0; i < $scope.todos.length; i = i + 1) {
                    if($scope.todos[i]._id === todo._id) {
                        $scope.todos.splice(i, 1);
                        break;
                    }
                }
            }else {
               throw t.error;
            }
        });
    }
    $scope.setEditModeIndex = function (indx) {
        $scope.editModeIndex = indx;
    }
    $scope.checkIndex = function (indx) {
        return $scope.editModeIndex === indx;
    }
}
TODOsController.$inject = ['$scope', '$rootScope', '$location', 'TODOService', 'TODOServiceById'];
