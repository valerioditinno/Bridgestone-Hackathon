/**=========================================================
 * Module: demo-alerts.js
 * Provides a simple demo for pagination
 =========================================================*/

App.controller('AlertDemoCtrl', function AlertDemoCtrl($scope) {
  'use strict';

  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'warning', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

});