app.controller('customerListCtrl', function ($scope, $state) {

    $scope.title = 'danh sách khách hàng';
    $scope.listActionUrl = '/customer';
    $scope.createActionUrl = '/customer';
    $scope.updateActionUrl = '/customer';
    $scope.deleteActionUrl = '/customer';

    $scope.formCreatedCallback = function (event, data) {

        data.form.find('input[name=CustomerID]').attr('readonly', true);

    }

    $scope.select = function (id) {

        $state.transitionTo('customer.details', { CustomerID: id });

    }

    $scope.fields = {

        CustomerID: {

            key: true,
            defaultValue: Date.now(),
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
            width: '20%'

        },

        ResponsibleEmpl: {

            title: 'Nhân viên phụ trách',
            width: '10%',
            display: function (data) {

                var display = '<div>';
                var records = data.record.ResponsibleEmpl;
                for (var i = 0; i < records.length; i++)
                    display += `<span>${records[i]}</span>,`;
                display += '</div>';
                return display;

            },
            options: '/employee/options?selected=EmplID%20Name'

        }


    }


})

app.controller('customerDetailsCtrl', function ($scope, info, $state) {

    $scope.mainInfo = info.Record;

    $scope.employeeList = {

        listActionUrl: '/customer?CustomerID=' + $scope.mainInfo.CustomerID,
        createActionUrl: '/customer?CustomerID=' + $scope.mainInfo.CustomerID,
        deleteActionUrl: '/customer?CustomerID=' + $scope.mainInfo.CustomerID,

        select: function (id) {

            console.log(id);
            $state.transitionTo('employee.details', { EmplID: id });

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
            $state.transitionTo('consultancy.details', { ConsID: id });

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