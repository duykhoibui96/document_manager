app.controller('employeeListCtrl', function ($scope, $state, $rootScope) {

    $scope.title = 'danh sách nhân viên';
    $scope.listActionUrl = '/employee';
    $scope.createActionUrl = '/employee';
    $scope.updateActionUrl = '/employee';
    $scope.deleteActionUrl = '/employee';

    $scope.filterType = 1;

    $scope.selectedCat = 'EmplID';
    $scope.searchCat = [

        {
            value: 'EmplID',
            name: 'Mã nhân viên'
        },

        {
            value: 'Name',
            name: 'Tên nhân viên'
        }

    ]
    $scope.search = function() {

        $rootScope.$emit('filtering', {

            searchText: $scope.searchText,
            selectedCat: $scope.selectedCat

        })

    }

    $scope.formCreatedCallback = function (event, data) {

        console.log('Form created');
        data.form.find('input[name=EmplID]').attr('readonly', true);
        data.form.find('input[name=EmplID]').val(Date.now());

    }

    $scope.select = function (id) {

        $state.transitionTo('employee.details', {
            EmplID: id
        });

    }

    $scope.fields = {

        EmplID: {

            title: 'Mã nhân viên',
            key: true,
            create: true,
            edit: false,
            width: '10%'

        },

        EmplRcd: {

            title: 'Record',
            width: '5%'

        },

        Name: {

            title: 'Tên',
            width: '20%'

        },

        ChildDepartment: {

            title: 'Phòng ban',
            width: '15%'

        },

        OfficerCode: {

            title: 'Chức vụ',
            width: '15%'

        },

        JobTitle: {

            title: 'Công việc',
            width: '15%'

        },

        Mail: {

            title: 'Email',
            edit: false,
            width: '20%'

        }



    }

})

app.controller('employeeDetailsCtrl', function ($scope, info, $state, representativeName) {

    $scope.mainInfo = info.Record;
    $scope.isLoading = false;

    $scope.mode = 'info';
    $scope.info = Object.assign({}, $scope.mainInfo, {
        EmplID: undefined,
        Mail: undefined
    });
    $scope.isCurrentEmployee = function () {

        return $state.current.name === 'info';

    }

    $scope.updateInformation = function () {

        $scope.isLoading = true;
        var url = $state.current.name === 'info' ? '/employee' : '/employee?EmplID=' + $scope.mainInfo.EmplID;
        $http.put(url).then(function (response) {

            $scope.isLoading = false;
            var res = response.data;
            if (res.Result === 'ERROR')
                $rootScope.showAlert('error', res.Message);
            else {
                $rootScope.showAlert('success', 'Cập nhật dữ liệu thành công');
                $scope.mainInfo = res.Record;
            }


        }, function (err) {

            console.log(err.status);
            $scope.isLoading = false;

        })

    }

    $scope.updatePassword = function () {

        $scope.isLoading = true;
        $http.put('/account', {
            Password: $scope.password
        }).then(function (response) {

            $scope.isLoading = false;
            var res = response.data;
            if (res.Result === 'ERROR')
                $rootScope.showAlert('error', res.Message);
            else
                $rootScope.showAlert('success', 'Cập nhật dữ liệu thành công');


        }, function (err) {

            console.log(err.status);
            $scope.isLoading = false;

        })


    }


    $scope.customerList = {

        listActionUrl: '/customer?EmplID=' + $scope.mainInfo.EmplID,
        createActionUrl: '/customer?EmplID=' + $scope.mainInfo.EmplID,
        deleteActionUrl: '/customer?EmplID=' + $scope.mainInfo.EmplID,

        select: function (id) {

            console.log(id);
            $state.transitionTo('customer.details', {
                CustomerID: id
            });

        },

        fields: {

            CustomerID: {

                key: true,
                defaultValue: Date.now(),
                edit: false,
                create: true,
                title: 'Khách hàng',
                width: '40%',
                options: '/customer/options?selected=CustomerID%20Name'


            },

            Address: {

                title: 'Địa chỉ',
                width: '20%',
                edit: false,
                create: false,

            },

            Phone: {

                title: 'Điện thoại',
                width: '20%',
                edit: false,
                create: false,

            },

            Representative: {

                title: 'Đại diện',
                width: '20%',
                edit: false,
                create: false,

            },

            ResponsibleEmpl: {

                title: 'Nhân viên phụ trách',
                // width: '10%',
                list: false,
                edit: false,
                create: false,
                // display: function (data) {

                //     var display = '<div>';
                //     var records = data.record.ResponsibleEmpl;
                //     for (var i = 0; i < records.length; i++)
                //         display += `<span>${records[i]}</span>,`;
                //     display += '</div>';
                //     return display;

                // },
                options: '/employee/options?selected=EmplID%20Name'

            }

        }


    }

    $scope.consultingList = {

        listActionUrl: '/consultancy?ConsultingEmplID=' + $scope.mainInfo.EmplID,
        // createActionUrl: '/consultancy',
        // deleteActionUrl: '/consultancy',

        formCreatedCallback: function (event, data) {

            data.form.find('input[name=ConsID]').attr('readonly', true);
            data.form.find('input[name=Time]').datepicker().datepicker('setDate', 'today');

        },

        select: function (id) {

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
                list: false,
                options: [

                    {
                        Value: $scope.mainInfo.EmplID,
                        DisplayText: `${$scope.mainInfo.EmplID} - ${$scope.mainInfo.Name}`
                    }

                ]

            },

            CustomerID: {

                title: 'Khách hàng',
                width: '30%',
                edit: false,
                create: true,
                options: '/customer/options?selected=CustomerID%20Name'

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

    }

    $scope.consultedList = {

        listActionUrl: '/consultancy?ConsultedEmplID=' + $scope.mainInfo.EmplID,
        // createActionUrl: '/consultancy',
        // deleteActionUrl: '/consultancy',

        formCreatedCallback: function (event, data) {

            data.form.find('input[name=ConsID]').attr('readonly', true);
            data.form.find('input[name=Time]').datepicker().datepicker('setDate', 'today');

        },

        select: function (id) {

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
                width: '30%',
                edit: false,
                create: true,
                options: '/customer/options?selected=CustomerID%20Name'

            },

            ConsultedEmplID: {

                title: 'Nhân viên được tư vấn',
                list: false,

                options: [

                    {
                        Value: $scope.mainInfo.EmplID,
                        DisplayText: `${$scope.mainInfo.EmplID} - ${$scope.mainInfo.Name}`
                    }

                ]

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

    }

})