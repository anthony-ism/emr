'use strict';

angular.module('meApp')
  .controller('AdminNavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/adminPanel'
    },
    {
        'title': 'Practices',
        'link': '/adminPractices'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/adminLogin');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });