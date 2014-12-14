'use strict';

angular.module('meApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('adminLogin', {
                url: '/adminLogin',
                templateUrl: 'app/admin/adminLogin/adminLogin.html',
                controller: 'AdminLoginCtrl',
                authenticate: false
            })
            .state('adminPanel', {
                url: '/adminPanel',
                templateUrl: 'app/admin/adminPanel/adminPanel.html',
                controller: 'AdminPanelCtrl',
                authenticate: true
            })
            .state('adminPractices', {
                url: '/adminPractices',
                templateUrl: 'app/admin/adminPractices/adminPractices.html',
                controller: 'AdminPracticesCtrl',
                authenticate: true
            })
            .state('adminPractice', {
                url: '/adminPractice/:id',
                templateUrl: 'app/admin/adminPractice/adminPractice.html',
                controller: 'AdminPracticeCtrl',
                authenticate: true
            })

    });