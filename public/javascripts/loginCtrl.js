app.controller('loginCtrl', function($scope, $http, $state, $rootScope, $localStorage) {

    $rootScope.option = 'login';
    $rootScope.sidebarOptions = [];
    $rootScope.task = '';


    $scope.signin = () => {

        if ($scope.isAuthenticating)
            return;
        $scope.isAuthenticating = true;
        $http.post('/accounts/authenticate', {

            Username: $scope.username,
            Password: $scope.password

        }).then(response => {

            var res = response.data;
            $scope.isAuthenticating = false;
            switch (res.ret) {
                case -1:
                    $rootScope.showAlert('error', $rootScope.SERVER_ERR);
                    break;

                case 0:
                    $rootScope.showAlert('error', 'Tài khoản hoặc mật khẩu không đúng!');
                    break;

                default:

                    $localStorage.auth = {

                        username: $scope.username,
                        token: res.token

                    };
                    $state.transitionTo('dashboard');

            }


        }, err => {

            console.log(err.status);
            $scope.isAuthenticating = false;


        })

    }

})