'use strict';

angular.module('meApp')
  .controller('AdminPracticeCtrl', function ($scope, Practice, $stateParams, $http) {
        // Use the User $resource to fetch all practices



        $scope.output = function() {
            return JSON.stringify($scope.practice, undefined, 2);
        }

        /******** General Functions ********/
        var endPointArrayToString = function(arr)
        {
            var result = "/api"
            for (var i = 0; i < arr.length; i++)
            {
                if (arr[i].obj._id !== undefined)
                    result += "/" + arr[i].endPoint + "/" + arr[i].obj._id;
                else
                    result += "/" + arr[i].endPoint;

            }
            return result;
        }



        var submitEndpoint = function(arr, endpoint, form, object) {

            delete object.$$hashKey;
            $scope.submitted = true;
            if (form.$valid) {
                if (arr[arr.length - 1].id !== undefined) {
                    $http.put(endpoint, object).then(function (response) {
                        console.log(response);
                        console.log("updated");
                    });
                }
                else {
                    $http.post(endpoint, object).then(function (response) {
                        console.log(response);
                        console.log("inserted");
                    });
                }
            }
        }


        /******** Practice User Crud ********/
        $scope.practice = Practice.get({ id: $stateParams.id });


        $scope.submitPractice = function(form, practice) {
            var arr = [{ endPoint: "practices", obj: practice}];
            var endpoint = endPointArrayToString(arr);
            submitEndpoint(arr, endpoint, form, practice);
        }

        $scope.deletePractice = function(practice)
        {
            $scope.submitted = true;
            var arr = [{ endPoint: "practices", obj: practice}];
            var endpoint = endPointArrayToString(arr);
            $http.delete(endpoint).then(function (response) {
                console.log(response);
                console.log("deleted");
            });
        }

        /******** Facility Crud ********/

         $scope.submitFacility = function(form, practice, facility)
         {
            var arr = [
                { endPoint: "practices", obj: practice},
                { endPoint: "facility", obj: facility}
            ];
            var endpoint = endPointArrayToString(arr);
            submitEndpoint(arr, endpoint, form, facility);
         }


         $scope.deleteFacility = function(practice, facility)
         {
            $scope.submitted = true;
            var arr = [
                { endPoint: "practices", obj: practice},
                { endPoint: "facility", obj: facility}
            ];
            var endpoint = endPointArrayToString(arr);
            $http.delete(endpoint).then(function (response) {
                console.log(response);
                console.log("deleted");
            });
         }

        /*
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
        */


        /******** Facility Hours Crud ********/

        var facilityHoursArray = function(practice, facility, hours)
        {
            return [{ endPoint: "practices", obj: practice},
                    { endPoint: "facility", obj: facility},
                    { endPoint: "hours", obj: hours}];
        }
        $scope.submitFacilityHours = function(form, practice, facility, hours)
        {

            var arr = facilityHoursArray(practice, facility, hours);
            var endpoint = endPointArrayToString(arr);
            submitEndpoint(arr, endpoint, form, hours);
        }

        $scope.deleteHours = function(practice, facility, hours)
        {
            $scope.submitted = true;
            var arr = facilityHoursArray(practice, facility, hours);
            var endpoint = endPointArrayToString(arr);
            $http.delete(endpoint).then(function (response) {
                console.log(response);
                console.log("deleted");
            });
        }

        /******** Contact Phone Crud ********/
        var facilityContactPhone = function(practice, facility, phone)
        {
            return [{ endPoint: "practices", obj: practice},
                { endPoint: "facility", obj: facility},
                { endPoint: "contact.phone", obj: phone}];
        }

        $scope.submitFacilityContactPhone = function(form, practice, facility, phone)
        {
            var arr = facilityContactPhone(practice, facility, phone);
            var endpoint = endPointArrayToString(arr);
            submitEndpoint(arr, endpoint, form, phone);
        }

        $scope.deleteFacilityContactPhone = function(practice, facility, phone)
        {
            $scope.submitted = true;
            var arr = facilityContactPhone(practice, facility, phone);
            var endpoint = endPointArrayToString(arr);
            $http.delete(endpoint).then(function (response) {
                console.log(response);
                console.log("deleted");
            });
        }


    });
