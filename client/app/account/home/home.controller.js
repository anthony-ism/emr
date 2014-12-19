'use strict';

angular.module('meApp')
  .controller('HomeCtrl', function ($scope, PracticeAuth) {
    $scope.errors = {};
    $scope.output = function() {
        return JSON.stringify(PracticeAuth.getCurrentUser(), undefined, 2);
    }

});
