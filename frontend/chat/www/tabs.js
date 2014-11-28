/**
 * Created by nadav on 11/28/14.
 */


(function(){
    function TabsController(scope,OpenFB){

        var self = this;


        OpenFB.get('/me').success(function (user) {
            debugger;
            self.user = user;
        });


    }

    angular.module('tvchat')
        .controller('TabsController',['$scope','OpenFB',TabsController]);
}());