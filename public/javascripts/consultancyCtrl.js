app.controller('consultancyListCtrl', function ($scope, $http, $rootScope, $stateParams, $localStorage, $state) {

    var EmplID = 'any';
    $scope.mode = 'all';
    $scope.isInAdminMode = false;
    console.log($state.current);
    switch ($state.current.name) {
        case 'consultancy.list':
            EmplID = $localStorage.auth.token;
            $scope.mode = $stateParams.mode ? $stateParams.mode : 'consulting';
            break;

        case 'consultancy.admin-list':
            if ($stateParams.EmplID)
                EmplID = $stateParams.EmplID;
            $scope.isInAdminMode = true;

    }

    $scope.listActionUrl = '/consultancy/list/' + EmplID + '/' + $scope.mode;
    $scope.createActionUrl = '/consultancy/add';
    $scope.updateActionUrl = '/consultancy/update';
    $scope.deleteActionUrl = '/consultancy/delete';

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
            options: $scope.mode === 'consulting' ? '/employee/get/' + $localStorage.auth.token : '/employee/all-id'
        },
        CustomerID: {
            title: 'Khách hàng',
            width: '20%',
            options: '/customer/all-id'

        },

        ConsultedEmplID: {
            title: 'Nhân viên được tư vấn',
            width: '20%',
            options: $scope.mode === 'consulted' ? '/employee/get/' + $localStorage.auth.token : '/employee/all-id'
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