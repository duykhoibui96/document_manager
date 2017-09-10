app.controller('adminEmployeeListCtrl', function($scope, $http, $state, $stateParams, $rootScope) {

    $scope.fields = {

        EmplID: {
            key: true,
            title: 'Mã nhân viên',
            width: '10%',
            edit: false,
            create: true
        },
        EmplRcd: {

            title: 'Record',
            list: false,
            edit: false

        },
        Name: {
            title: 'Tên nhân viên',
            width: '18%',
            edit: false
        },
        ChildDepartment: {
            title: 'Phòng ban',
            width: '13%',

        },
        OfficerCode: {
            title: 'Chức vụ',
            width: '18%'

        },
        JobTitle: {
            title: 'Công việc',
            width: '23%'

        },
        Mail: {

            title: 'Email',
            edit: false,
            width: '18%'

        }
    };


    $scope.seeDetails = function(id) {

        $state.transitionTo('admin.employee-details', { id: id });

    }


});


app.controller('adminEmployeeDetailsCtrl', function($scope, $http, information) {

    $scope.mainInfo = information.data;

    $scope.listType = 'consulting';

    $scope.types = [

        { display: 'Danh sách tư vấn', value: 'consulting' },
        { display: 'Danh sách được tư vấn', value: 'consulted' },
        { display: 'Danh sách nghiên cứu', value: 'study' },
        { display: 'Danh sách hướng dẫn', value: 'instruct' }


    ]

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


})