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

    $scope.seeDetails = function (id) {

        $state.transitionTo('customer.details', { CustomerID: id });

    }


})

app.controller('customerDetailsCtrl', function ($scope, information) {

    $scope.mainInfo = information.Record;

    $scope.attachedData = {
        
        CustomerID: $scope.mainInfo.CustomerID
        
    };
    $scope.listActionUrl = '/employee/list';
    $scope.createActionUrl = '/customer/add';

    $scope.fields = {

        EmplID: {
            key: true,
            title: 'Mã nhân viên',
            width: '10%',
            edit: false,
            create: true,
            options: function(data) {

                if (data.source == 'list')
                    return [{

                        Value: data.record.EmplID,
                        DisplayText: data.record.EmplID

                    }];

                return '/employee/all-id';

            }
        },
        EmplRcd: {

            title: 'Record',
            list: false,
            edit: false,
            create: false

        },
        Name: {
            title: 'Tên nhân viên',
            width: '18%',
            edit: false,
            create: false
        },
        ChildDepartment: {
            title: 'Phòng ban',
            width: '13%',
            create: false

        },
        OfficerCode: {
            title: 'Chức vụ',
            width: '18%',
            create: false

        },
        JobTitle: {
            title: 'Công việc',
            width: '23%',
            create: false

        },
        Mail: {

            title: 'Email',
            edit: false,
            width: '18%',
            create: false

        }
    };


})