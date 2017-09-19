function getQuery(obj) {

    var params = '';

    if (!obj)
        return params;

    params = '?';
    var objKeys = Object.keys(obj);
    objKeys.map(function (key, index) {

        params += `${key}=${obj[key]}`;
        if (index < objKeys.length - 1)
            params += '&';

    })

    return params;

}

app.directive('studyList', function () {

    return {

        restrict: 'EA',
        scope: {

            listData: '=',
            createData: '=',
            updateData: '=',
            deleteData: '=',
            hideColumn: '@',
            creatable: '@',
            updatable: '@',
            deletable: '@',

        },
        templateUrl: 'components/table.component.html',
        controller: function ($scope) {

            $scope.tableName = 'study';
            var url = '/study';
            var isHideColumn = $scope.hideColumn !== undefined;

            $scope.listActionUrl = url + getQuery($scope.listData);
            $scope.createActionUrl = $scope.creatable ? url : undefined;
            $scope.updateActionUrl = $scope.updatable ? url : undefined;
            $scope.deleteActionUrl = $scope.deletable ? url : undefined;

            console.log($scope.listActionUrl);
            console.log($scope.hideColumn);

            $scope.fields = {

                StudyID: {

                    key: true,
                    title: 'Mã nghiên cứu',
                    edit: false,
                    create: true,
                    list: isHideColumn ? $scope.hideColumn.includes('StudyID') : true

                },

                Name: {

                    title: 'Tên nghiên cứu',
                    list: isHideColumn ? !$scope.hideColumn.includes('StudyID') : true

                },

                Content: {

                    title: 'Nội dung',
                    list: isHideColumn ? !$scope.hideColumn.includes('StudyID') : true

                },

                Seminar: {

                    title: 'Hội thảo',
                    options: '/seminar/options?selected=SeminarID%20Name',
                    list: isHideColumn ? !$scope.hideColumn.includes('StudyID') : true

                },

                Time: {

                    title: 'Thời gian',
                    list: isHideColumn ? !$scope.hideColumn.includes('StudyID') : true,
                    display: function (data) {

                        return new Date(data.record.Time).toLocaleDateString();

                    }

                }


            }


        }


    }


})