angular.module('githubApp', ['ui.router'])

    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('myHttpInterceptor');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('login', {
                url: '/',
                template: '<form method="get" action="/auth/github"><button type="submit">Login with Github</button></form>'
            })
            .state('home', {
                url: '/home',
                templateUrl: './templates/home.html',
                controller: 'homeCtrl'
            })
            .state('friend', {
                url: '/friend/:github_username',
                templateUrl: './templates/friend.html',
                controller: 'friendCtrl'
            });

    })

    .factory('myHttpInterceptor', function($q) {
        return {
            // optional method
            'responseError': function(rejection) {
                if (rejection.status == 403) {
                    document.location = '/';
                    return;
                }
                return $q.reject(rejection);
            }
        };
    });