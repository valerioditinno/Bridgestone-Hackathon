/**=========================================================
 * Module: PortletsController.js
 * Controller for the Tasks APP 
 =========================================================*/

App.controller("TasksController", TasksController);

function TasksController($scope, $filter, $modal) {
  'use strict';
  var vm = this;

  vm.taskEdition = false;

  vm.tasksList = [
    {
      task: {title: "Solve issue #5487", description: "Praesent ultrices purus eget velit aliquet dictum. "},
      complete: true
    },
    {
      task: {title: "Commit changes to branch future-dev.", description: ""},
      complete: false
    }
    ];
  

  vm.addTask = function(theTask) {
    
    if( theTask.title === "" ) return;
    if( !theTask.description ) theTask.description = "";
    
    if( vm.taskEdition ) {
      vm.taskEdition = false;
    }
    else {
      vm.tasksList.push({task: theTask, complete: false});
    }
  };
  
  vm.editTask = function(index, $event) {
  
    $event.stopPropagation();
    vm.modalOpen(vm.tasksList[index].task);
    vm.taskEdition = true;
  };

  vm.removeTask = function(index, $event) {
    vm.tasksList.splice(index, 1);
  };
  
  vm.clearAllTasks = function() {
    vm.tasksList = [];
  };

  vm.totalTasksCompleted = function() {
    return $filter("filter")(vm.tasksList, function(item){
      return item.complete;
    }).length;
  };

  vm.totalTasksPending = function() {
    return $filter("filter")(vm.tasksList, function(item){
      return !item.complete;
    }).length;
  };


  // modal Controller
  // ----------------------------------- 

  vm.modalOpen = function (editTask) {
    var modalInstance = $modal.open({
      templateUrl: '/myModalContent.html',
      controller: ModalInstanceCtrl,
      scope: $scope,
      resolve: {
        editTask: function() {
          return editTask;
        }
      }
    });

    modalInstance.result.then(function () {
      // Modal dismissed with OK status
    }, function () {
      // Modal dismissed with Cancel status'
    });

  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  var ModalInstanceCtrl = function ($scope, $modalInstance, editTask) {

    $scope.theTask = editTask || {};

    $scope.modalAddTask = function (task) {
      vm.addTask(task);
      $modalInstance.close('closed');
    };

    $scope.modalCancel = function () {
      vm.taskEdition = false;
      $modalInstance.dismiss('cancel');
    };

    $scope.actionText = function() {
      return vm.taskEdition ? 'Edit Task' : 'Add Task';
    };
  };

}
