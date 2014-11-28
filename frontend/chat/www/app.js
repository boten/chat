// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('tvchat', ['ionic','tvchat.services','openfb'])
    .config(function($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login',{
                url:'/login',
                templateUrl:'login/login.html',
                controller: 'LoginController'

            })
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "tabs.html",
                controller : 'TabsController as tab'
            })
            .state('tab.index', {
                url: '/index',
                views: {
                    'tab-index': {
                        templateUrl: 'main_list/main_list.html',
                        resolve: {
                            channel: ['httpService', function (httpService) {
                                return httpService.getChannelsList();
                            }]
                        },
                        controller: 'mainListController'
                    }
                }

            })
            .state('tab.info',{
                url: '/channel/:name',
                views: {
                    'tab-index': {
                        templateUrl: 'item_info/item_info.html',
                        resolve: {
                            msg: ['httpService', '$stateParams', function (httpService, stateParams) {
                                //done: fix how to get channel name -> state.params.name = undefined?
                                //fixes: use stateParams that is already exist with resolve :)
                                return httpService.getChannelMsg(stateParams.name);
                            }]
                        },
                        controller: 'itemInfoController',
                    }
                }

           })


    })
    .value('userSession',{})
    .controller('wrapperController', ['$scope','$state','$ionicNavBarDelegate','$stateParams','$timeout','$ionicLoading','OpenFB', function(scope,$state,ionicNavBarDelegate,stateParams,timeout,$ionicLoading,OpenFB) {



        scope.logout=function(){
            OpenFB.logout();
            $state.go('login');
        };



        scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {


            if (toState.resolve) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
            }

        });
        scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $ionicLoading.hide();
        });


        scope.disableBtn = false;

        scope.bingChannel = function(channelName){
            //socket.emit("addToCounter",{channelName: channelName});
            scope.disableBtn = true;
            timeout(function(){
                scope.disableBtn = false;
            },60000); // 1 min
        }


    }])
    .constant('socketConstant',{
        socket: io.connect('http://quiet-ridge-6377.herokuapp.com:80')
    })
    .run(function($ionicPlatform,socketConstant,$state,$rootScope,OpenFB) {

        OpenFB.init('664205657027056'); //fb unique id

      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }

      });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "app.login" && toState.name !== "app.logout" && !window.sessionStorage['fbtoken']) {
                $state.go('login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('login');
        });

        //making socket available all over the app:
      socket = socketConstant.socket;

    });
