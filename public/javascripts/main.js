var app = angular.module('app', ['ngRoute', 'ui.router', 'ngAnimate', 'ngMaterial', 'ngStorage', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.tpls']);

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {


    $httpProvider.interceptors.push(['$q', '$state', '$localStorage', '$rootScope', function ($q, $state, $localStorage, $rootScope) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.auth) {
                    config.headers.token = $localStorage.auth.token;
                } else if (config.headers.token)
                    delete config.headers.token;
                return config;
            },
            'responseError': function (response) {
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
        .otherwise('/dashboard');


    $stateProvider
        .state('login', {

            url: '/login',
            reload: true,
            controller: 'loginCtrl',
            templateUrl: 'anonymous/login.html',
            resolve: {

                checkConn: function ($http) {

                    return $http.head('/check');

                }


            }


        })
        .state('dashboard', {

            url: '/dashboard',
            templateUrl: 'dashboard.html',
            onEnter: function ($rootScope) {

                $rootScope.option = 'dashboard';
                //$rootScope.changeSidebarOptions([]);

            }


        })
        .state('employee', {

            url: '/employee',
            defaultSubstate: 'employee.list',
            onEnter: function ($rootScope) {

                $rootScope.option = 'employee';

            }


        })
        .state('employee.list', {

            url: '/list',
            templateUrl: 'common/list.html',
            controller: 'employeeListCtrl'

        })
        .state('employee.details', {

            url: '/details/:EmplID',
            templateUrl: 'employee/details.html',
            controller: 'employeeDetailsCtrl',
            resolve: {

                info: function ($http, $stateParams) {

                    var id = $stateParams.EmplID;
                    return $http.get('/employee/details/' + id).then(function (response) {

                        return response.data;

                    })


                }

            }


        })
        .state('customer', {

            url: '/customer',
            defaultSubstate: 'customer.list',
            onEnter: function ($rootScope) {

                $rootScope.option = 'customer';

            }


        })
        .state('customer.list', {

            url: '/list',
            templateUrl: 'common/list.html',
            controller: 'customerListCtrl'

        })
        .state('customer.details', {

            url: '/details/:CustomerID',
            templateUrl: 'customer/details.html',
            controller: 'customerDetailsCtrl',
            resolve: {

                info: function ($http, $stateParams) {

                    var id = $stateParams.CustomerID;
                    return $http.get('/customer/details/' + id).then(function (response) {

                        return response.data;

                    })


                }

            }


        })
        .state('consultancy', {

            url: '/consultancy',
            defaultSubstate: 'consultancy.list',
            onEnter: function ($rootScope) {

                $rootScope.option = 'consultancy';

            }


        })
        .state('consultancy.list', {

            url: '/list',
            templateUrl: 'common/list.html',
            controller: 'consultancyListCtrl'

        })
        .state('consultancy.details', {

            url: '/details/:ConsID',
            templateUrl: 'consultancy/details.html',
            controller: 'consultancyDetailsCtrl',
            resolve: {

                info: function ($http, $stateParams) {

                    var id = $stateParams.ConsID;
                    return $http.get('/consultancy/details/' + id).then(function (response) {

                        return response.data;

                    })


                },

                customer: function ($http, info) {

                    var id = info.Record.CustomerID;

                    return $http.get('/customer/details/' + id).then(function (response) {

                        return response.data;

                    })


                },

                consultingEmpl: function ($http, info) {

                    var id = info.Record.ConsultingEmplID;

                    return $http.get('/employee/details/' + id).then(function (response) {

                        return response.data;

                    })


                },

                consultedEmpl: function ($http, info) {

                    var id = info.Record.ConsultedEmplID;

                    return $http.get('/employee/details/' + id).then(function (response) {

                        return response.data;

                    })


                }

            }


        })
        .state('info', {

            url: '/info',
            templateUrl: 'employee/current_details.html',
            controller: 'employeeDetailsCtrl',
            onEnter: function ($rootScope) {

                $rootScope.option = 'info';

            },
            resolve: {

                info: function ($http, $localStorage) {

                    var id = $localStorage.auth.token;
                    return $http.get('/employee/details/' + id).then(function (response) {

                        return response.data;

                    })


                }

            }

        });

});

app.run(function ($rootScope, $timeout, $mdDialog, $localStorage, $transitions, $timeout, $state, $window) {

    $rootScope.isLoading = false;
    $transitions.onStart({}, function (trans) {

        console.log('On start');
        if (trans._targetState._identifier === '500')
            return true;

        $rootScope.startLoading();
        var substate = trans.to().defaultSubstate;
        if (substate)
            return trans.router.stateService.target(substate);
        return true;

    })

    $transitions.onBefore({

        to: function (state) { return state.name !== 'login' && state.name !== '500'; }

    }, function (trans) {

        // sidebar.addClass('small');
        if ($localStorage.auth)
            return true;
        return trans.router.stateService.target('login');

    });



    $transitions.onBefore({ to: 'login' }, function (trans) {

        console.log('On before');

        if ($localStorage.auth)
            return trans.router.stateService.target('dashboard');
        return true;


    })

    $transitions.onSuccess({}, function (trans) {

        console.log('On success');
        $window.scrollTo(0, 0);
        $rootScope.stopLoading();
        return true;

    })

    $transitions.onError({}, function (trans) {

        console.log('On error');

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

    $rootScope.isAdmin = true;
    $rootScope.SERVER_ERR = 'Lỗi server, vui lòng thử lại sau!';
    $rootScope.DTB_ERR = 'Lỗi trong cơ sở dữ liệu, vui lòng thử lại sau!';
    $rootScope.UPDATE_SUCCESS = 'Cập nhật thành công';

    $rootScope.logout = function () {

        if ($localStorage.auth)
            delete $localStorage.auth;
        $state.transitionTo('login');

    }


    $rootScope.startLoading = function () {

        $rootScope.isLoading = true;
        console.log('Start loading');

    }

    $rootScope.stopLoading = function () {

        $timeout(function () {

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

    $rootScope.isAuthenticated = function () { return $localStorage.auth; }

    $rootScope.getUsername = function () {

        if ($localStorage.auth)
            return $localStorage.auth.username;
        return null;

    }

    $rootScope.changeSidebarOptions = function (object) {

        $rootScope.sidebarOptions = object;
        sidebar.addClass('small');

    }


    $rootScope.toggleSidebar = function () {

        // if (sidebar.hasClass('small'))
        //     $timeout(function() {

        //         sidebarContent.fadeIn();

        //     }, 200);
        // else
        //     sidebarContent.hide();


        // sidebarContainer.toggleClass('col-sm-1');
        sidebar.toggleClass('small');


    }

    $rootScope.showAlert = function (type, content) {
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

    $rootScope.showConfirm = function (question, callback) {

        var confirm = $mdDialog.confirm()
            .title('Are you sure?')
            .textContent(question)
            .parent(angular.element(document.body))
            .ariaLabel('Confirm')
            .ok('YES')
            .cancel('NO');

        $mdDialog.show(confirm).then(function () {

            callback(true);

        }, function () {

            callback(false);

        });
    };
});

app.directive('filterBox', function () {

    return {

        restrict: 'EA',
        scope: {

            filterBoxId: '@',
            filterFunc: '&'

        },
        templateUrl: 'components/filter-box.component.html',
        link: function (scope, element) {

            scope.mode = 'optional';
            scope.recentDays = '0';
            scope.startFiltering = function () {

                var startDate = new Date(scope.startDate);
                var endDate = new Date(scope.endDate);

                if (scope.mode !== 'optional') {

                    startDate = new Date();
                    endDate = new Date();
                    var recentDays = Number(scope.recentDays);
                    startDate.setDate(endDate.getDate() - recentDays);

                }

                scope.filterFunc({
                    dateRange: {

                        startDate: startDate,
                        endDate: endDate


                    }
                });

            };

            $(function () {
                $('.begin-date, .end-date').datepicker();

                scope.$watch('recentDays', function (newValue, oldValue) {

                    console.log(newValue === '0');
                    if (newValue === '0')
                        scope.mode = 'optional';
                    else
                        scope.mode = 'recent';

                });

            });

        }



    }


})

app.directive('jtable', function ($localStorage, $http, $rootScope) {


    return {

        restrict: 'EA',
        scope: {

            recordClick: '&',
            jtableId: '@',
            listActionUrl: '=',
            createActionUrl: '=',
            updateActionUrl: '=',
            deleteActionUrl: '=',
            // attachedListData: '=',
            formCreatedCallback: '&',
            fields: '=',
            instantLoad: '=',
            title: '@'


        },
        template: `<div id="{{jtableId}}"></div>`,
        link: function (scope, element) {

            var selector = '#' + scope.jtableId;

            $(document).ready(function () {
                $(selector).jtable({
                    title: scope.title,
                    paging: true, //Enable paging
                    recordsLoaded: function (event, data) {
                        $(selector + ' .jtable-data-row').click(function () {
                            var row_id = $(this).attr('data-record-key');
                            scope.recordClick({ id: row_id });
                        });
                    },
                    jqueryuiTheme: true,
                    actions: {
                        listAction: function (postData, params) {

                            var url = `jtStartIndex=${params.jtStartIndex}&jtPageSize=${params.jtPageSize}`;
                            if (scope.listActionUrl.indexOf('?') >= 0)
                                url = scope.listActionUrl + '&' + url;
                            else
                                url = scope.listActionUrl + '?' + url;


                            // var data = $.extend({}, postData, scope.attachedListData);
                            return $.Deferred(function ($dfd) {

                                $.ajax({
                                    url: url,
                                    type: 'GET',
                                    beforeSend: function (request) {
                                        request.setRequestHeader('token', $localStorage.auth.token);
                                    },
                                    success: function (data) {
                                        console.log(data);
                                        $dfd.resolve(data);
                                    },
                                    error: function () {
                                        $dfd.reject();
                                    }
                                });

                            });


                        },
                        createAction: scope.createActionUrl ? function (postData) {

                            console.log(postData);
                            return $.Deferred(function ($dfd) {

                                $.ajax({
                                    url: scope.createActionUrl,
                                    type: 'POST',
                                    dataType: 'json',
                                    data: postData,
                                    beforeSend: function (request) {
                                        request.setRequestHeader('token', $localStorage.auth.token);
                                    },
                                    success: function (data) {

                                        $dfd.resolve(data);
                                    },
                                    error: function () {
                                        $dfd.reject();
                                    }
                                });

                            });


                        } : undefined,
                        updateAction: scope.updateActionUrl ? function (postData, params) {

                            var firstDataPosition = postData.indexOf('&');
                            var key = postData.substring(0, firstDataPosition);
                            postData = postData.slice(firstDataPosition + 1);

                            return $.Deferred(function ($dfd) {
                                $.ajax({
                                    url: scope.updateActionUrl + '?' + key,
                                    type: 'PUT',
                                    dataType: 'json',
                                    data: postData,
                                    beforeSend: function (request) {
                                        request.setRequestHeader('token', $localStorage.auth.token);
                                    },
                                    success: function (data) {
                                        $dfd.resolve(data);
                                    },
                                    error: function () {
                                        $dfd.reject();
                                    }
                                });

                            });


                        } : undefined,
                        deleteAction: scope.deleteActionUrl ? function (postData, params) {

                            console.log(params);
                            return $.Deferred(function ($dfd) {
                                $.ajax({
                                    url: scope.deleteActionUrl,
                                    type: 'DELETE',
                                    data: postData,
                                    dataType: 'json',
                                    beforeSend: function (request) {
                                        request.setRequestHeader('token', $localStorage.auth.token);
                                    },
                                    success: function (data) {
                                        $dfd.resolve(data);
                                    },
                                    error: function () {
                                        $dfd.reject();
                                    }
                                });

                            });


                        } : undefined

                    },

                    fields: scope.fields,
                    // formCreated: function (event, data) {

                    //     data.form.find('select[name=ResponsibleEmpl]').attr('multiple', 'multiple');
                    //     data.form.find('input[name=Time]').datepicker().datepicker('setDate', 'today');
                    // }
                    formCreated: function (event, data) {

                        scope.formCreatedCallback({

                            event: event,
                            data: data

                        });

                    }
                });


                if (scope.instantLoad)
                    $(selector).jtable('load');

                $rootScope.$on('filtering', function (event, object) {

                    $(selector).jtable('load', object);

                })


            });


        }



    }



})




app.directive('uploader', function ($http) {

    return {

        restrict: 'EA',
        scope: true,
        template: '<input id="uploader" type="file" name="uploadObj" multiple/>',
        link: function (scope, element, attrs) {

            $(document).ready(function () {

                $('#uploader').fileinput({
                    uploadUrl: scope.uploadUrl, // you must set a valid URL here else you will get an error
                    // allowedFileExtensions: ['jpg', 'png', 'gif'],
                    overwriteInitial: false,
                    maxFileSize: 1000,
                    maxFilesNum: 10,
                    //allowedFileTypes: ['image', 'video', 'flash'],
                    slugCallback: function (filename) {
                        return filename.replace('(', '_').replace(']', '_');
                    }
                });

                // CATCH RESPONSE


                $('#uploader').on('fileuploaded', function (event, data, previewId, index) {
                    var records = data.response.Record.Document;
                    scope.reload(records);
                });

            });

        }



    }


})

app.directive('staticJtable', function ($localStorage, $http, $rootScope) {

    return {

        restrict: 'EA',
        scope: {

            recordClick: '&',
            jtableId: '@',
            listAction: '&',
            createAction: '&',
            updateAction: '&',
            deleteAction: '&',
            formCreatedCallback: '&',
            fields: '=',
            instantLoad: '=',
            title: '@',
            isEditable: '=',
            isCreatable: '=',
            isDeletable: '='


        },
        template: `<div id="{{jtableId}}"></div>`,
        link: function (scope, element) {

            var selector = '#' + scope.jtableId;

            $(document).ready(function () {
                $(selector).jtable({
                    title: scope.title,
                    paging: true, //Enable paging
                    recordsLoaded: function (event, data) {
                        $(selector + ' .jtable-data-row').click(function () {
                            var row_id = $(this).attr('data-record-key');
                            scope.recordClick({ id: row_id });
                        });
                    },
                    jqueryuiTheme: true,
                    actions: {

                        listAction: function (postData, params) {

                            return scope.listAction({ postData: postData, params: params });

                        },
                        createAction: scope.isCreatable ? function (postData, params) {

                            return scope.createAction({ postData: postData, params: params });

                        } : undefined,
                        updateAction: scope.isEditable ? function (postData, params) {

                            return scope.updateAction({ postData: postData, params: params });

                        } : undefined,
                        deleteAction: scope.isDeletable ? function (postData, params) {

                            return scope.deleteAction({ postData: postData, params: params });

                        } : undefined,

                    },

                    fields: scope.fields,
                    // formCreated: function (event, data) {

                    //     data.form.find('select[name=ResponsibleEmpl]').attr('multiple', 'multiple');
                    //     data.form.find('input[name=Time]').datepicker().datepicker('setDate', 'today');
                    // }
                    formCreated: function (event, data) {

                        scope.formCreatedCallback({

                            event: event,
                            data: data

                        });

                    }
                });


                if (scope.instantLoad)
                    $(selector).jtable('load');

                $rootScope.$on('filtering', function (event, object) {

                    $(selector).jtable('load', object);

                })

                $rootScope.$on('static-jtable-reload', function (event) {

                    $(selector).jtable('load');

                })


            });


        }



    }



})

app.directive('scrollToItem', function () {
    return {
        restrict: 'A',
        scope: {
            scrollTo: "@"
        },
        link: function (scope, $elm, attr) {

            $elm.on('click', function () {
                $('html,body').animate({ scrollTop: $(scope.scrollTo).offset().top }, "slow");
            });
        }
    }
}) 