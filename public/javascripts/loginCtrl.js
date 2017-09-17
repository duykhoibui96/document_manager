app.controller('loginCtrl', function($scope, $http, $state, $rootScope, $localStorage) {

    $rootScope.option = 'login';
    $rootScope.sidebarOptions = [];
    $rootScope.task = '';


    $scope.signin = function(){

        if ($scope.isAuthenticating)
            return;
        $scope.isAuthenticating = true;
        $http.post('/account/authenticate', {

            Username: $scope.username,
            Password: $scope.password

        }).then(function(response) {

            var res = response.data;
            $scope.isAuthenticating = false;
            switch (res.Result) {
                case 'ERROR':
                    $rootScope.showAlert('error', res.Message);
                    break;

                default:

                    $localStorage.auth = {

                        username: res.Record.Username,
                        token: res.Record.EmplID

                    };

                    $state.transitionTo('dashboard');

            }


        }, function(err) {

            console.log(err.status);
            $scope.isAuthenticating = false;


        })

    }

})