angular.module('githubApp')
    .controller('homeCtrl', function($scope, githubService) {

        githubService.getFollowers().then(function(data) {
            console.log(data);

            $scope.followers = data.data;
        });

    });