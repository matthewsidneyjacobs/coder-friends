angular.module('githubApp')
    .controller('friendCtrl', function($scope, githubService, $stateParams) {

        githubService.getActivity($stateParams.github_username).then(function(data) {
            console.log(data);
            $scope.activities = data.data;
        }, function(err) {
            console.log(err);
        });

    });