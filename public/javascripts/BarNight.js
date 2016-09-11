var app = angular.module('bar-night', ['ngRoute', 'ngResource', 'ui.bootstrap','ngAnimate']).run(function($http, $rootScope){
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	$rootScope.user_location = null;


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


app.controller('mainController', function($scope, $rootScope, $location, $http){
	$scope.bars = [];
	$scope.searching = false;
	$scope.title = "Search for bars in your area...";

	

	$scope.notGoing = function(bar){
		bar.going.splice(bar.going.indexOf($rootScope.current_user,1));
	};

	$scope.isGoing = function(bar){
		bar.going.push($rootScope.current_user);
		$http.post('api/bar/' + bar._id, bar);
	};

	$scope.going = function(bar){
		if (bar.going.indexOf($rootScope.current_user) > -1){
			return true
		}
		else {
			return false
		}
	};

	$scope.yelpSearch = function(){
		$scope.searching = true;
		if ($rootScope.authenticated && $scope.location !== null){
			$http.post('/api/user/' + $scope.location + '/' + $rootScope.current_user);
		}
		$http.get('/api/bars/' + $scope.location).success(function(data){
			$scope.bars = data;
			$scope.searching = false;
			$scope.title = 'Results for ' + $scope.location;
		})
	};

	if ($rootScope.authenticated && $rootScope.user_location !== null){
		$scope.location = $rootScope.user_location;
		$scope.yelpSearch();
	}
});

app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message= '';

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if (data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$rootScope.user_location = data.user.location;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
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