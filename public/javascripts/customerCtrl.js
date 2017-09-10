app.controller('customerListCtrl', function ($scope, $http) {

    $scope.listType = 'all';

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
            edit: false

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
            width: '20%'


        },
        Representative: {

            title: 'Người đại diện',
            width: '20%'


        },
        ResponsibleEmpl: {

            title: 'Nhân viên quản lý',
            width: '10%',
            options:  [

                   { DisplayText: 'OK', Value: 1 }



            ]


        }



    }

    $scope.$watch('listType', function (newValue, oldValue) {

        console.log(newValue);
        angular.forEach($scope.types, function (item) {

            if (item.value === newValue)
                $scope.title = item.display;

        })


    })


})