'use strict';

angular.module('meApp')
  .controller('AdminPracticeCtrl', function ($scope, Practice, $stateParams, $http) {
        // Use the User $resource to fetch all practices
        $scope.practice = Practice.get({ id: $stateParams.id });

        $scope.output = function() {
            return JSON.stringify($scope.practice, undefined, 2);
        }

        var endPointArrayToString = function(arr)
        {
            var result = "/api"
            for (var i = 0; i < arr.length; i++)
            {
                if (arr[i].id !== undefined)
                    result += "/" + arr[i].endPoint + "/" + arr[i].id;
                else
                    result += "/" + arr[i].endPoint;

            }
            return result;
        }


        var submitEndpoint = function(arr, endpoint, form, object)
        {
            $scope.submitted = true;
            if(form.$valid) {
                if (arr[arr.length-1].id !== undefined)
                {
                    $http.put(endpoint, object).then(function (response) {
                        console.log(response);
                        console.log("updated");
                    });
                }
                else
                {
                    $http.post(endpoint, object).then(function (response) {
                        console.log(response);
                        console.log("inserted");
                    });
                }
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

        /******** Practice User Crud ********/
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

        /******** Facility Crud ********/
        $scope.submitFacility = function(form, facility)
        {
            console.log("come home with me");gi
            var arr =
                [
                    { endPoint: "practices", id: $stateParams.id},
                    { endPoint: "facility", id: facility._id}
                ]
                var endpoint = endPointArrayToString(arr);
                submitEndpoint(arr, endpoint, form, facility);
            }
        }

        $scope.deleteFacility = function(facility)
        {
            $scope.submitted = true;
            var arr =
                [
                    { endPoint: "practices", id: $stateParams.id},
                    { endPoint: "facility", id: facility._id}
                ]
            var endpoint = endPointArrayToString(arr);
            $http.delete(endPoint).then(function (response) {
                console.log(response);
                console.log("deleted");
            });
        }

        /******** Facility Hours Crud ********/
        $scope.submitFacilityHours = function(form, facility, hours)
        {
            var arr =
                [
                    { endPoint: "practices", id: $stateParams.id},
                    { endPoint: "facility", id: facility._id},
                    { endPoint: "hours", id: hours._id},
                ]
            var endpoint = endPointArrayToString(arr);
            submitEndpoint(arr, endpoint, form);
        }

        $scope.deleteHours = function($index)
        {
            $scope.submitted = true;
            var arr =
                [
                    { endPoint: "practices", id: $stateParams.id},
                    { endPoint: "facility", id: facility._id},
                    { endPoint: "hours", id: hours._id},
                ]
            var endpoint = endPointArrayToString(arr);
            $http.delete(endpoint).then(function (response) {
                    console.log(response);
                    console.log("deleted");
                });
        }

        /******** Contact Phone Crud ********/






  });



