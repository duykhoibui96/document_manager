app.controller('consultancyListCtrl', function($scope, $http) {

    $scope.fields = {

        ConsultingEmplID: {
            title: 'Nhân viên tư vấn',
            width: '20%'
        },
        CustomerID: {
            title: 'Khách hàng',
            width: '20%'

        },

        ConsultedEmplID: {
            title: 'Nhân viên được tư vấn',
            width: '20%'
        },

        Document: {
            title: 'Tài liệu liên quan',
            width: '20%'
        },

        Time: {
            title: 'Thời gian',
            width: '20%',
            edit: false,
            create: false
        }


    };

})