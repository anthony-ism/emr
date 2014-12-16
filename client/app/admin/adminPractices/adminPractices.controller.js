'use strict';

angular.module('meApp')
  .controller('AdminPracticesCtrl', function ($scope, Practice, $http, $state) {
        // Use the User $resource to fetch all practices
        $scope.practices = Practice.query();

        $scope.addNew = function()
        {
            var practice = prompt("Please enter name", "");

            if (practice != null)
            {
                $http.post("/api/practices", {name: practice}).then(function(response) {
                    $state.transitionTo('adminPractice', {id: response.data._id});
                });
            }
        }
  });



angular.module('meApp')
    .factory('Practice', function ($resource) {
        return $resource('/api/practices/:id/:controller', {
                id: '@_id'
            },
            {
                get: {
                    method: 'GET',
                    params: {
                        id: '@_id',
                        isArray: false
                    }
                },
                put: {
                    method: 'PUT',
                    params: {
                        id: '@_id'
                    }
                }
            });
    });


