app.controller('seminarListCtrl', function ($scope, $rootScope) {

    $scope.title = 'danh sách hội thảo';
    $scope.filterType = 2;

    $scope.search = function (dateRange) {

        $rootScope.$emit('filtering', dateRange);

    }



    $scope.listActionUrl = '/seminar';
    $scope.createActionUrl = '/seminar';
    $scope.updateActionUrl = '/seminar';
    $scope.deleteActionUrl = '/seminar';

    $scope.formCreatedCallback = function (event, data) {

        data.form.find('input[name=Time]').datepicker({dateFormat: 'dd-mm-yy'});
        var id = data.form.find('input[name=SeminarID]');
        if (data.formType === 'create'){

            id.val(Date.now());
            data.form.find('input[name=Time]').datepicker('setDate','today');

        }
            
        id.attr('readonly',true);

        

    }

    $scope.fields = {

        SeminarID: {

            key: true,
            title: 'Mã hội thảo',
            edit: false,
            create: true,

        },

        Name: {

            title: 'Tên hội thảo'

        },

        Content: {

            title: 'Nội dung hội thảo'

        },

        SharingEmpl: {

            title: 'Người chia sẻ',
            options: '/employee/options?selected=EmplID%20Name'

        },

        OrganizationalUnit: {

            title: 'Đơn vị tổ chức'

        },

        Time: {

            title: 'Thời gian'

        }


    }

})