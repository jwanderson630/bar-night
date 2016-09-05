var app = angular.module('bar-night', ['ngRoute', 'ngResource', 'ui.bootstrap']).run(function($http, $rootScope){
	$rootScope.authenticated = false;
	$rootScope.current_user = '';


	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = '';
	};
});

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

app.factory('barGetter', function($resource){
	return $resource('/api/bars/:location');
});

app.controller('mainController', function($scope, $rootScope, $location, $http, barGetter){
	$scope.bars = barGetter.query();
});

app.controller('authController', function($scope, http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message= '';

	$scope.login= function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if (data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});
	};
})