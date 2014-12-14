'use strict';

angular.module('meApp')
  .controller('AdminPracticesCtrl', function ($scope, Practice) {
        // Use the User $resource to fetch all practices
        $scope.practices = Practice.query();
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

