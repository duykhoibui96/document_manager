app.controller('employeeInfoCtrl', function($scope, $http, $state, $stateParams, information, $rootScope) {

    $scope.mainInfo = information.data;
    $scope.info = Object.assign({}, $scope.mainInfo, { EmplID: undefined, Name: undefined, Email: undefined });
    $scope.mode = 'info';
    $scope.updateInformation = function() {

        $scope.isLoading = true;
        $http.put('/employee/info', $scope.info).then(function(response) {

            $scope.isLoading = false;
            var res = response.data;

            switch (res.ret) {
                case -1:
                    $rootScope.showAlert('error', $rootScope.SERVER_ERR);
                    break;

                case 0:
                    $rootScope.showAlert('error', $rootScope.DTB_ERR);
                    break;

                default:
                    $rootScope.showAlert('success', $rootScope.UPDATE_SUCCESS);
                    $scope.mainInfo = res.data;

            }

        }, function(err) {

            $scope.isLoading = false;
            console.log(err.status);

        })


    }
    $scope.updatePassword = function() {

        $scope.isLoading = true;
        $http.put('/accounts/info', { Password: $scope.password }).then(function(response) {

            $scope.isLoading = false;
            var res = response.data;

            switch (res.ret) {
                case -1:
                    $rootScope.showAlert('error', $rootScope.SERVER_ERR);
                    break;

                case 0:
                    $rootScope.showAlert('error', $rootScope.DTB_ERR);
                    break;

                default:
                    $rootScope.showAlert('success', $rootScope.UPDATE_SUCCESS);
                    $scope.password = $scope.confirmedPassword = '';

            }

        }, function(err) {

            $scope.isLoading = false;
            console.log(err.status);

        })

    }


});


app.controller('employeeCustomerListCtrl', function($scope) {

    $scope.fields = {

        CustomerID: {

            title: 'Mã khách hàng',
            width: '10%',
            key: true,
            edit: true,
            create: true,
            input: function(data) {
                if (data.record) {
                    return '<input type="text" name="CustomerID" readonly value="' + data.record.CustomerID + '"/>';
                } else {
                    return `<input type="text" name="CustomerID" readonly value="${Date.now()}"/>`;
                }

            }

        },

        Name: {

            title: 'Tên khách hàng',
            width: '20%'


        },
        Address: {

            title: 'Địa chỉ',
            width: '20%'


        },
        Phone: {

            title: 'Số điện thoại',
            width: '10%'


        },
        Representative: {

            title: 'Người đại diện',
            width: '15%'


        },
        ResponsibleEmpl: {

            title: 'Nhân viên quản lý',
            width: '20%',
            display: function(data) {

                console.log(data);
                return `<span>${data.record.ResponsibleEmpl.join()}</span>`;

            }


        }



    }



})