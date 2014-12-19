'use strict';

angular.module('meApp')
  .controller('LoginCtrl', function ($scope, PracticeAuth, $location, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        PracticeAuth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $state.transitionTo('home');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
