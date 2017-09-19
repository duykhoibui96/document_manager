app.controller('customerListCtrl', function ($scope, $state, $rootScope) {

    $scope.title = 'danh sách khách hàng';
    $scope.listActionUrl = '/customer';
    $scope.createActionUrl = '/customer';
    $scope.updateActionUrl = '/customer';
    $scope.deleteActionUrl = '/customer';

    $scope.filterType = 1;

    $scope.selectedCat = 'CustomerID';
    $scope.searchCat = [

        {
            value: 'CustomerID',
            name: 'Mã khách hàng'
        },

        {
            value: 'Name',
            name: 'Tên khách hàng'
        }

    ]

    $scope.search = function () {

        $rootScope.$emit('filtering', {

            searchText: this.searchText,
            selectedCat: this.selectedCat

        })

    }

    $scope.formCreatedCallback = function (event, data) {

        data.form.find('input[name=CustomerID]').attr('readonly', true);
       // data.form.find('select[name=ResponsibleEmpl]').attr('multiple', 'multiple');
        if (data.formType === 'create')
            data.form.find('input[name=CustomerID]').val(Date.now());

    }

    $scope.select = function (id) {

        $state.transitionTo('customer.details', {
            CustomerID: id
        });

    }

    $scope.fields = {

        CustomerID: {

            key: true,
            edit: false,
            create: true,
            title: 'Mã khách hàng',
            width: '10%'


        },

        Name: {

            title: 'Tên',
            width: '20%'

        },

        Address: {

            title: 'Địa chỉ',
            width: '20%'

        },

        Phone: {

            title: 'Điện thoại',
            width: '20%'

        },

        Representative: {

            title: 'Đại diện',
            width: '30%',
            options: '/employee/options?selected=EmplID%20Name'

        }

        // ResponsibleEmpl: {

        //     title: 'Nhân viên phụ trách',
        //     // width: '10%',
        //     list: false,
        //     // display: function (data) {

        //     //     var display = '<div>';
        //     //     var records = data.record.ResponsibleEmpl;
        //     //     for (var i = 0; i < records.length; i++)
        //     //         display += `<span>${records[i]}</span>,`;
        //     //     display += '</div>';
        //     //     return display;

        //     // },
        //     options: '/employee/options?selected=EmplID%20Name'

        // }


    }


})

app.controller('customerDetailsCtrl', function ($scope, info, $state, $http, $rootScope, employeeList) {

    $scope.isLoading = false;

    $scope.emplList = employeeList.Options;
    $scope.mainInfo = info.Record;
    $scope.info = Object.assign({}, $scope.mainInfo, {
        CustomerID: undefined
    });
    $scope.mode = 'info';

    $scope.info.Representative = $scope.info.Representative.toString();

    $scope.update = function () {

        $scope.isLoading = true;
        $http.put('/customer?CustomerID=' + $scope.mainInfo.CustomerID, $scope.info).then(function (response) {

            $scope.isLoading = false;
            var res = response.data;
            if (res.Result === 'ERROR')
                $rootScope.showAlert('error', res.Message);
            else {
                $rootScope.showAlert('success', 'Cập nhật dữ liệu thành công');
                $scope.mainInfo = res.Record;
            }


        }, function (err) {

            console.log(err);
            $scope.isLoading = false;

        })

    }

    $scope.employeeList = {

        listActionUrl: '/customer?CustomerID=' + $scope.mainInfo.CustomerID,
        createActionUrl: '/customer?CustomerID=' + $scope.mainInfo.CustomerID,
        deleteActionUrl: '/customer?CustomerID=' + $scope.mainInfo.CustomerID,

        select: function (id) {

            console.log(id);
            $state.transitionTo('employee.details', {
                EmplID: id
            });

        },


        fields: {

            EmplID: {

                title: 'Nhân viên',
                key: true,
                create: true,
                options: '/employee/options?selected=EmplID%20Name',
                edit: false,
                width: '30%'

            },

            EmplRcd: {

                title: 'Record',
                width: '5%',
                edit: false,
                create: false

            },

            // Name: {

            //     title: 'Tên',
            //     width: '20%',
            //     edit: false,
            //     create: false

            // },

            ChildDepartment: {

                title: 'Phòng ban',
                width: '15%',
                edit: false,
                create: false

            },

            OfficerCode: {

                title: 'Chức vụ',
                width: '15%',
                edit: false,
                create: false

            },

            JobTitle: {

                title: 'Công việc',
                width: '15%',
                edit: false,
                create: false

            },

            Mail: {

                title: 'Email',
                width: '20%',
                edit: false,
                create: false

            }

        }

    };

    $scope.consultancyList = {

        listActionUrl: '/consultancy?CustomerID=' + $scope.mainInfo.CustomerID,
        // createActionUrl: '/consultancy',
        // deleteActionUrl: '/consultancy',

        formCreatedCallback: function (event, data) {

            data.form.find('input[name=ConsID]').attr('readonly', true);
            data.form.find('input[name=Time]').datepicker().datepicker('setDate', 'today');

        },

        select: function (id) {

            console.log('consultancy ' + id);
            $state.transitionTo('consultancy.details', {
                ConsID: id
            });

        },

        fields: {

            ConsID: {

                title: 'Mã tư vấn',
                key: true,
                defaultValue: Date.now(),
                edit: false,
                create: true,
                width: '10%'


            },

            ConsultingEmplID: {

                title: 'Nhân viên tư vấn',
                width: '30%',
                options: '/employee/options?selected=EmplID%20Name'

            },

            CustomerID: {

                title: 'Khách hàng',
                edit: false,
                create: true,
                list: false,
                options: [

                    {
                        Value: $scope.mainInfo.CustomerID,
                        DisplayText: `${$scope.mainInfo.CustomerID} - ${$scope.mainInfo.Name}`
                    }

                ]

            },

            ConsultedEmplID: {

                title: 'Nhân viên được tư vấn',
                width: '30%',
                options: '/employee/options?selected=EmplID%20Name'

            },

            // Document: {

            //     title: 'Tài liệu liên quan',
            //     width: '20%'

            // },

            Time: {

                title: 'Thời gian',
                width: '10%',
                defaultValue: new Date(),
                display: function (data) {

                    return new Date(data.record.Time).toLocaleDateString();

                }

            }


        }

    };


});