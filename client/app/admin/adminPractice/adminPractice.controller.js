'use strict';

angular.module('meApp')
  .controller('AdminPracticeCtrl', function ($scope, Practice, $stateParams, $http) {
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
            $scope.submitted = true;
            if(form.$valid) {
                $http.put("/api/practices/" + $stateParams.id + "/user/" + $scope.practice.user[0]._id,
                    $scope.practice.user[0]).then(function(response)
                    {
                        console.log(response);
                        console.log("updated");
                    });
            }
        }

        $scope.submitFacility = function(form, $index)
        {
            $scope.submitted = true;
            if(form.$valid) {
                $http.put("/api/practices/" + $stateParams.id + "/facility/" + $scope.practice.facility[$index]._id,
                    $scope.practice.facility[$index]).then(function(response)
                    {
                        console.log(response);
                        console.log("updated");
                    });
            }
        }


        $scope.submitFacilityHours = function(form, $index)
        {
            $scope.submitted = true;
            if(form.$valid) {
                if ($scope.practice.facility[0].hours[$index]._id !== undefined)
                {
                    $http.put("/api/practices/" + $stateParams.id + "/facility/" + $scope.practice.facility[0]._id + "/hours/"
                        + $scope.practice.facility[0].hours[$index]._id,
                        $scope.practice.facility[0].hours[$index]).then(function (response) {
                            console.log(response);
                            console.log("updated");
                        });
                }
                else
                {
                    $http.post("/api/practices/" + $stateParams.id + "/facility/" + $scope.practice.facility[0]._id + "/hours",
                        $scope.practice.facility[0].hours[$index]).then(function (response) {
                            console.log(response);
                            console.log("inserted");
                        });
                }
            }
        }
  });



