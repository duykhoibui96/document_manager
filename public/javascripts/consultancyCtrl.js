app.controller('consultancyListCtrl', function ($scope, $http, $rootScope) {

    $scope.fields = {

        ConsID: {

            key: true,
            title: 'Mã tư vấn',
            width: '10%',
            list: true,
            create: true,
            edit: true,
            input: function(data) {
                if (data.record) {
                    return '<input type="text" name="ConsID" readonly value="' + data.record.ConsID + '"/>';
                } else {
                    return `<input type="text" name="ConsID" readonly value="${Date.now()}"/>`;
                }

            }


        },
        ConsultingEmplID: {
            title: 'Nhân viên tư vấn',
            width: '20%',
            options: '/employee/all-id'
        },
        CustomerID: {
            title: 'Khách hàng',
            width: '20%',
            options: '/customer/all-id'

        },

        ConsultedEmplID: {
            title: 'Nhân viên được tư vấn',
            width: '20%',
            options: '/employee/all-id'
        },

        Document: {
            title: 'Tài liệu liên quan',
            width: '20%'
        },

        Time: {
            title: 'Thời gian',
            width: '10%',
            display: function(data) {

                return new Date(data.record.Time).toLocaleDateString();


            }
        }


    };

    $scope.filter = function(object) {

        console.log(object);
        $rootScope.$emit('filter', object);

    }

})