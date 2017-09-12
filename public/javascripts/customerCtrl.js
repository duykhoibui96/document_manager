app.controller('customerListCtrl', function ($scope, $http, $stateParams, $state, $localStorage) {

    $scope.listType = 'all';
    var EmplID = 'any';
    $scope.isInAdminMode = false;
    console.log($state.current);
    switch ($state.current.name) {
        case 'customer.list':
            EmplID = $localStorage.auth.token;
            break;

        case 'customer.admin-list':
            if ($stateParams.EmplID)
                EmplID = $stateParams.EmplID;
            $scope.createActionUrl = '/customer/add';
            $scope.updateActionUrl = '/customer/update';
            $scope.deleteActionUrl = '/customer/delete';
            $scope.isInAdminMode = true;

    }

    $scope.listActionUrl = '/customer/list/' + EmplID;

    $scope.types = [

        { display: 'Tất cả', value: 'all' },
        { display: 'Khách hàng chưa tư vấn', value: 'not-consulted' },
        { display: 'Khách hàng đã tư vấn', value: 'consulted' },


    ]

    $scope.fields = {

        CustomerID: {

            title: 'Mã khách hàng',
            width: '10%',
            key: true,
            edit: true,
            create: true,
            input: function (data) {
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
            options: '/employee/all-id',
            display: function (data) {

                console.log(data);
                return `<span>${data.record.ResponsibleEmpl.join()}</span>`;

            }


        }



    };

    $scope.$watch('listType', function (newValue, oldValue) {

        console.log(newValue);
        angular.forEach($scope.types, function (item) {

            if (item.value === newValue)
                $scope.title = item.display;

        })


    })


})