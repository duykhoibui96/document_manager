app.controller('adminEmployeeListCtrl', function($scope, $http, $state, $stateParams, $rootScope) {

    $scope.fields = {

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
    };


});