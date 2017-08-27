angular.module('yakaserver.controllers', []).
    controller('usersController', function ($scope) {
        $scope.driversList = [
            {
                Driver: {
                    givenName: 'Sebastian',
                    familyName: 'Vettel'
                },
                points: 322,
                nationality: "German",
                Constructors: [
                    { name: "Red Bull" }
                ]
            },
            {
                Driver: {
                    givenName: 'Fernando',
                    familyName: 'Alonso'
                },
                points: 207,
                nationality: "Spanish",
                Constructors: [
                    { name: "Ferrari" }
                ]
            }
        ];

        $http({
            method: 'GET',
            url: '/listusers'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        $scope.usersList;
    });