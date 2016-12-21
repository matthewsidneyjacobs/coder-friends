angular.module('githubApp').service('githubService', function($http) {

    this.getFollowers = function() {
        return $http.get('/api/github/following');
    };

    this.getActivity = function(username) {
        return $http.get('/api/github/'+ username +'/activity');
    }
});