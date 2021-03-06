app.controller('consultancyListCtrl', function ($scope, $state, $rootScope) {

    $scope.title = 'danh sách tư vấn';
    $scope.listActionUrl = '/consultancy';
    $scope.createActionUrl = '/consultancy';
    $scope.updateActionUrl = '/consultancy';
    $scope.deleteActionUrl = '/consultancy';

    $scope.filterType = 2;

    $scope.search = function (dateRange) {

        $rootScope.$emit('filtering', dateRange);

    }

    $scope.formCreatedCallback = function (event, data) {

        data.form.find('input[name=ConsID]').attr('readonly', true);
        data.form.find('input[name=Time]').datepicker({
            dateFormat: 'dd-mm-yy'
        });
        console.log(data);
        if (data.formType === 'create'){

            data.form.find('input[name=ConsID]').val(Date.now());
            data.form.find('input[name=Time]').datepicker('setDate','today');

        }
            

    }

    $scope.select = function (id) {

        $state.transitionTo('consultancy.details', {
            ConsID: id
        });

    }

    $scope.fields = {

        ConsID: {

            title: 'Mã tư vấn',
            key: true,
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

            title: 'Thời gian'

        }


    }

})

app.controller('consultancyDetailsCtrl', function ($scope, info, customerList, employeeList, $rootScope, $localStorage, $http) {

    $scope.isLoading = false;
    $scope.mainInfo = info.Record;
    $scope.mainInfo.Time = new Date($scope.mainInfo.Time).toLocaleDateString();

    $scope.info = {};

    Object.keys($scope.mainInfo).map(function (key, index) {

        if (key !== 'ConsID' && key !== 'Document') {
            if (key !== 'Time')
                $scope.info[key] = $scope.mainInfo[key].toString();
            else
                $scope.info[key] = $scope.mainInfo[key]
        }

    });

    console.log($scope.info);

    $scope.cusList = customerList.Options;
    $scope.empList = employeeList.Options;

    $scope.update = function (){

        $scope.isLoading = true;
        $http.put('/consultancy?ConsID=' + $scope.mainInfo.ConsID, $scope.info).then(function (response) {

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

    $scope.mainInfo.Document.sort(function (docA, docB) {

        return docA.time - docB.time;

    })

    $scope.search = function (dateRange) {

        $rootScope.$emit('filtering', dateRange);

    }

    $scope.uploadUrl = '/consultancy/file?ConsID=' + $scope.mainInfo.ConsID;
    $scope.listAction = function (postData, params) {

        var pageSize = params.jtPageSize;
        var currentPage = params.jtStartIndex;

        var docs = $scope.mainInfo.Document.slice();

        if (postData) {
            var start = new Date(postData.startDate);
            var end = new Date(postData.endDate);
            console.log(postData);

            docs = docs.filter(function (obj) {

                var time = new Date(obj.time);
                return start <= time && time <= end;

            })
        }

        return {

            Result: 'OK',
            TotalRecordCount: docs.length,
            Records: docs.slice(currentPage, currentPage + pageSize)

        }

    }

    $scope.deleteAction = function (postData) {

        for (var i = 0; i < $scope.mainInfo.Document.length; i++)
            if (postData.time === $scope.mainInfo.Document[i].time) {
                postData.path = $scope.mainInfo.Document[i].path;
                break;
            }

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
                    $scope.mainInfo.Document.sort(function (docA, docB) {

                        return docA.time - docB.time;

                    })
                    $dfd.resolve(data);
                },
                error: function () {
                    $dfd.reject();
                }
            });

        });

    }

    $scope.reload = function (records) {

        $scope.mainInfo.Document = records;
        $rootScope.$emit('static-jtable-reload');

    }

    $scope.fields = {

        originalname: {

            title: 'Tên tài liệu',
            width: '40%',
            display: function (data) {

                return `<a href="${data.record.path}" download="${data.record.originalname}">${data.record.originalname}</a>`

            }

        },

        size: {

            title: 'Kích cỡ',
            width: '20%',
            display: function (data) {

                return data.record.size + ' KB';

            }


        },

        time: {

            title: 'Thời gian',
            width: '40%',
            key: true,
            display: function (data) {

                return new Date(data.record.time).toLocaleString();

            }


        }


    }

})