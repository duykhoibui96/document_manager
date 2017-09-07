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


app.controller('employeeActivityListCtrl', function($scope, $http, $state, $stateParams, $rootScope) {

    $scope.listType = 'consulting';

    $scope.types = [

        { display: 'Danh sách tư vấn', value: 'consulting' },
        { display: 'Danh sách được tư vấn', value: 'consulted' },
        { display: 'Danh sách nghiên cứu', value: 'study' },
        { display: 'Danh sách hướng dẫn', value: 'instruct' }


    ]


    $scope.recentDays = 10;

    /*$scope.fields = {

        _id: {

            list: false,
            edit: false,
            create: false


        },
        EmplID: {
            key: true,
            title: 'Mã nhân viên',
            width: '10%',
            edit: false
        },
        EmplRcd: {

            title: 'Record',
            list: false,
            edit: false

        },
        Name: {
            title: 'Tên nhân viên',
            width: '18%',
        },
        ChildDepartment: {
            title: 'Phòng ban',
            width: '18%',

        },
        OfficerCode: {
            title: 'Chức vụ',
            width: '18%'

        },
        JobTitle: {
            title: 'Công việc',
            width: '18%'

        },
        Mail: {

            title: 'Email',
            edit: false,
            width: '18%',

        }
    };*/

    $scope.fields = [

        {

            CustomerID: {
                title: 'Khách hàng',
                width: '25%'

            },

            ConsultedEmplID: {
                title: 'Nhân viên được tư vấn',
                width: '25%'
            },

            Document: {
                title: 'Tài liệu liên quan',
                width: '25%'
            },

            Time: {
                title: 'Thời gian',
                width: '25%',
                edit: false,
                create: false
            },



        },

        {

            ConsultingEmplID: {
                title: 'Nhân viên tư vấn',
                width: '25%'
            },

            CustomerID: {
                title: 'Khách hàng',
                width: '25%'

            },

            Document: {
                title: 'Tài liệu liên quan',
                width: '25%'
            },

            Time: {
                title: 'Thời gian',
                width: '25%',
                edit: false,
                create: false
            },



        },




    ]

    $scope.$watch('listType', function(newValue, oldValue) {

        console.log(newValue);
        angular.forEach($scope.types, function(item) {

            if (item.value === newValue)
                $scope.title = item.display;

        })


    })


});