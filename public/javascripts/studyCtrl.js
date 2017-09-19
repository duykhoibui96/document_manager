app.controller('studyListCtrl', function ($scope, $state, $rootScope) {

    $scope.title = 'danh sách nghiên cứu';
    $scope.filterType = 2;

    $scope.search = function (dateRange) {

        $rootScope.$emit('filtering', dateRange);

    }



    $scope.listActionUrl = '/study';
    $scope.createActionUrl = '/study';
    $scope.updateActionUrl = '/study';
    $scope.deleteActionUrl = '/study';

    $scope.select = function (id) {

        $state.transitionTo('study.details', {
            StudyID: id
        });

    }

    $scope.formCreatedCallback = function (event, data) {

        data.form.find('input[name=Time]').datepicker({
            dateFormat: 'dd-mm-yy'
        });
        var id = data.form.find('input[name=StudyID]');
        if (data.formType === 'create'){

            data.form.find('input[name=Time]').datepicker('setDate','today');
            id.val(Date.now());
        }
        id.attr('readonly', true);

        

        // data.form.find('select[name=StudyEmpl]').attr('multiple', true);
        // data.form.find('select[name=Instructor]').attr('multiple', true);

    }

    $scope.fields = {

        StudyID: {

            key: true,
            title: 'Mã nghiên cứu',
            edit: false,
            create: true,

        },

        Name: {

            title: 'Tên nghiên cứu'

        },

        Content: {

            title: 'Nội dung nghiên cứu'

        },

        Seminar: {

            title: 'Hội thảo liên quan',
            options: '/seminar/options?selected=SeminarID%20Name'

        },

        // StudyEmpl: {

        //     title: 'Nhân viên nghiên cứu',
        //     list: false,
        //     options: '/employee/options?selected=EmplID%20Name'

        // },

        // Instructor: {

        //     title: 'Người hướng dẫn',
        //     list: false,
        //     options: '/employee/options?selected=EmplID%20Name'

        // },

        Time: {

            title: 'Thời gian'

        }


    }

})

app.controller('studyDetailsCtrl', function ($scope, info, $http, $rootScope, seminarList, $localStorage) {

    $scope.mode = 'info';
    $scope.isLoading = false;
    $scope.mainInfo = info.Record;
    $scope.mainInfo.Time = new Date($scope.mainInfo.Time).toLocaleDateString();
    $scope.semList = seminarList.Options;
    $scope.info = {};

    Object.keys($scope.mainInfo).map(function (key, index) {

        if (key !== 'StudyID' && key !== 'Document' && key !== 'Instructor' && key !== 'StudyEmpl') {
            if (key !== 'Time')
                $scope.info[key] = $scope.mainInfo[key].toString();
            else
                $scope.info[key] = $scope.mainInfo[key]
        }

    });

    $scope.update = function () {

        $scope.isLoading = true;
        $http.put('/study?StudyID=' + $scope.mainInfo.StudyID, $scope.info).then(function (response) {

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

    $scope.uploadUrl = '/study/file?StudyID=' + $scope.mainInfo.StudyID;
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
                url: '/study?StudyID=' + $scope.mainInfo.StudyID,
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

                return new Date(Number(data.record.time)).toLocaleString();

            }


        }


    }


    $scope.studyEmployeeList = {

        listActionUrl: '/employee?Type=Study&StudyID=' + $scope.mainInfo.StudyID,
        createActionUrl: '/employee?Type=Study&StudyID=' + $scope.mainInfo.StudyID,
        deleteActionUrl: '/employee?Type=Study&StudyID=' + $scope.mainInfo.StudyID,

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


    }

    $scope.instructEmployeeList = {

        listActionUrl: '/employee?Type=Instruct&StudyID=' + $scope.mainInfo.StudyID,
        createActionUrl: '/employee?Type=Instruct&StudyID=' + $scope.mainInfo.StudyID,
        deleteActionUrl: '/employee?Type=Instruct&StudyID=' + $scope.mainInfo.StudyID,

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


    }

})