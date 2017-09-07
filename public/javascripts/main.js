var app = angular.module('app', ['ngRoute', 'ui.router', 'ngAnimate', 'ngLocationUpdate', 'ngMaterial', 'ngStorage', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.tpls']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {


    $httpProvider.interceptors.push(['$q', '$state', '$localStorage', '$rootScope', function($q, $state, $localStorage, $rootScope) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($localStorage.auth) {
                    config.headers.token = $localStorage.auth.token;
                } else if (config.headers.token)
                    delete config.headers.token;
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $rootScope.showAlert('error', 'Không thể xác thực tài khoản. Vui lòng đăng nhập lại!');
                    $state.transitionTo('login');
                } else if (response.status === -1)
                    $rootScope.showAlert('error', 'Could not connect to server');

                return $q.reject(response);
            }
        };
    }]);

    $urlRouterProvider
        .otherwise('/login');


    $stateProvider
        .state('login', {

            url: '/login',
            reload: true,
            controller: 'loginCtrl',
            templateUrl: 'anonymous/login.html',
            resolve: {

                checkConn: function($http) {

                    return $http.head('/check');

                }


            }


        })
        .state('employee', {

            url: '/employee',
            onEnter: function($rootScope) {

                $rootScope.option = 'employee';
                $rootScope.changeSidebarOptions([

                    { link: 'employee.info', display: 'thông tin cá nhân', isActive: false },
                    // { link: 'employee.all', display: 'danh sách khách hàng', isActive: false },
                    { link: 'employee.list', display: 'danh sách hoạt động', isActive: false }

                ]);

            },
            defaultSubstate: 'employee.info'

        })
        .state('employee.info', {

            url: '/info',
            templateUrl: 'employees/details.html',
            controller: 'employeeInfoCtrl',
            onEnter: function($rootScope) {

                $rootScope.sidebarOptions[0].isActive = true;
                $rootScope.sidebarOptions[1].isActive = false;

            },
            resolve: {

                information: function($http, $stateParams) {

                    var query = '/employee/info';
                    if ($stateParams.id)
                        query += '?id=' + $stateParams.id;
                    return $http.get(query).then(function(response) {

                        return response.data;

                    })

                }

            }


        })
        .state('employee.list', {


            url: '/list',
            templateUrl: 'employees/list.html',
            controller: 'employeeActivityListCtrl',
            onEnter: function($rootScope) {

                $rootScope.sidebarOptions[0].isActive = false;
                $rootScope.sidebarOptions[1].isActive = true;

            }


        })
        .state('customer', {

            url: '/customer',
            onEnter: function($rootScope) {

                $rootScope.sidebarOptions = [];
                $rootScope.option = 'customer';

            },
            defaultSubstate: 'customer.list'


        })
        .state('customer.list', {

            url: '/list',
            templateUrl: 'customer/list.html',
            controller: 'customerListCtrl'



        })
        .state('customer.details', {

            url: '/details',
            templateUrl: 'customer/details.html'



        })
        .state('consultancy', {

            url: '/consultancy',
            onEnter: function($rootScope) {

                $rootScope.sidebarOptions = [];
                $rootScope.option = 'consultancy';

            },
            defaultSubstate: 'consultancy.list'


        })
        .state('consultancy.list', {

            url: '/list',
            templateUrl: 'consultancy/list.html',
            controller: 'consultancyListCtrl'



        })
        .state('consultancy.details', {


            url: '/details',
            templateUrl: 'consultancy/details.html'

        })
        .state('study', {

            url: '/study',
            onEnter: function($rootScope) {

                $rootScope.sidebarOptions = [];
                $rootScope.option = 'study';

            },
            defaultSubstate: 'study.list'


        })
        .state('study.list', {

            url: '/list',
            templateUrl: 'study/list.html',
            controller: 'studyListCtrl'


        })
        .state('study.details', {

            url: '/details',
            templateUrl: 'study/details.html'


        })
        .state('admin', {

            url: '/admin',
            onEnter: function($rootScope) {

                $rootScope.option = 'admin';
                $rootScope.changeSidebarOptions([

                    { link: 'admin.employee-list', display: 'danh sách nhân viên', isActive: false },
                    // { link: 'employee.all', display: 'danh sách khách hàng', isActive: false },

                ]);


            },

            defaultSubstate: 'admin.employee-list'


        })
        .state('admin.employee-list', {

            url: '/employe-list',
            templateUrl: 'admin/employee_list.html',
            controller: 'adminEmployeeListCtrl',
            onEnter: function($rootScope) {

                $rootScope.sidebarOptions[0].isActive = true;

            }


        })
        .state('500', {

            url: '/500',
            template: '<span>Oops! The server is stopped or your connection is broken. Try again later!</span>',
            onEnter: function($rootScope) {

                angular.element('footer, header').hide();
                angular.element('#content').removeClass('content');

            }


        });


});

app.run(function($rootScope, $timeout, $mdDialog, $localStorage, $transitions, $timeout, $state) {

    $rootScope.isLoading = false;
    $transitions.onStart({}, function(trans) {

        console.log('On start');
        if (trans._targetState._identifier === '500')
            return true;

        $rootScope.startLoading();
        var substate = trans.to().defaultSubstate;
        if (substate)
            return trans.router.stateService.target(substate);
        console.log('Substate undetected');
        return true;

    })

    $transitions.onBefore({

        to: function(state) { return state.name !== 'login' && state.name !== '500'; }

    }, function(trans) {

        sidebar.addClass('small');
        if ($localStorage.auth)
            return true;
        return trans.router.stateService.target('login');

    });



    $transitions.onBefore({ to: 'login' }, function(trans) {

        console.log('On before');
        if ($localStorage.auth)
            return trans.router.stateService.target('employee');
        return true;


    })

    $transitions.onSuccess({}, function(trans) {

        console.log('On success');
        $rootScope.stopLoading();
        document.body.scrollTop = 0;
        return true;

    })

    $transitions.onError({}, function(trans) {

        console.log('On error');
        console.log(trans._error);

        if (trans._error.type === 5) {
            $state.reload();
            /*$rootScope.showConfirm('Back to login page - Continue?', function(isContinue){

                if (isContinue)
                    $rootScope.logout();
                else
                    $state.reload();

            })*/

        } else if (!trans._error.redirected) {


            $rootScope.stopLoading();

        }

        return true;

    })

    $rootScope.SERVER_ERR = 'Lỗi server, vui lòng thử lại sau!';
    $rootScope.DTB_ERR = 'Lỗi trong cơ sở dữ liệu, vui lòng thử lại sau!';
    $rootScope.UPDATE_SUCCESS = 'Cập nhật thành công';

    $rootScope.ceil = function(number) {

        console.log('Hello ' + number);
        return Math.ceil(number);

    }


    $rootScope.logout = function() {

        if ($localStorage.auth)
            delete $localStorage.auth;
        $state.transitionTo('login');

    }


    $rootScope.startLoading = function() {

        $rootScope.isLoading = true;
        console.log('Start loading');

    }

    $rootScope.stopLoading = function() {

        $timeout(function() {

            $rootScope.isLoading = false;
            console.log('Stop loading');


        }, 1000);


    }

    //  var sidebarContainer = angular.element('.sidebar-container');
    var sidebar = angular.element('.sidebar-container .sidebar');
    var sidebarContent = angular.element('.sidebar .sidebar-content');

    /*$rootScope.setActive = function(link) {

        angular.forEach($rootScope.sidebarOptions, function(curItem) {

            if (link === curItem.link)
                curItem.isActive = true;
            else
                curItem.isActive = false;

        });


    }*/

    $rootScope.isAuthenticated = function() { return $localStorage.auth; }

    $rootScope.getUsername = function() {

        if ($localStorage.auth)
            return $localStorage.auth.username;
        return null;

    }

    $rootScope.changeSidebarOptions = function(object) {

        $rootScope.sidebarOptions = object;
        sidebar.addClass('small');

    }


    $rootScope.toggleSidebar = function() {

        // if (sidebar.hasClass('small'))
        //     $timeout(function() {

        //         sidebarContent.fadeIn();

        //     }, 200);
        // else
        //     sidebarContent.hide();


        // sidebarContainer.toggleClass('col-sm-1');
        sidebar.toggleClass('small');


    }

    $rootScope.showAlert = function(type, content) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog

        var title = type === 'error' ? 'Lỗi' : 'Thành công';

        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(content)
            .ariaLabel(type)
            .ok('OK!')
        );
    };

    $rootScope.showConfirm = function(question, callback) {

        var confirm = $mdDialog.confirm()
            .title('Are you sure?')
            .textContent(question)
            .parent(angular.element(document.body))
            .ariaLabel('Confirm')
            .ok('YES')
            .cancel('NO');

        $mdDialog.show(confirm).then(function() {

            callback(true);

        }, function() {

            callback(false);

        });
    };
});

app.directive('routerSection', function($rootScope) {
    return {
        restrict: 'A'
    };
});

app.directive('filterBox', function() {

    return {

        restrict: 'EA',
        scope: true,
        templateUrl: 'components/filter-box.component.html'



    }


})

app.directive('appTable', function() {

    return {

        restrict: 'EA',
        scope: {

            rows: '=',
            displayColumns: '=',
            isReadOnly: '=',
            maxSize: '=',
            itemClick: '&',
            deleteItem: '&',
            deleteItems: '&'

        },
        templateUrl: 'components/table.component.html',
        link: function(scope, element, attrs) {

            scope.mode = 'VIEW';
            scope.currentPage = 1;

            scope.getNumberOfEmptyRows = function(filtered) {

                if (!filtered || filtered.length === 0)
                    return 10;
                var number = scope.maxSize - filtered.length;
                var res = [];
                for (var i = 0; i < number; i++)
                    res.push(i);
                return res;

            }


        }


    }


})

app.directive('jtable', function($localStorage, $http) {


    return {

        restrict: 'EA',
        scope: {

            jtableId: '@',
            listActionUrl: '@',
            createActionUrl: '@',
            updateActionUrl: '@',
            deleteActionUrl: '@',
            fields: '=',
            title: '@',
            instantLoad: '='

        },
        template: `<div id="{{jtableId}}"></div>`,
        link: function(scope, element) {

            var selector = '#' + scope.jtableId;

            $(document).ready(function() {
                $(selector).jtable({
                    title: scope.title,
                    paging: true, //Enable paging
                    pageSize: 20, //Set page size (default: 10)
                    actions: {
                        listAction: function(postData, params) {

                            return $.Deferred(function($dfd) {

                                $http.get(scope.listActionUrl + `?currentPage=${params.jtStartIndex}&maxSize=${params.jtPageSize}`).then(function(response) {

                                    $dfd.resolve(response.data);


                                }, function(err) {

                                    $dfd.reject();

                                });

                            });


                        },
                        createAction: '/employee/add',
                        updateAction: 'Controller?action=update',
                        deleteAction: 'Controller?action=delete'
                    },
                    fields: scope.fields
                });

                if (scope.instantLoad)
                    $(selector).jtable('load');
            });


        }



    }



})

app.directive('compareTo', function() {

    return {
        require: "ngModel",
        scope: {
            compareTolValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {

                return modelValue === scope.compareTolValue;
            };

            scope.$watch("compareTolValue", function() {
                ngModel.$validate();
            });
        }
    };


})