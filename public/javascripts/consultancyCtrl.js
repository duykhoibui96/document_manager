app.controller('consultancyListCtrl', function ($scope, $state) {

    $scope.title = 'danh sách tư vấn';
    $scope.listActionUrl = '/consultancy';
    $scope.createActionUrl = '/consultancy';
    $scope.updateActionUrl = '/consultancy';
    $scope.deleteActionUrl = '/consultancy';

    $scope.formCreatedCallback = function (event, data) {

        data.form.find('input[name=ConsID]').attr('readonly', true);
        data.form.find('input[name=Time]').datepicker().datepicker('setDate', 'today');

    }

    $scope.select = function(id) {

        $state.transitionTo('consultancy.details',{ ConsID: id });

    }

    $scope.fields = {

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
            width: '20%',
            options: '/employee/options?selected=EmplID%20Name'

        },

        CustomerID: {

            title: 'Khách hàng',
            width: '20%',
            options: '/customer/options?selected=CustomerID%20Name'

        },

        ConsultedEmplID: {

            title: 'Nhân viên được tư vấn',
            width: '20%',
            options: '/employee/options?selected=EmplID%20Name'

        },

        // Document: {

        //     title: 'Tài liệu liên quan',
        //     width: '10%'

        // },

        Time: {

            title: 'Thời gian',
            defaultValue: new Date(),
            display: function(data) {

                return new Date(data.record.Time).toLocaleDateString();

            }

        }


    }

})

app.controller('consultancyDetailsCtrl', function($scope,info,customer,consultingEmpl,consultedEmpl,$rootScope,$localStorage){

    $scope.mainInfo = info.Record;
    $scope.customerName = customer.Record.Name;
    $scope.consultingEmplName = consultingEmpl.Record.Name;
    $scope.consultedEmplName = consultedEmpl.Record.Name;

    console.log($scope.mainInfo);
    $scope.uploadUrl = '/consultancy/file?ConsID=' + $scope.mainInfo.ConsID;
    $scope.listAction = function(postData,params){

        var pageSize = params.jtPageSize;
        var currentPage = params.jtStartIndex;
        return {

            Result: 'OK',
            TotalRecordCount: $scope.mainInfo.Document.length,
            Records:  $scope.mainInfo.Document.slice(currentPage,currentPage + pageSize)

        }

    }

    $scope.deleteAction = function(postData) {

        return $.Deferred(function ($dfd) {
            $.ajax({
                url: '/consultancy?ConsID=' + $scope.mainInfo.ConsID,
                type: 'PUT',
                data: postData,
                dataType: 'json',
                beforeSend: function (request) {
                    request.setRequestHeader('token', $localStorage.auth.token);
                },
                success: function (data) {
                    $scope.mainInfo = data.Record;
                    $dfd.resolve(data);
                },
                error: function () {
                    $dfd.reject();
                }
            });

        });

    }

    $scope.reload = function(records){

        $scope.mainInfo.Document = records;
        $rootScope.$emit('static-jtable-reload');

    }

    $scope.fields = {

        originalname: {

            title: 'Tên tài liệu',
            width: '40%',
            display: function(data) {

                return `<a href="${data.record.path}" download="${data.record.originalname}">${data.record.originalname}</a>`

            }

        },

        size: {

            title: 'Kích cỡ',
            width: '20%',
            display: function(data){

                return data.record.size + ' KB';

            }


        },

        time: {

            title: 'Thời gian',
            width: '40%',
            key: true,
            display: function(data) {

                return new Date(data.record.time).toLocaleString();

            }


        }


    }

})