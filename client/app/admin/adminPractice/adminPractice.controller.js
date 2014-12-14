'use strict';

angular.module('meApp')
  .controller('AdminPracticeCtrl', function ($scope, Practice, $stateParams) {
        // Use the User $resource to fetch all practices
        $scope.practice = Practice.get({ id: $stateParams.id });

        $scope.output = function() {
            return JSON.stringify($scope.practice, undefined, 2);
        }

        $scope.submitGeneral = function(form) {
            console.log("general submit");
            $scope.submitted = true;
            if(form.$valid) {
                Practice.put(
                    { id: $stateParams.id },
                    {
                        name: $scope.practice.name,
                        active: $scope.practice.active
                    }
                )
                .$promise.then( function() {
                    console.log("updated");
                })
                .catch( function() {
                    console.log("error");
                });
            }
        };

        $scope.submitUser = function(form)
        {
            console.log("user submit");
            $scope.submitted = true;
            if(form.$valid) {
                Practice.put(
                    { id: $stateParams.id },
                    {
                        _id: $scope.practice.user[0].id,
                        name: $scope.practice.user[0].name,
                        email: $scope.practice.user[0].email
                    }
                )
                .$promise.then( function() {
                    console.log("updated");
                })
                .catch( function() {
                    console.log("error");
                });
            }
        }
  });



