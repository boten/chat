/**
 * Created by nadav on 10/24/14.
 */


(function(){
    function LoginController($scope,OpenFB,$state){


        $scope.login=function(){
            OpenFB.login('email,read_stream,publish_stream').then(
                function (data) {
                    $state.go('tab.index');

                },
                function () {
                    alert('OpenFB login failed');
                });
        }

        $scope.bob = function(){
            $state.go('tab.index', {}, {reload: true});
        }

    }

    angular.module('tvchat')
        .controller('LoginController',['$scope','OpenFB','$state',LoginController]);
}());