var app = angular.module('yakaserver', []);

app.controller('apiCtrl', function ($http, $scope) {
        $scope.fileList = [];

        $http({
            method: 'GET',
            url: '/api/file_list'
        }).then(function successCallback(response) {
            $scope.fileList = response.data;
        }, function errorCallback(response) {
            console.log("Error");
        });
});
