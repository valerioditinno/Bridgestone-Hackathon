/*!
 * 
 * YAKApageTitle - Bootstrap Admin Theme + AngularJS
 * 
 * Author: @geedmo
 * Website: http://geedmo.com
 * License: http://themeforest.net/licenses/standard?license=regular
 * 
 */

if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }



var App = angular.module('singular', ['ngRoute', 'ngAnimate', 'ngStorage', 'ngCookies', 'pascalprecht.translate', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'cfp.loadingBar', 'ui.utils'])
  .run(["$rootScope", "$state", "$stateParams", '$localStorage', '$cookies', function ($rootScope, $state, $stateParams, $localStorage, $cookies) {
    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $localStorage;

    // Scope Globals
    // ----------------------------------- 
    $rootScope.app = {
      name: 'YAKA',
      description: 'web application',
      year: ((new Date()).getFullYear()),
      viewAnimation: 'ng-fadeInLeft2',
      layout: {
        isFixed: true,
        isBoxed: false,
        isRTL: false
      },
      sidebar: {
        isCollapsed: false,
        slide: false
      },
      themeId: 7,
      theme: {
        sidebar: 'bg-white br',
        brand: 'bg-primary',
        topbar: 'bg-primary'
      }
    };
    var globalcookie =  $cookies.get('globals') === undefined ? '' : JSON.parse($cookies.get('globals'));
    // User information
    $rootScope.user = {
      name: $cookies.get('globals') === undefined ? '' : globalcookie.currentUser.username,
      job: 'Developer',
      picture: 'app/img/user/02.jpg'
    };
  }
]);

// Application Controller
// ----------------------------------- 

App.controller('AppController',
  ['$rootScope', '$scope', '$state', '$window', '$localStorage', '$timeout', '$location', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar', '$http', 'flotOptions', 'support', 'AuthenticationService',
    function ($rootScope, $scope, $state, $window, $localStorage, $timeout, $location, toggle, colors, browser, cfpLoadingBar, $http, flotOptions, support, AuthenticationService) {
      "use strict";

      if (support.touch)
        $('html').addClass('touch');

      // Loading bar transition
      // ----------------------------------- 

      if(!AuthenticationService.IsLogged()){
        $location.path('/page/login');
      }

      var latency;
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if ($('.app-container > section').length) // check if bar container exists
          latency = $timeout(function () {
            cfpLoadingBar.start();
          }, 0); // sets a latency Threshold
      });
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        event.targetScope.$watch("$viewContentLoaded", function () {
          $timeout.cancel(latency);
          cfpLoadingBar.complete();
        });
      });

      // State Events Hooks
      // ----------------------------------- 

      // Hook not found
      $rootScope.$on('$stateNotFound',
        function (event, unfoundState, fromState, fromParams) {
          console.log(unfoundState.to); // "lazy.state"
          console.log(unfoundState.toParams); // {a:1, b:2}
          console.log(unfoundState.options); // {inherit:false} + default options
        });

      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          // display new view from top
          $window.scrollTo(0, 0);
        });

      // Create your own per page title here
      $rootScope.pageTitle = function () {
        return 'YAKA' + ' | ' + 'Web Application';
      };

      // Restore layout settings
      // ----------------------------------- 

      if (angular.isDefined($localStorage.settings))
        $rootScope.app = $localStorage.settings;
      else
        $localStorage.settings = $rootScope.app;

      $rootScope.$watch("app.layout", function () {
        $localStorage.settings = $rootScope.app;
      }, true);


      // Allows to use branding color with interpolation
      // {{ colorByName('primary') }}
      $scope.colorByName = colors.byName;

      // Restore application classes state
      toggle.restoreState($(document.body));

      $rootScope.cancel = function ($event) {
        $event.stopPropagation();
      };


    }]);

/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'appDependencies',
  function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, appDependencies) {
    'use strict';

    App.controller = $controllerProvider.register;
    App.directive = $compileProvider.directive;
    App.filter = $filterProvider.register;
    App.factory = $provide.factory;
    App.service = $provide.service;
    App.constant = $provide.constant;
    App.value = $provide.value;

    // LAZY LOAD MODULES
    // ----------------------------------- 

    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: appDependencies.modules
    });


    // default route to dashboard
    $urlRouterProvider.otherwise('/app/dashboard');

    // 
    // App Routes
    // -----------------------------------   
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: basepath('app.html'),
        controller: 'AppController',
        resolve: requireDeps('icons', 'screenfull', 'sparklines', 'slimscroll', 'toaster', 'ui.knob', 'animate')
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: basepath('dashboard.html'),
        resolve: requireDeps('ngTable', 'ngTableExport', 'numeral')
      })
      .state('app.buttons', {
        url: '/buttons',
        templateUrl: basepath('buttons.html')
      })
      .state('app.palette', {
        url: '/palette',
        templateUrl: basepath('palette.html')
      })
      .state('app.notifications', {
        url: '/notifications',
        templateUrl: basepath('notifications.html'),
        controller: 'NotificationController'
      })
      .state('app.bootstrapui', {
        url: '/bootstrapui',
        templateUrl: basepath('bootstrap-ui.html')
      })
      .state('app.panels', {
        url: '/panels',
        templateUrl: basepath('panels.html')
      })
      .state('app.portlets', {
        url: '/portlets',
        templateUrl: basepath('portlets.html'),
        resolve: requireDeps('jquery-ui')
      })
      .state('app.maps-google', {
        url: '/maps-google',
        templateUrl: basepath('maps-google.html'),
        resolve: requireDeps('loadGoogleMapsJS', function () { return loadGoogleMaps(); }, 'AngularGM')
      })
      .state('app.maps-vector', {
        url: '/maps-vector',
        templateUrl: basepath('maps-vector.html'),
        resolve: requireDeps('vector-map', 'vector-map-maps')
      })
      .state('app.grid', {
        url: '/grid',
        templateUrl: basepath('grid.html')
      })
      .state('app.grid-masonry', {
        url: '/grid-masonry',
        templateUrl: basepath('grid-masonry.html')
      })
      .state('app.typo', {
        url: '/typo',
        templateUrl: basepath('typo.html')
      })
      .state('app.icons-feather', {
        url: '/icons-feather',
        templateUrl: basepath('icons-feather.html')
      })
      .state('app.icons-fa', {
        url: '/icons-fa',
        templateUrl: basepath('icons-fa.html')
      })
      .state('app.icons-weather', {
        url: '/icons-weather',
        templateUrl: basepath('icons-weather.html')
      })
      .state('app.icons-climacon', {
        url: '/icons-climacon',
        templateUrl: basepath('icons-climacon.html')
      })
      .state('app.form-inputs', {
        url: '/form-inputs',
        templateUrl: basepath('form-inputs.html'),
        resolve: requireDeps('moment', 'inputmask', 'angular-chosen', 'slider', 'wysiwyg')
      })
      .state('app.form-validation', {
        url: '/form-validation',
        templateUrl: basepath('form-validation.html')
      })
      .state('app.form-wizard', {
        url: '/form-wizard',
        templateUrl: basepath('form-wizard.html')
      })
      .state('app.charts', {
        url: '/charts',
        templateUrl: basepath('charts.html'),
        resolve: requireDeps('ngTable', 'ngTableExport')
      })
      .state('app.table-responsive', {
        url: '/table-responsive',
        templateUrl: basepath('table-responsive.html')
      })
      .state('app.table-ngtable', {
        url: '/table-ngtable',
        templateUrl: basepath('table-ngtable.html'),
        resolve: requireDeps('ngTable', 'ngTableExport')
      })
      .state('app.calendar', {
        url: '/calendar',
        templateUrl: basepath('calendar.html'),
        resolve: requireDeps('jquery-ui', 'moment', 'ui.calendar', 'gcal')
      })
      .state('app.invoice', {
        url: '/invoice',
        templateUrl: basepath('invoice.html')
      })
      .state('app.search', {
        url: '/search',
        templateUrl: basepath('search.html'),
        resolve: requireDeps('moment', 'angular-chosen', 'slider')
      })
      .state('app.price', {
        url: '/price',
        templateUrl: basepath('price-table.html')
      })
      .state('app.tasks', {
        url: '/tasks',
        templateUrl: basepath('tasks.html'),
        controller: 'TasksController as taskctrl'
      })
      .state('app.template', {
        url: '/template',
        templateUrl: basepath('template.html')
      })
      .state('app.documentation', {
        url: '/documentation',
        templateUrl: basepath('documentation.html'),
        resolve: requireDeps('flatdoc')
      })
      // Mailbox
      // ----------------------------------- 
      .state('app.mailbox', {
        url: '/mailbox',
        abstract: true,
        templateUrl: basepath('mailbox.html'),
        resolve: requireDeps('moment')
      })
      .state('app.mailbox.folder', {
        url: '/folder',
        abstract: true
      })
      .state('app.mailbox.folder.list', {
        url: '/:folder',
        views: {
          'container@app.mailbox': {
            templateUrl: basepath('mailbox-folder.html')
          }
        }
      })
      .state('app.mailbox.folder.list.view', {
        url: '/:id',
        views: {
          'mails@app.mailbox.folder.list': {
            templateUrl: basepath('mailbox-view-mail.html')
          }
        },
        resolve: requireDeps('wysiwyg')
      })
      .state('app.mailbox.compose', {
        url: '/compose',
        views: {
          'container@app.mailbox': {
            templateUrl: basepath('mailbox-compose.html')
          }
        },
        resolve: requireDeps('wysiwyg')
      })
      // 
      // Single Page Routes
      // ----------------------------------- 
      .state('page', {
        url: '/page',
        templateUrl: 'app/pages/page.html',
        resolve: requireDeps('icons', 'animate')
      })
      .state('page.login', {
        url: '/login',
        templateUrl: 'app/pages/login.html',
        controller: 'LoginController'
      })
      .state('page.register', {
        url: '/register',
        templateUrl: 'app/pages/register.html'
      })
      .state('page.recover', {
        url: '/recover',
        templateUrl: 'app/pages/recover.html'
      })
      .state('page.lock', {
        url: '/lock',
        templateUrl: 'app/pages/lock.html',
        controller: 'LockController'
      })
      // 
      // CUSTOM RESOLVE FUNCTION
      //   Add your own resolve properties
      //   following this object extend
      //   method
      // ----------------------------------- 
      // .state('app.yourRouteState', {
      //   url: '/route_url',
      //   templateUrl: 'your_template.html',
      //   controller: 'yourController',
      //   resolve: angular.extend(
      //     requireDeps(...), {
      //     // YOUR CUSTOM RESOLVES HERE
      //     }
      //   )
      // })
      ;


    // Change here your views base path
    function basepath(uri) {
      return 'app/views/' + uri;
    }

    // Generates a resolve object by passing script names
    // previously configured in constant.appDependencies
    // Also accept functions that returns a promise
    function requireDeps() {
      var _args = arguments;
      return {
        deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
          // Creates a promise chain for each argument
          var promise = $q.when(1); // empty promise
          for (var i = 0, len = _args.length; i < len; i++) {
            promise = addThen(_args[i]);
          }
          return promise;

          // creates promise to chain dynamically
          function addThen(_arg) {
            // also support a function that returns a promise
            if (typeof _arg == 'function')
              return promise.then(_arg);
            else
              return promise.then(function () {
                // if is a module, pass the name. If not, pass the array
                var whatToLoad = getRequired(_arg);
                // simple error check
                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                // finally, return a promise
                return $ocLL.load(whatToLoad);
              });
          }
          // check and returns required data
          // analyze module items with the form [name: '', files: []]
          // and also simple array of script files (for not angular js)
          function getRequired(name) {
            if (appDependencies.modules)
              for (var m in appDependencies.modules)
                if (appDependencies.modules[m].name && appDependencies.modules[m].name === name)
                  return appDependencies.modules[m];
            return appDependencies.scripts && appDependencies.scripts[name];
          }

        }]
      };
    }


  }]).config(['$tooltipProvider', function ($tooltipProvider) {

    $tooltipProvider.options({ appendToBody: true });

  }]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
      prefix: 'app/langs/',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

  }]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.app-container > section';
  }]);

/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

App
  .constant('appDependencies', {
    // jQuery based and standalone scripts
    scripts: {
      'animate': ['app/vendor//animate.css/animate.min.css'],
      'icons': ['app/vendor/fontawesome/css/font-awesome.min.css',
        'app/vendor/weather-icons/css/weather-icons.min.css',
        'app/vendor/feather/webfont/feather-webfont/feather.css'],
      'sparklines': ['app/js/sparklines/jquery.sparkline.min.js'],
      'slider': ['app/vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
        'app/vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'],
      'wysiwyg': ['app/vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
        'app/vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
      'slimscroll': ['app/vendor/slimscroll/jquery.slimscroll.min.js'],
      'screenfull': ['app/vendor/screenfull/dist/screenfull.min.js'],
      'vector-map': ['app/vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
        'app/vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
      'vector-map-maps': ['app/vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
        'app/vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
      'loadGoogleMapsJS': ['app/js/gmap/load-google-maps.js'],
      'flot-chart': ['app/vendor/Flot/jquery.flot.js'],
      'flot-chart-plugins': ['app/vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
        'app/vendor/Flot/jquery.flot.resize.js',
        'app/vendor/Flot/jquery.flot.pie.js',
        'app/vendor/Flot/jquery.flot.time.js',
        'app/vendor/Flot/jquery.flot.categories.js',
        'app/vendor/flot-spline/js/jquery.flot.spline.min.js'],
      'jquery-ui': ['app/vendor/jquery-ui/jquery-ui.min.js',
        'app/vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
      'moment': ['app/vendor/moment/min/moment-with-locales.min.js'],
      'inputmask': ['app/vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
      'flatdoc': ['app/vendor/flatdoc/flatdoc.js'],
      'gcal': ['app/vendor/fullcalendar/dist/gcal.js'],
      'numeral': ['app/vendor/numeral/min/numeral.min.js']
    },
    // Angular based script (use the right module name)
    modules: [
      {
        name: 'toaster', files: ['app/vendor/angularjs-toaster/toaster.js',
          'app/vendor/angularjs-toaster/toaster.css']
      },
      {
        name: 'ui.knob', files: ['app/vendor/angular-knob/src/angular-knob.js',
          'app/vendor/jquery-knob/dist/jquery.knob.min.js']
      },
      { name: 'angularFileUpload', files: ['app/vendor/angular-file-upload/dist/angular-file-upload.min.js'] },
      {
        name: 'angular-chosen', files: ['app/vendor/chosen_v1.2.0/chosen.jquery.min.js',
          'app/vendor/chosen_v1.2.0/chosen.min.css',
          'app/vendor/angular-chosen/angular-chosen.js']
      },
      {
        name: 'ngTable', files: ['app/vendor/ng-table/ng-table.min.js',
          'app/vendor/ng-table/ng-table.min.css']
      },
      { name: 'ngTableExport', files: ['app/vendor/ng-table-export/ng-table-export.js'] },
      { name: 'AngularGM', files: ['app/vendor/AngularGM/angular-gm.min.js'] },
      {
        name: 'ui.calendar', files: ['app/vendor/fullcalendar/dist/fullcalendar.min.js',
          'app/vendor/fullcalendar/dist/fullcalendar.css',
          'app/vendor/angular-ui-calendar/src/calendar.js']
      }
    ]

  })
  // Same colors as defined in the css
  .constant('appColors', {
    'primary': '#43a8eb',
    'success': '#88bf57',
    'info': '#8293b9',
    'warning': '#fdaf40',
    'danger': '#eb615f',
    'inverse': '#363C47',
    'turquoise': '#2FC8A6',
    'pink': '#f963bc',
    'purple': '#c29eff',
    'orange': '#F57035',
    'gray-darker': '#2b3d51',
    'gray-dark': '#515d6e',
    'gray': '#A0AAB2',
    'gray-light': '#e6e9ee',
    'gray-lighter': '#f4f5f5'
  })
  // Same MQ as defined in the css
  .constant('appMediaquery', {
    'desktopLG': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
  })
  ;
/**=========================================================
 * Module: CalendarController.js
 * This script handle the calendar demo and events creation
 =========================================================*/

App.controller('CalendarController', ["$scope", "colors", "$http", "$timeout", "touchDrag", function ($scope, colors, $http, $timeout, touchDrag) {
  'use strict';

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  $scope.calEventsPers = {
    id: 0,
    visible: true,
    className: ['fc-id-0'],
    events: [
      { id: 324, title: 'All Day Event', start: new Date(y, m, 1) },
      { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
      { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
      { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
      { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
      { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    ]
  };

  $scope.googleCalendar = {
    id: 1,
    visible: true,
    color: colors.byName('warning'),
    textColor: '#fff',
    url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    className: ['fc-id-1', 'gcal-event'],
    currentTimezone: 'America/Chicago'
  };

  // event source that pulls from google.com 
  $scope.eventSources = [$scope.calEventsPers, $scope.googleCalendar];


  $http.get('server/calendar/external-calendar.json').success(function (data) {

    var calEventsExt = {
      id: 2,
      visible: true,
      color: colors.byName('purple'),
      textColor: '#fff',
      className: ['fc-id-2'],
      events: []
    };

    // -----------
    // override dates just for demo
    for (var i = 0; i < data.length; i++) {
      data[i].start = new Date(y, m, d + i, 12, 0);
      data[i].end = new Date(y, m, d + i, 14, 0);
    }
    // -----------

    calEventsExt.events = angular.copy(data);

    $scope.eventSources.push(calEventsExt);

  });


  /* alert on eventClick */
  $scope.alertOnEventClick = function (event, allDay, jsEvent, view) {
    console.log(event.title + ' was clicked ');
  };
  /* alert on Drop */
  $scope.alertOnDrop = function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
    console.log('Event Droped to make dayDelta ' + dayDelta);
  };
  /* alert on Resize */
  $scope.alertOnResize = function (event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
    console.log('Event Resized to make dayDelta ' + minuteDelta);
  };

  /* add custom event*/
  $scope.addEvent = function (newEvent) {
    if (newEvent) {
      $scope.calEventsPers.events.push(newEvent);
    }
  };

  /* remove event */
  $scope.remove = function (index) {
    $scope.calEventsPers.events.splice(index, 1);
  };
  /* Change View */
  $scope.changeView = function (view, calendar) {
    $scope.myCalendar.fullCalendar('changeView', view);
  };
  /* Change View */
  $scope.renderCalender = function (calendar) {
    $scope.myCalendar.fullCalendar('render');
  };

  $scope.toggleEventSource = function (id) {
    $('.fc-id-' + id).toggleClass('hidden');
  };

  /* config object */
  $scope.uiConfig = {
    calendar: {
      googleCalendarApiKey: '<YOUR API KEY>',
      height: 450,
      editable: true,
      header: {
        left: 'month,basicWeek,basicDay',
        center: 'title',
        right: 'prev,next today'
      },
      eventClick: $scope.alertOnEventClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize,
      // Select options
      selectable: true,
      selectHelper: true,
      unselectAuto: true,
      select: function (start, end) {
        var title = prompt('Event Title:');
        var eventData;
        if (title) {
          eventData = {
            title: title,
            start: start.format(),
            end: end.format()
          };
          $scope.addEvent(eventData);
        }
        // $scope.myCalendar.fullCalendar( 'unselect' );
      },
      viewRender: function (view, element) {
        touchDrag.addTo(element[0]);
      }
    }
  };

  // Language support
  // ----------------------------------- 
  $scope.changeTo = 'Español';
  $scope.changeLang = function () {
    if ($scope.changeTo === 'Español') {
      $scope.uiConfig.calendar.dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      $scope.uiConfig.calendar.dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      $scope.changeTo = 'English';
    } else {
      $scope.uiConfig.calendar.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      $scope.uiConfig.calendar.dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      $scope.changeTo = 'Español';
    }
  };

}]);

/**=========================================================
 * Module: MailboxController.js
 * Mailbox APP controllers
 =========================================================*/

App.controller('MailboxController', ["$rootScope", "$scope", "$state", function ($rootScope, $scope, $state) {
  'use strict';
  // For mail compose
  $scope.mail = {
    cc: false,
    bcc: false
  };

  // Mailbox editr initial content
  $scope.content = "<p>Type something..</p>";


  // Manage collapsed folders nav
  $scope.mailboxMenuCollapsed = true;
  $scope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {
      closeFolderNav();
    });

  $scope.$on('closeFolderNav', closeFolderNav);

  function closeFolderNav() {
    $scope.mailboxMenuCollapsed = true;
  }

  $scope.mailboxFolders = [
    { name: 'inbox', count: 3, icon: 'fa-inbox' },
    { name: 'sent', count: 8, icon: 'fa-paper-plane-o' },
    { name: 'draft', count: 1, icon: 'fa-edit' },
    { name: 'trash', count: 12, icon: 'fa-trash-o' }
  ];

  // Define mails at parent scope to use as cache for mail request
  $scope.mails = [];

}]);

App.controller('MailboxFolderController', ["$scope", "$stateParams", "$state", "appMediaquery", "$window", "$timeout", function ($scope, $stateParams, $state, appMediaquery, $window, $timeout) {

  var $win = angular.element($window);

  $scope.mailPanelOpened = false;

  // Load mails in folder
  // ----------------------------------- 

  // store the current folder
  $scope.folder = $stateParams.folder || 'inbox';

  // If folder wasn't loaded yet, request mails using api
  if (!$scope.mails[$scope.folder]) {

    // Replace this code with a request to your mails API
    // It expects to receive the following object format

    // only populate inbox for demo
    $scope.mails['inbox'] = [
      {
        id: 0,
        subject: 'Morbi dapibus sollicitudin',
        excerpt: 'Nunc et magna in metus pharetra ultricies ac sit amet justo. ',
        time: '09:30 am',
        from: {
          name: 'Sass Rose',
          email: 'mail@example.com',
          avatar: 'app/img/user/01.jpg'
        },
        unread: false
      }
    ];
    // Generate some random user mails
    var azarnames = ['Floyd Kennedy', 'Brent Woods', 'June Simpson', 'Wanda Ward', 'Travis Hunt'];
    var azarnsubj = ['Nam sodales sollicitudin adipiscing. ', 'Cras fermentum posuere quam, sed iaculis justo rutrum at. ', 'Vivamus tempus vehicula facilisis. '];
    for (var i = 0; i < 10; i++) {
      var m = angular.copy($scope.mails['inbox'][0]);
      m.from.name = azarnames[(Math.floor((Math.random() * (azarnames.length))))];
      m.from.email = m.from.name.toLowerCase().replace(' ', '') + '@example.com';
      m.subject = azarnsubj[(Math.floor((Math.random() * (azarnsubj.length))))];
      m.from.avatar = 'app/img/user/0' + (Math.floor((Math.random() * 8)) + 1) + '.jpg';
      m.time = moment().subtract(i, 'hours').format('hh:mm a');
      m.id = i + 1;
      $scope.mails['inbox'].push(m);
    }
    $scope.mails['inbox'][0].unread = true;
    $scope.mails['inbox'][1].unread = true;
    $scope.mails['inbox'][2].unread = true;
    // end random mail generation
  }

  // requested folder mails to display in the view
  $scope.mailList = $scope.mails[$scope.folder];


  // Show and hide mail content
  // ----------------------------------- 
  $scope.openMail = function (id) {
    // toggle mail open state
    toggleMailPanel(true);
    // load the mail into the view
    $state.go('app.mailbox.folder.list.view', { id: id });
    // close the folder (when collapsed)
    $scope.$emit('closeFolderNav');
    // mark mail as read
    $timeout(function () {
      $scope.mailList[id].unread = false;
    }, 1000);
  };

  $scope.backToFolder = function () {
    toggleMailPanel(false);
    $scope.$emit('closeFolderNav');
  };

  // enable the open state to slide the mails panel 
  // when on table devices and below
  function toggleMailPanel(state) {
    if ($win.width() < appMediaquery['tablet'])
      $scope.mailPanelOpened = state;
  }

}]);

App.controller('MailboxViewController', ["$scope", "$stateParams", "$state", function ($scope, $stateParams, $state) {

  // move the current viewing mail data to the inner view scope
  $scope.viewMail = $scope.mailList[$stateParams.id];

}]);


/**=========================================================
 * Module: PortletsController.js
 * Controller for the Tasks APP 
 =========================================================*/

App.controller("TasksController", TasksController);

function TasksController($scope, $filter, $modal) {
  'use strict';
  var vm = this;

  vm.taskEdition = false;

  vm.tasksList = [
    {
      task: { title: "Solve issue #5487", description: "Praesent ultrices purus eget velit aliquet dictum. " },
      complete: true
    },
    {
      task: { title: "Commit changes to branch future-dev.", description: "" },
      complete: false
    }
  ];


  vm.addTask = function (theTask) {

    if (theTask.title === "") return;
    if (!theTask.description) theTask.description = "";

    if (vm.taskEdition) {
      vm.taskEdition = false;
    }
    else {
      vm.tasksList.push({ task: theTask, complete: false });
    }
  };

  vm.editTask = function (index, $event) {

    $event.stopPropagation();
    vm.modalOpen(vm.tasksList[index].task);
    vm.taskEdition = true;
  };

  vm.removeTask = function (index, $event) {
    vm.tasksList.splice(index, 1);
  };

  vm.clearAllTasks = function () {
    vm.tasksList = [];
  };

  vm.totalTasksCompleted = function () {
    return $filter("filter")(vm.tasksList, function (item) {
      return item.complete;
    }).length;
  };

  vm.totalTasksPending = function () {
    return $filter("filter")(vm.tasksList, function (item) {
      return !item.complete;
    }).length;
  };


  // modal Controller
  // ----------------------------------- 

  vm.modalOpen = function (editTask) {
    var modalInstance = $modal.open({
      templateUrl: '/myModalContent.html',
      controller: ModalInstanceCtrl,
      scope: $scope,
      resolve: {
        editTask: function () {
          return editTask;
        }
      }
    });

    modalInstance.result.then(function () {
      // Modal dismissed with OK status
    }, function () {
      // Modal dismissed with Cancel status'
    });

  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  var ModalInstanceCtrl = function ($scope, $modalInstance, editTask) {

    $scope.theTask = editTask || {};

    $scope.modalAddTask = function (task) {
      vm.addTask(task);
      $modalInstance.close('closed');
    };

    $scope.modalCancel = function () {
      vm.taskEdition = false;
      $modalInstance.dismiss('cancel');
    };

    $scope.actionText = function () {
      return vm.taskEdition ? 'Edit Task' : 'Add Task';
    };
  };
  ModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "editTask"];

}
TasksController.$inject = ["$scope", "$filter", "$modal"];

/**=========================================================
 * Module: ChartsController.js
 * Initializes the flot chart plugin and attaches the 
 * plugin to elements according to its type
 =========================================================*/

App.controller('ChartsController', ['$scope', '$http', '$timeout', 'flotOptions', 'colors', function ($scope, $http, $timeout, flotOptions, colors) {
  'use strict';

  // An array of boolean to tell the directive which series we want to show
  $scope.areaSeries = [true, true, true];
  $scope.chartAreaFlotChart = flotOptions['area'];
  // The array should contain the same number of element as series
  $scope.areaSplineSeries = [true, true];
  $scope.chartSplineFlotChart = flotOptions['spline'];
  // Create more array to target the sate of different series (lines, point, splines, etc)
  $scope.lineSeriesPoints = [true, true, true];
  $scope.lineSeriesLines = [true, true, true];
  $scope.chartLineFlotChart = angular.extend({}, flotOptions['line'], { yaxis: { max: 60 } });

  // Set directly our global configuration
  $scope.chartBarFlotChart = flotOptions['bar'];
  $scope.chartBarStackedFlotChart = flotOptions['bar-stacked'];
  $scope.chartPieFlotChart = flotOptions['pie'];
  $scope.chartDonutFlotChart = flotOptions['donut'];

  $scope.$on('plotReady', function (e, plot) {
    // You can do here:
    //  plot                           Flot chart object
    //  plot.getData()                 REturns the dataset processed by the plugin
    //  plot.getPlaceholder()          The inner div where the chart is placed
    //  plot.getPlaceholder().parent() The <flot> element

  });

  // KNOB Charts
  // ----------------------------------- 

  $scope.knobLoaderData1 = 100;
  $scope.knobLoaderOptions1 = {
    width: '100%', // responsive
    displayInput: true,
    fgColor: colors.byName('primary')
  };

  $scope.knobLoaderData2 = 50;
  $scope.knobLoaderOptions2 = {
    width: '80%', // responsive
    displayInput: true,
    fgColor: colors.byName('success'),
    readOnly: true,
    lineCap: 'round'
  };

  $scope.knobLoaderData3 = 37;
  $scope.knobLoaderOptions3 = {
    width: '50%', // responsive
    displayInput: true,
    fgColor: colors.byName('purple'),
    displayPrevious: true,
    thickness: 0.1
  };

  $scope.knobLoaderData4 = 60;
  $scope.knobLoaderOptions4 = {
    width: '20%', // responsive
    displayInput: true,
    fgColor: colors.byName('danger'),
    bgColor: colors.byName('warning')
  };


  // Setup realtime update
  // ----------------------------------- 

  $scope.realTimeChartOpts = angular.extend({}, flotOptions['default'], {
    series: {
      lines: { show: true, fill: true, fillColor: { colors: ["#00b4ff", "#1d93d9"] } },
      shadowSize: 0 // Drawing is faster without shadows
    },
    yaxis: {
      min: 0,
      max: 130
    },
    xaxis: {
      show: false
    },
    colors: ["#1d93d9"]
  });

  $scope.realTimeChartUpdateInterval = 30;

  var data = [],
    totalPoints = 300;

  update();

  function getRandomData() {
    if (data.length > 0)
      data = data.slice(1);
    // Do a random walk
    while (data.length < totalPoints) {
      var prev = data.length > 0 ? data[data.length - 1] : 50,
        y = prev + Math.random() * 10 - 5;
      if (y < 0) {
        y = 0;
      } else if (y > 100) {
        y = 100;
      }
      data.push(y);
    }
    // Zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < data.length; ++i) {
      res.push([i, data[i]]);
    }
    return [res];
  }
  function update() {
    $scope.realTimeChartData = getRandomData();
    $timeout(update, $scope.realTimeChartUpdateInterval);
  }


}]);
/**=========================================================
 * Module: FlotChartDirective.js
 * Initializes the Flot chart plugin and handles data refresh
 =========================================================*/

App.directive('flot', ['$http', '$timeout', function ($http, $timeout) {
  'use strict';
  return {
    restrict: 'EA',
    template: '<div></div>',
    scope: {
      dataset: '=?',
      options: '=',
      series: '=',
      callback: '=',
      src: '='
    },
    link: linkFunction
  };

  function linkFunction(scope, element, attributes) {
    var height, plot, plotArea, width;
    var heightDefault = 220;

    plot = null;

    width = attributes.width || '100%';
    height = attributes.height || heightDefault;

    plotArea = $(element.children()[0]);
    plotArea.css({
      width: width,
      height: height
    });

    function init() {
      var plotObj;
      if (!scope.dataset || !scope.options) return;
      plotObj = $.plot(plotArea, scope.dataset, scope.options);
      scope.$emit('plotReady', plotObj);
      if (scope.callback) {
        scope.callback(plotObj, scope);
      }

      return plotObj;
    }

    function onDatasetChanged(dataset) {
      if (plot) {
        plot.setData(dataset);
        plot.setupGrid();
        return plot.draw();
      } else {
        plot = init();
        onSerieToggled(scope.series);
        return plot;
      }
    }
    scope.$watchCollection('dataset', onDatasetChanged, true);

    function onSerieToggled(series) {
      if (!plot || !series) return;
      var someData = plot.getData();
      for (var sName in series) {
        angular.forEach(series[sName], toggleFor(sName));
      }

      plot.setData(someData);
      plot.draw();

      function toggleFor(sName) {
        return function (s, i) {
          if (someData[i] && someData[i][sName])
            someData[i][sName].show = s;
        };
      }
    }
    scope.$watch('series', onSerieToggled, true);

    function onSrcChanged(src) {

      if (src) {

        $http.get(src)
          .success(function (data) {

            $timeout(function () {
              scope.dataset = data;
            });

          }).error(function () {
            $.error('Flot chart: Bad request.');
          });

      }
    }
    scope.$watch('src', onSrcChanged);
  }

}]);

/**=========================================================
 * Module: FlotChartOptionsServices.js
 * Define here the common options for all types of charts
 * and access theme from your controller
 =========================================================*/
App.service('flotOptions', ['$rootScope', function ($rootScope) {
  'use strict';
  var flotOptions = {};

  flotOptions['default'] = {
    grid: {
      hoverable: true,
      clickable: true,
      borderWidth: 0,
      color: '#8394a9'
    },
    tooltip: true,
    tooltipOpts: {
      content: '%x : %y'
    },
    xaxis: {
      tickColor: '#f1f2f3',
      mode: 'categories'
    },
    yaxis: {
      tickColor: '#f1f2f3',
      position: ($rootScope.app.layout.isRTL ? 'right' : 'left')
    },
    legend: {
      backgroundColor: 'rgba(0,0,0,0)'
    },
    shadowSize: 0
  };

  flotOptions['bar'] = angular.extend({}, flotOptions['default'], {
    series: {
      bars: {
        align: 'center',
        lineWidth: 0,
        show: true,
        barWidth: 0.6,
        fill: 1
      }
    }
  });

  flotOptions['bar-stacked'] = angular.extend({}, flotOptions['default'], {
    series: {
      bars: {
        align: 'center',
        lineWidth: 0,
        show: true,
        barWidth: 0.6,
        fill: 1,
        stacked: true
      }
    }
  });

  flotOptions['line'] = angular.extend({}, flotOptions['default'], {
    series: {
      lines: {
        show: true,
        fill: 0.01
      },
      points: {
        show: true,
        radius: 4
      }
    }
  });

  flotOptions['spline'] = angular.extend({}, flotOptions['default'], {
    series: {
      lines: {
        show: false
      },
      splines: {
        show: true,
        tension: 0.4,
        lineWidth: 1,
        fill: 1
      },
    }
  });

  flotOptions['area'] = angular.extend({}, flotOptions['default'], {
    series: {
      lines: {
        show: true,
        fill: 1
      }
    }
  });

  flotOptions['pie'] = {
    series: {
      pie: {
        show: true,
        innerRadius: 0,
        label: {
          show: true,
          radius: 0.8,
          formatter: function (label, series) {
            return '<div class="flot-pie-label">' +
              //label + ' : ' +
              Math.round(series.percent) +
              '%</div>';
          },
          background: {
            opacity: 0.8,
            color: '#222'
          }
        }
      }
    }
  };

  flotOptions['donut'] = {
    series: {
      pie: {
        show: true,
        innerRadius: 0.5 // donut shape
      }
    }
  };



  return flotOptions;
}]);
/**=========================================================
 * Module: SparklinesDirective.js
 * SparkLines Mini Charts
 =========================================================*/

App.directive('sparkline', ['$timeout', '$window', function ($timeout, $window) {
  'use strict';

  return {
    restrict: 'EA',
    scope: {
      'values': '=?',
      'options': '=?'
    },
    controller: ["$scope", "$element", function ($scope, $element) {
      var values = $scope.values;
      var runSL = function () {
        initSparkLine($element);
      };

      $timeout(runSL);

      function initSparkLine($element) {
        var options = $scope.options;

        options.type = options.type || 'bar'; // default chart is bar
        options.disableHiddenCheck = true;

        $element.sparkline(values, options);

        if (options.resize) {
          $($window).resize(function () {
            $element.sparkline(values, options);
          });
        }
      }
    }]
  };


}]);

/**=========================================================
 * Module: FlatDocDirective.js
 * Creates the flatdoc markup and initializes the plugin
 =========================================================*/

App.directive('flatdoc', ["$document", function ($document) {
  'use strict';
  return {
    restrict: "EA",
    template: ["<div role='flatdoc'>",
      "<div role='flatdoc-menu' ui-scrollfix='+1'></div>",
      "<div role='flatdoc-content'></div>",
      "</div>"].join('\n'),
    link: function (scope, element, attrs) {

      var $root = $('html, body');

      Flatdoc.run({
        fetcher: Flatdoc.file(attrs.src)
      });

      angular.element($document).on('flatdoc:ready', function () {

        var docMenu = element.find('[role="flatdoc-menu"]');

        docMenu.find('a').on('click', function (e) {
          e.preventDefault(); e.stopPropagation();

          var $this = $(this);

          docMenu.find('a.active').removeClass('active');
          $this.addClass('active');

          $root.animate({
            scrollTop: $(this.getAttribute('href')).offset().top - ($('.topnavbar').height() + 10)
          }, 800);
        });

      });
    }
  };

}])
  ;
App.controller('DashboardController', ['$scope', 'colors', 'flotOptions', function ($scope, colors, flotOptions) {
  'use strict';
  // KNOB Charts
  // ----------------------------------- 

  $scope.knobLoaderData1 = 75;
  $scope.knobLoaderOptions1 = {
    width: '80%', // responsive
    displayInput: true,
    inputColor: colors.byName('gray-dark'),
    fgColor: colors.byName('info'),
    bgColor: colors.byName('inverse'),
    readOnly: true,
    lineCap: 'round',
    thickness: 0.1
  };

  $scope.knobLoaderData2 = 50;
  $scope.knobLoaderOptions2 = {
    width: '80%', // responsive
    displayInput: true,
    fgColor: colors.byName('inverse'),
    readOnly: true,
    lineCap: 'round',
    thickness: 0.1
  };


  // Dashboard charts
  // ----------------------------------- 

  // Spline chart
  $scope.splineChartOpts = angular.extend({}, flotOptions['spline'], { yaxis: { max: 115 } });
  $scope.areaSplineSeries = [true, true];
  // Line chart
  $scope.chartOpts = angular.extend({}, flotOptions['default'], {
    points: {
      show: true,
      radius: 1
    },
    series: {
      lines: {
        show: true,
        fill: 1,
        fillColor: { colors: [{ opacity: 0.4 }, { opacity: 0.4 }] }
      }
    },
    yaxis: { max: 50 }
  });
  $scope.lineChartSeries = [false, true, true];


  // Sparkline
  // ----------------------------------- 

  $scope.sparkValues = [2, 3, 4, 6, 6, 5, 6, 7, 8, 9, 10];
  $scope.sparkOptions = {
    barColor: colors.byName('gray'),
    height: 50,
    barWidth: 10,
    barSpacing: 4,
    chartRangeMin: 0
  };

}]);
/**=========================================================
 * Module: BootstrapSliderDirective
 * Initializes the jQuery UI slider controls
 =========================================================*/

App.directive('bootstrapSlider', function () {
  'use strict';
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function ($scope, $element) {
      var $elem = $($element);
      if ($.fn.slider)
        $elem.slider();
    }]
  };
});

/**=========================================================
 * Module: FormInputController.js
 * Controller for input components
 =========================================================*/

App.controller('FormInputController', FormInputController);

function FormInputController($scope) {
  'use strict';

  // Chosen data
  // ----------------------------------- 

  this.states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];

  // Datepicker
  // ----------------------------------- 

  this.today = function () {
    this.dt = new Date();
  };
  this.today();

  this.clear = function () {
    this.dt = null;
  };

  // Disable weekend selection
  this.disabled = function (date, mode) {
    return false; //( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  this.toggleMin = function () {
    this.minDate = this.minDate ? null : new Date();
  };
  this.toggleMin();

  this.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    this.opened = true;
  };

  this.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  this.initDate = new Date('2016-15-20');
  this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  this.format = this.formats[0];

  // Timepicker
  // ----------------------------------- 
  this.mytime = new Date();

  this.hstep = 1;
  this.mstep = 15;

  this.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  this.ismeridian = true;
  this.toggleMode = function () {
    this.ismeridian = !this.ismeridian;
  };

  this.update = function () {
    var d = new Date();
    d.setHours(14);
    d.setMinutes(0);
    this.mytime = d;
  };

  this.changed = function () {
    console.log('Time changed to: ' + this.mytime);
  };

  this.clear = function () {
    this.mytime = null;
  };

  // Input mask
  // ----------------------------------- 

  this.testoption = {
    "mask": "99-9999999",
    "oncomplete": function () {
      console.log();
      console.log(arguments, "oncomplete!this log form controler");
    },
    "onKeyValidation": function () {
      console.log("onKeyValidation event happend! this log form controler");
    }
  };

  //default value
  this.test1 = new Date();

  this.dateFormatOption = {
    parser: function (viewValue) {
      return viewValue ? new Date(viewValue) : undefined;
    },
    formatter: function (modelValue) {
      if (!modelValue) {
        return "";
      }
      var date = new Date(modelValue);
      return (date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()).replace(/\b(\d)\b/g, "0$1");
    },
    isEmpty: function (modelValue) {
      return !modelValue;
    }
  };

  this.mask = { regex: ["999.999", "aa-aa-aa"] };

  this.regexOption = {
    regex: "[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,4}"
  };

  this.functionOption = {
    mask: function () {
      return ["[1-]AAA-999", "[1-]999-AAA"];
    }
  };

  // Bootstrap Wysiwyg
  // ----------------------------------- 

  this.editorFontFamilyList = [
    'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
    'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact',
    'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
    'Times New Roman', 'Verdana'
  ];

  this.editorFontSizeList = [
    { value: 1, name: 'Small' },
    { value: 3, name: 'Normal' },
    { value: 5, name: 'Huge' }
  ];
}
FormInputController.$inject = ["$scope"];
/**=========================================================
 * Module: FormValidationController.js
 * Controller for input validation using AngularUI Validate
 =========================================================*/

App.controller('FormValidationController', FormValidationController);

function FormValidationController($scope) {
  'use strict';

  this.notBlackListed = function (value) {
    var blacklist = ['bad@domain.com', 'verybad@domain.com'];
    return blacklist.indexOf(value) === -1;
  };

  this.words = function (value) {
    return value && value.split(' ').length;
  };
}
FormValidationController.$inject = ["$scope"];
/**=========================================================
 * Module: MaskedDirective
 * Initializes masked inputs
 =========================================================*/

App.directive('masked', function () {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {

      if ($.fn.inputmask)
        element.inputmask(attributes.masked);

    }
  };
});

/**=========================================================
 * Module: SearchFormController.js
 * Provides autofill for top navbar search form
 =========================================================*/

App.controller('SearchFormController', ["$scope", "$state", function ($scope, $state) {
  'use strict';

  var routes = $state.get(),
    blackList = ['app', 'page']; // routes that don't want to show

  $scope.routeSelected = undefined;

  $scope.states = routes.filter(function (item) {

    return (blackList.indexOf(item.name) < 0 ? true : false);

  }).map(function (item) {

    return item.name;

  });

  $scope.onRouteSelect = function ($item, $model, $label) {

    // move to route when match is selected
    if ($model) {
      $state.go($model);
      $scope.routeSelected = undefined;
    }

  };


}]);
/**=========================================================
 * Module: WysiwygDirective.js
 * Initializes the Wysiwyg editor
 =========================================================*/

App.directive('wysiwyg', ["$timeout", function ($timeout) {
  'use strict';

  return {
    restrict: 'EA',
    controllerAs: 'editor',
    priority: 2001,
    link: function (scope, element, attrs) {

      element.css({
        'overflow': 'scroll',
        'height': attrs.height || '250px',
        'max-height': attrs.maxHeight || '300px'
      });

      $timeout(function () {
        element.wysiwyg();
      });
    }
  };

}]);
/**=========================================================
 * Module: climacon.js
 * Include any animated weather icon from Climacon
 =========================================================*/

App.directive('climacon', function () {
  'use strict';
  var SVG_PATH = 'app/vendor/animated-climacons/svgs/',
    SVG_EXT = '.svg';

  return {
    restrict: 'EA',
    link: function (scope, element, attrs) {

      var color = attrs.color || '#000',
        name = attrs.name || 'sun',
        width = attrs.width || 20,
        height = attrs.height || 20;

      // Request the svg indicated
      $.get(SVG_PATH + name + SVG_EXT).then(svgLoaded, svgError);

      // if request success put it as online svg so we can style it
      function svgLoaded(xml) {
        var svg = angular.element(xml).find('svg');

        svg.css({
          'width': width,
          'height': height
        });
        svg.find('.climacon_component-stroke').css('fill', color);

        element.append(svg);
      }
      // If fails write a message
      function svgError() {
        element.text('Error loading SVG: ' + name);
      }

    }
  };
});
App.service('language', ["$translate", function ($translate) {
  'use strict';
  // Internationalization
  // ----------------------

  var Language = {
    data: {
      // Handles language dropdown
      listIsOpen: false,
      // list of available languages
      available: {
        'en': 'English',
        'es': 'Español',
        'pt': 'Português',
        'zh-cn': '中国简体',
      },
      selected: 'English'
    },
    // display always the current ui language
    init: function () {
      var proposedLanguage = $translate.proposedLanguage() || $translate.use();
      var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in App.config
      this.data.selected = this.data.available[(proposedLanguage || preferredLanguage)];
      return this.data;

    },
    set: function (localeId, ev) {
      // Set the new idiom
      $translate.use(localeId);
      // save a reference for the current language
      this.data.selected = this.data.available[localeId];
      // finally toggle dropdown
      this.data.listIsOpen = !this.data.listIsOpen;
    }
  };

  return Language;
}]);
/**=========================================================
 * Module: HeaderNavController
 * Controls the header navigation
 =========================================================*/

App.controller('HeaderNavController', ['$scope', function ($scope) {
  'use strict';
  $scope.headerMenuCollapsed = true;

  $scope.toggleHeaderMenu = function () {
    $scope.headerMenuCollapsed = !$scope.headerMenuCollapsed;
  };

}]);
/**=========================================================
 * Module: SettingsController.js
 * Handles app setting
 =========================================================*/

App.controller('SettingsController', ["$scope", "$rootScope", "$localStorage", "language", function ($scope, $rootScope, $localStorage, language) {
  'use strict';
  $scope.app = $rootScope.app;

  $scope.themes = [
    { sidebar: 'bg-inverse', brand: 'bg-info', topbar: 'bg-white' },
    { sidebar: 'bg-inverse', brand: 'bg-inverse', topbar: 'bg-white' },
    { sidebar: 'bg-inverse', brand: 'bg-purple', topbar: 'bg-white' },
    { sidebar: 'bg-inverse', brand: 'bg-success', topbar: 'bg-white' },
    { sidebar: 'bg-white br', brand: 'bg-inverse', topbar: 'bg-inverse' },
    { sidebar: 'bg-inverse', brand: 'bg-info', topbar: 'bg-info' },
    { sidebar: 'bg-white br', brand: 'bg-purple', topbar: 'bg-purple' },
    { sidebar: 'bg-white br', brand: 'bg-primary', topbar: 'bg-primary' }
  ];

  $scope.setTheme = function ($idx) {
    $scope.app.theme = $scope.themes[$idx];
  };

  // Init internationalization service
  $scope.language = language.init();
  $scope.language.set = angular.bind(language, language.set);


}]);
/**=========================================================
 * Module: SummaryController.js
 * Handles app setting
 =========================================================*/

App.controller('SummaryController', ["$scope", "colors", function ($scope, colors) {
  'use strict';
  $scope.sparkOps1 = {
    barColor: colors.byName('primary'),
    height: 20
  };
  $scope.sparkOps2 = {
    barColor: colors.byName('info'),
    height: 20
  };
  $scope.sparkOps3 = {
    barColor: colors.byName('turquoise'),
    height: 20
  };

  $scope.sparkData1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.sparkData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.sparkData3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

}]);
/**=========================================================
 * Module: GoogleMapController.js
 * Google Map plugin controller
 =========================================================*/

App.controller('GoogleMapController', GoogleMapController);

function GoogleMapController($scope) {
  'use strict';
  var vm = this;
  // Demo 1
  // ----------------------------------- 

  $scope.$watch(function () {
    return vm.center;
  }, function (center) {
    if (center) {
      vm.centerLat = center.lat();
      vm.centerLng = center.lng();
    }
  });

  this.updateCenter = function (lat, lng) {
    vm.center = new google.maps.LatLng(lat, lng);
  };

  // Demo 2
  // ----------------------------------- 

  this.options = {
    map: {
      center: new google.maps.LatLng(48, -121),
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    },
  };

  this.volcanoes = [
    {
      id: 0,
      name: 'Mount Rainier',
      img: 'http://www.thetrackerfoundation.org/Images/MountRainier_SM.jpg',
      elevationMeters: 4392,
      location: {
        lat: 46.852947,
        lng: -121.760424
      }
    },
    {
      id: 1,
      name: 'Mount Baker',
      img: 'http://www.destination360.com/north-america/us/washington/images/s/washington-mt-baker-ski.jpg',
      elevationMeters: 3287,
      location: {
        lat: 48.776797,
        lng: -121.814467
      }
    },
    {
      id: 2,
      name: 'Glacier Peak',
      img: 'http://www.rhinoclimbs.com/Images/Glacier.9.jpg',
      elevationMeters: 3207,
      location: {
        lat: 48.111844,
        lng: -121.11412
      }
    }
  ];

  this.triggerOpenInfoWindow = function (volcano) {
    vm.markerEvents = [
      {
        event: 'openinfowindow',
        ids: [volcano.id]
      },
    ];
  };

  // Demo 3
  // ----------------------------------- 

  this.options3 = {
    map: {
      center: new google.maps.LatLng(48, -121),
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    },
    notselected: {
      icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png'
    },
    selected: {
      icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png'
    }
  };

  // add to global scope so the map plugin can see the mutated object
  // when we broadcast the changes
  $scope.volcanoes = this.volcanoes;

  this.getVolcanoOpts = function (volcan) {
    return angular.extend(
      { title: volcan.name },
      volcan.selected ? vm.options3.selected :
        vm.options3.notselected
    );
  };

  this.selectVolcano = function (volcan) {
    if (vm.volcan) {
      vm.volcan.selected = false;
    }
    vm.volcan = volcan;
    vm.volcan.selected = true;

    $scope.$broadcast('gmMarkersUpdate', 'volcanoes');

  };

}
GoogleMapController.$inject = ["$scope"];
/**=========================================================
 * Module: VectorMapController.js
 * jVector Maps support
 =========================================================*/

App.controller('VectorMapController', VectorMapController);

function VectorMapController($scope, colors) {
  'use strict';
  var vm = this;

  // SERIES & MARKERS FOR WORLD MAP
  // ----------------------------------- 

  this.seriesData = {
    'AU': 15710,    // Australia
    'RU': 17312,    // Russia
    'CN': 123370,    // China
    'US': 12337,     // USA
    'AR': 18613,    // Argentina
    'CO': 12170,   // Colombia
    'DE': 1358,    // Germany
    'FR': 1479,    // France
    'GB': 16311,    // Great Britain
    'IN': 19814,    // India
    'SA': 12137      // Saudi Arabia
  };

  this.markersData = [
    { latLng: [41.90, 12.45], name: 'Vatican City' },
    { latLng: [43.73, 7.41], name: 'Monaco' },
    { latLng: [-0.52, 166.93], name: 'Nauru' },
    { latLng: [-8.51, 179.21], name: 'Tuvalu' },
    { latLng: [7.11, 171.06], name: 'Marshall Islands' },
    { latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis' },
    { latLng: [3.2, 73.22], name: 'Maldives' },
    { latLng: [35.88, 14.5], name: 'Malta' },
    { latLng: [41.0, -71.06], name: 'New England' },
    { latLng: [12.05, -61.75], name: 'Grenada' },
    { latLng: [13.16, -59.55], name: 'Barbados' },
    { latLng: [17.11, -61.85], name: 'Antigua and Barbuda' },
    { latLng: [-4.61, 55.45], name: 'Seychelles' },
    { latLng: [7.35, 134.46], name: 'Palau' },
    { latLng: [42.5, 1.51], name: 'Andorra' }
  ];

  // set options will be reused later
  this.mapOptions = {
    height: 500,
    map: 'world_mill_en',
    backgroundColor: 'transparent',
    zoomMin: 0,
    zoomMax: 8,
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        'fill': colors.byName('gray-dark'),
        'fill-opacity': 1,
        'stroke': 'none',
        'stroke-width': 1.5,
        'stroke-opacity': 1
      },
      hover: {
        'fill-opacity': 0.8
      },
      selected: {
        fill: 'blue'
      },
      selectedHover: {
      }
    },
    focusOn: { x: 0.4, y: 0.6, scale: 1 },
    markerStyle: {
      initial: {
        fill: colors.byName('warning'),
        stroke: colors.byName('warning')
      }
    },
    onRegionLabelShow: function (e, el, code) {
      if (vm.seriesData && vm.seriesData[code])
        el.html(el.html() + ': ' + vm.seriesData[code] + ' visitors');
    },
    markers: vm.markersData,
    series: {
      regions: [{
        values: vm.seriesData,
        scale: [colors.byName('gray-darker')],
        normalizeFunction: 'polynomial'
      }]
    },
  };

  // USA MAP
  // ----------------------------------- 
  this.usaMarkersData = [
    { latLng: [33.9783241, -84.4783064], name: 'Mark_1' },
    { latLng: [30.51220349999999, -97.67312530000001], name: 'Mark_2' },
    { latLng: [39.4014955, -76.6019125], name: 'Mark_3' },
    { latLng: [33.37857109999999, -86.80439], name: 'Mark_4' },
    { latLng: [43.1938516, -71.5723953], name: 'Mark_5' },
    { latLng: [43.0026291, -78.8223134], name: 'Mark_6' },
    { latLng: [33.836081, -81.1637245], name: 'Mark_7' },
    { latLng: [41.7435073, -88.0118473], name: 'Mark_8' },
    { latLng: [39.1031182, -84.5120196], name: 'Mark_9' },
    { latLng: [41.6661573, -81.339552], name: 'Mark_10' },
    { latLng: [39.9611755, -82.99879419999999], name: 'Mark_11' },
    { latLng: [32.735687, -97.10806559999999], name: 'Mark_12' },
    { latLng: [39.9205411, -105.0866504], name: 'Mark_13' },
    { latLng: [42.8105356, -83.0790865], name: 'Mark_14' },
    { latLng: [41.754166, -72.624443], name: 'Mark_15' },
    { latLng: [29.7355047, -94.97742740000001], name: 'Mark_16' },
    { latLng: [39.978371, -86.1180435], name: 'Mark_17' },
    { latLng: [30.3321838, -81.65565099999999], name: 'Mark_18' },
    { latLng: [39.0653602, -94.5624426], name: 'Mark_19' },
    { latLng: [36.0849963, -115.1511364], name: 'Mark_20' },
    { latLng: [34.0596149, -118.1122679], name: 'Mark_21' },
    { latLng: [38.3964426, -85.4375574], name: 'Mark_22' }
  ];

  this.mapOptions2 = angular.extend({}, this.mapOptions,
    {
      map: 'us_mill_en',
      regionStyle: {
        initial: {
          'fill': colors.byName('info')
        }
      },
      focusOn: { x: 0.5, y: 0.5, scale: 1.2 },
      markerStyle: {
        initial: {
          fill: colors.byName('turquoise'),
          stroke: colors.byName('turquoise'),
          r: 10
        },
        hover: {
          stroke: colors.byName('success'),
          'stroke-width': 2
        },
      },
      markers: this.usaMarkersData,
      series: {}
    }
  );
}
VectorMapController.$inject = ["$scope", "colors"];

/**=========================================================
 * Module: VectorMapDirective
 * Init jQuery Vector Map plugin
 =========================================================*/

App.directive('vectorMap', function () {
  'use strict';

  return {
    restrict: 'EA',
    scope: {
      mapOptions: '='
    },
    compile: function (tElement, tAttrs, transclude) {
      return {
        post: function (scope, element) {
          var options = scope.mapOptions,
            mapHeight = options.height || '300';

          element.css('height', mapHeight);

          element.vectorMap(options);
        }
      };
    }
  };

});
/**=========================================================
 * Module: PortletsController.js
 * Drag and drop any panel based on jQueryUI portlets
 =========================================================*/

App.directive('portlet', ["$timeout", function ($timeout) {
  'use strict';

  var storageKeyName = 'portletState';
  var $scope;

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      $scope = scope;

      // Component is not optional
      if (!$.fn.sortable) return;

      element.sortable({
        connectWith: '[portlet]',
        items: 'div.panel',
        handle: '.portlet-handler',
        opacity: 0.7,
        placeholder: 'portlet box-placeholder',
        cancel: '.portlet-cancel',
        forcePlaceholderSize: true,
        iframeFix: false,
        tolerance: 'pointer',
        helper: 'original',
        revert: 200,
        forceHelperSize: true,
        start: setListSize,
        update: savePortletOrder,
        create: loadPortletOrder
      });

    }
  };

  function savePortletOrder(event, ui) {
    var self = event.target;
    var data = $scope.$storage[storageKeyName];

    if (!data) { data = {}; }

    data[self.id] = $(self).sortable('toArray');

    if (data) {
      $timeout(function () {
        $scope.$storage[storageKeyName] = data;
      });
    }

    // save portlet size to avoid jumps
    setListSize(self);
  }

  function loadPortletOrder(event) {
    var self = event.target;
    var data = $scope.$storage[storageKeyName];

    if (data) {

      var porletId = self.id,
        panels = data[porletId];

      if (panels) {
        var portlet = $('#' + porletId);

        $.each(panels, function (index, value) {
          $('#' + value).appendTo(portlet);
        });
      }

    }

    // save portlet size to avoid jumps
    setListSize(self);
  }

  // Keeps a consistent size in all portlet lists
  function setListSize(event) {
    var $this = $(event.target || event);
    $this.css('min-height', $this.height());
  }

}]);
/**=========================================================
 * Module: SidebarController
 * Provides functions for sidebar markup generation.
 * Also controls the collapse items states
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$location', '$http', '$timeout', 'sidebarMemu', 'appMediaquery', '$window',
  function ($rootScope, $scope, $location, $http, $timeout, sidebarMemu, appMediaquery, $window) {
    'use strict';
    var currentState = $rootScope.$state.current.name;
    var $win = $($window);
    var $html = $('html');
    var $body = $('body');

    // Load menu from json file
    // ----------------------------------- 
    sidebarMemu.load();

    // Adjustment on route changes
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      currentState = toState.name;
      // Hide sidebar automatically on mobile
      $('body.aside-toggled').removeClass('aside-toggled');

      $rootScope.$broadcast('closeSidebarMenu');
    });

    // Normalize state on resize to avoid multiple checks
    $win.on('resize', function () {
      if (isMobile())
        $body.removeClass('aside-collapsed');
      else
        $body.removeClass('aside-toggled');
    });

    $rootScope.$watch('app.sidebar.isCollapsed', function (newValue, oldValue) {
      // Close subnav when sidebar change from collapsed to normal
      $rootScope.$broadcast('closeSidebarMenu');
      $rootScope.$broadcast('closeSidebarSlide');
    });

    // Check item and children active state
    var isActive = function (item) {

      if (!item || !item.sref) return;

      var path = item.sref, prefix = '#';
      if (path === prefix) {
        var foundActive = false;
        angular.forEach(item.subnav, function (value, key) {
          if (isActive(value)) foundActive = true;
        });
        return foundActive;
      }
      else {
        return (currentState === path);
      }
    };


    $scope.getSidebarItemClass = function (item) {
      return (item.type == 'heading' ? 'nav-heading' : '') +
        (isActive(item) ? ' active' : '');
    };


    // Handle sidebar collapse items
    // ----------------------------------- 
    var collapseList = [];

    $scope.addCollapse = function ($index, item) {
      collapseList[$index] = true; //!isActive(item);
    };

    $scope.isCollapse = function ($index) {
      return collapseList[$index];
    };

    $scope.collapseAll = function () {
      collapseAllBut(-1);
    };

    $scope.toggleCollapse = function ($index) {

      // States that doesn't toggle drodopwn
      if ((isSidebarCollapsed() && !isMobile()) || isSidebarSlider()) return true;

      // make sure the item index exists
      if (typeof collapseList[$index] === undefined) return true;

      collapseAllBut($index);
      collapseList[$index] = !collapseList[$index];

      return true;

    };

    function collapseAllBut($index) {
      angular.forEach(collapseList, function (v, i) {
        if ($index !== i)
          collapseList[i] = true;
      });
    }

    // Helper checks
    // ----------------------------------- 

    function isMobile() {
      return $win.width() < appMediaquery.tablet;
    }
    function isTouch() {
      return $html.hasClass('touch');
    }
    function isSidebarCollapsed() {
      return $rootScope.app.sidebar.isCollapsed;
    }
    function isSidebarToggled() {
      return $body.hasClass('aside-toggled');
    }
    function isSidebarSlider() {
      return $rootScope.app.sidebar.slide;
    }

  }]);

/**=========================================================
 * Module: SidebarDirective
 * Wraps the sidebar. Handles collapsed state and slide
 =========================================================*/

App.directive('sideBar', ['$rootScope', '$window', '$timeout', '$compile', 'appMediaquery', 'support', '$http', '$templateCache',
  function ($rootScope, $window, $timeout, $compile, appMediaquery, support, $http, $templateCache) {
    'use strict';

    var $win = $($window);
    var $html = $('html');
    var $body = $('body');
    var $scope;
    var $sidebar;
    var $sidebarNav;
    var $sidebarButtons;

    return {
      restrict: 'E',
      template: '<nav class="sidebar" ng-transclude></nav>',
      transclude: true,
      replace: true,
      link: function (scope, element, attrs) {

        $scope = scope;
        $sidebar = element;
        $sidebarNav = element.children('.sidebar-nav');
        $sidebarButtons = element.find('.sidebar-buttons');

        // depends on device the event we use
        var eventName = isTouch() ? 'click' : 'mouseenter';
        $sidebarNav.on(eventName, '.nav > li', function () {

          if (isSidebarCollapsed() && !isMobile()) {
            toggleMenuItem($(this));
            if (isTouch()) {
              sidebarAddBackdrop();
            }
          }

        });

        // Check for click to slide sidebar navigation menu
        $sidebarNav.on('click', '.nav > li', function () {
          if (isSidebarSlider() && !isSidebarCollapsed()) {
            sidebarSliderToggle(this);
          }
        });

        // Check for click to slide sidebar bottom item
        $sidebarButtons.on('click', '.btn-sidebar', function () {
          // call parent method
          $scope.collapseAll();
          // slide sidebar 
          sidebarSliderToggle(this);
        });

        // expose a close function to use a go back
        $sidebarNav.on('click', '.sidebar-close', function () {
          sidebarSliderClose();
        });

        // if something ask us to close the sidebar menu
        $scope.$on('closeSidebarMenu', function () {
          sidebarCloseFloatItem();
        });
        // if something ask us to close the sidebar slide
        $scope.$on('closeSidebarSlide', function () {
          sidebarSliderClose();
        });

      }
    };

    // Sidebar slide mode
    // ----------------------------------- 

    function sidebarSliderClose() {
      if (!$sidebar.hasClass('sidebar-slide')) return;

      if (support.transition) {
        return $sidebar
          .on(support.transition.end, removeMenuDom)
          .removeClass('sidebar-slide').length;
      }
      else {
        $timeout(removeMenuDom, 500);
        return $sidebar.removeClass('sidebar-slide').length;
      }

      function removeMenuDom() {
        if (support.transition)
          $sidebar.off(support.transition.end);
        $sidebarNav
          .find('.nav-slide').hide()
          .filter('.sidebar-subnav').remove();
      }
    }

    // expect an level 1 li element
    function sidebarSliderToggle(element) {

      var $el = $(element),
        // Find a template
        $item = $el; //$el.siblings('.sidebar-slide-template');
      // if not exists, find a submenu UL
      if (!$item.hasClass('btn-sidebar'))
        $item = $el.children('ul');
      // make sure other slider are closed
      if (sidebarSliderClose())
        return;

      if ($item.length) {

        var templatePath = $item.attr('compile');
        var newItem, templateContent;

        // Compile content when it contains angular
        if (templatePath) {
          templateContent = $templateCache.get(templatePath);
          if (templateContent) {
            prepareItemTemplate(templateContent, templatePath);
          }
          else {
            $http.get(templatePath).success(function (data) {
              // cache the template markup
              $templateCache.put(templatePath, data);
              prepareItemTemplate(data, templatePath);
            });

          }
        }
        else {
          newItem = $item.clone();
          addSlideItemToDom(newItem);
        }
      }
    }

    function prepareItemTemplate(markup, id) {
      if (!$scope.sbSlideItems) $scope.sbSlideItems = {};

      if (!$scope.sbSlideItems[id]) {
        // create an element and compile it
        $scope.sbSlideItems[id] = $compile(markup)($scope.$parent);

      }

      // append to dom
      addSlideItemToDom($scope.sbSlideItems[id]);
    }

    function addSlideItemToDom(newItem) {
      // the first the item is not in dom so we add it
      if (!newItem.inDom) {
        newItem.inDom = true;
        newItem = newItem.prependTo($sidebarNav).addClass('nav-slide');
      }
      else {
        // nex time only show a hidden item
        newItem.show();
      }

      $timeout(function () {
        $sidebar.addClass('sidebar-slide')
          .scrollTop(0);
      }, 100);

      // Actives the items
      newItem.on('click.slide.subnav', 'li:not(.sidebar-subnav-header)', function (e) {
        e.stopPropagation();
        $(this).off('click.slide.subnav')
          .siblings('li').removeClass('active')
          .end().addClass('active');

      });
    }

    // Handles hover to open items on 
    // collapsed menu
    // ----------------------------------- 
    function toggleMenuItem($listItem) {

      sidebarCloseFloatItem();

      var ul = $listItem.children('ul');

      if (!ul.length)
        return;

      var navHeader = $('.navbar-header');
      var mar = $rootScope.app.layout.isFixed ? parseInt(navHeader.outerHeight(true), 0) : 0;

      var subNav = ul.clone().appendTo('.sidebar-wrapper');

      var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
      var vwHeight = $win.height();

      subNav
        .addClass('nav-floating')
        .css({
          position: $rootScope.app.layout.isFixed ? 'fixed' : 'absolute',
          top: itemTop,
          bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
        });

      subNav.on('mouseleave', function () {
        subNav.remove();
      });

    }

    function sidebarCloseFloatItem() {
      $('.dropdown-backdrop').remove();
      $('.sidebar-subnav.nav-floating').remove();
    }

    function sidebarAddBackdrop() {
      var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop' });
      $backdrop.insertAfter($sidebar).on("click", function () {
        sidebarCloseFloatItem();
      });
    }


    function isTouch() {
      return $html.hasClass('touch');
    }
    function isSidebarCollapsed() {
      return $rootScope.app.sidebar.isCollapsed;
    }
    function isSidebarToggled() {
      return $body.hasClass('aside-toggled');
    }
    function isMobile() {
      return $win.width() < appMediaquery.tablet;
    }
    function isSidebarSlider() {
      return $rootScope.app.sidebar.slide;
    }

  }]);
/**=========================================================
 * Module: FlotChartOptionsServices.js
 * Make an http request to load the menu structure
 =========================================================*/

App.service('sidebarMemu', ["$rootScope", "$http", function ($rootScope, $http) {
  'use strict';
  var menuJson = 'server/sidebar/sidebar-items.json',
    menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache

  return {
    load: function () {

      $http.get(menuURL)
        .success(function (items) {

          $rootScope.menuItems = items;

        })
        .error(function (data, status, headers, config) {

          alert('Failure loading menu');

        });
    }
  };

}]);


/**=========================================================
 * Module: AngularRankingController.js
 * Controller for ngTables
 =========================================================*/

 App.controller('AngularRankingController', ['$scope', '$filter', 'ngTableParams', '$cookies', '$http', AngularRankingController]);
 
 function AngularRankingController($scope, $filter, ngTableParams, $cookies, $http) {
   'use strict';
   var vm = this;
   
   var globalcookie =  $cookies.get('globals') === undefined ? '' : JSON.parse($cookies.get('globals'));
   var username = $cookies.get('globals') === undefined ? '' : globalcookie.currentUser.username

   $scope.data =  [];
   $scope.rank = '';
   $scope.loading = 'app/img/loading.gif';
   
   $http.get('../ranking', {
   }).success(function (response) {
   $scope.data = [];
     for(var i = 0; i<response.length; i++){
        $scope.data.push({
          position: (i+1),
          imagePath :'app/img/loading.gif',  
          username: response[i].user,
          sessions: response[i].count,
          distance: numeral(response[i].totalDistance).format('0,00a'),
          score: numeral(response[i].totalScore).format('0,00a')
        });
     }
   });

   
   
  $http.get('../myposition?Username='+username, {
    }).success(function (response) {
      $scope.rank =  numeral(response.position).format('0o');
      $scope.ranknum =  response.position;
  });


  // FILTERS
  // ----------------------------------- 

  vm.tableParams2 = new ngTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    filte:{

    }
  }, {
      total: $scope.data.length, // length of data
      getData: function ($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ?
          $filter('filter')($scope.data, params.filter()) :
          $scope.data;

        vm.sessions = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(vm.sessions);
      }
    });
   
 }
 



/**=========================================================
 * Module: AngularTableController.js
 * Controller for ngTables
 =========================================================*/

App.controller('AngularTableController', ['$scope', '$filter', 'ngTableParams', '$cookies', '$http', AngularTableController]);

function AngularTableController($scope, $filter, ngTableParams, $cookies, $http) {
  'use strict';
  var vm = this;

  // SORTING
  // ----------------------------------- 

  var data =  [];

  var username = JSON.parse($cookies.get('globals')).currentUser.username;
  $http.get('../usersessions', {
      params: {
        Username: username
      }
  }).success(function (response) {
    data = [];
    var count_data = -1;
    for(var i = 0; i<response.length; i++){
      if(typeof response[i].Site ==='undefined' || !response[i].Site){
        count_data++;
        data.push({
        imagePath :'app/img/loading.gif',  
        sessionid: response[i].Timestamp, date: response[i].Created_date, 
        startpoint : '',
        endpoint: '',
        link_x:'../oldsite/mappasessione.html?Username='+username+'&Session='+response[i].Timestamp+"&Coord=x",
        link_y:'../oldsite/mappasessione.html?Username='+username+'&Session='+response[i].Timestamp+"&Coord=y",
        link_z:'../oldsite/mappasessione.html?Username='+username+'&Session='+response[i].Timestamp+"&Coord=z",
        link_speed:'../oldsite/mappasessione.html?Username='+username+'&Session='+response[i].Timestamp+"&Coord=speed",
        score:parseInt(response[i].score),
        origin:response[i].origin});
      
        if(response[i].first_update != -1){
          get_geolcode($http, response[i].lat_start, response[i].lng_start, data[count_data], 'startpoint', function(res, data_in, point){
            data_in[point] = res[0];
            
          });
          get_geolcode($http, response[i].lat_end, response[i].lng_end, data[count_data], 'endpoint',  function(res, data_in, point){
            data_in[point] = res[0];
          }); 
        }else{
          data[count_data].startpoint = 'no data';
          data[count_data].endpoint = 'no data';
        }
      }
    }
  });

  // FILTERS
  // ----------------------------------- 

  vm.tableParams2 = new ngTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    filter: {
      startpoint: '',
      endpoint: '',
      date: ''
    }
  }, {
      total: data.length, // length of data
      getData: function ($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ?
          $filter('filter')(data, params.filter()) :
          data;

        vm.sessions = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(vm.sessions);
      }
    });

  // SELECT ROWS
  // ----------------------------------- 

  vm.data = data;

  vm.tableParams3 = new ngTableParams({
    page: 1,            // show first page
    count: 10          // count per page
  }, {
      total: data.length, // length of data
      getData: function ($defer, params) {
        // use build-in angular filter
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) :
          data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) :
          data;

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

  vm.changeSelection = function (user) {
    // console.info(user);
  };

  // EXPORT CSV
  // -----------------------------------  

  var data4 = [{ name: "Moroni", age: 50 },
  { name: "Tiancum", age: 43 },
  { name: "Jacob", age: 27 },
  { name: "Nephi", age: 29 },
  { name: "Enos", age: 34 },
  { name: "Tiancum", age: 43 },
  { name: "Jacob", age: 27 },
  { name: "Nephi", age: 29 },
  { name: "Enos", age: 34 },
  { name: "Tiancum", age: 43 },
  { name: "Jacob", age: 27 },
  { name: "Nephi", age: 29 },
  { name: "Enos", age: 34 },
  { name: "Tiancum", age: 43 },
  { name: "Jacob", age: 27 },
  { name: "Nephi", age: 29 },
  { name: "Enos", age: 34 }];

  vm.tableParams4 = new ngTableParams({
    page: 1,            // show first page
    count: 10           // count per page
  }, {
      total: data4.length, // length of data4
      getData: function ($defer, params) {
        $defer.resolve(data4.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

}


AngularTableController.$inject = ["$scope", "$filter", "ngTableParams"];

/**=========================================================
 * Module: heckAllTableDirective
 * Allows to use a checkbox to check all the rest in the same
 * columns in a Bootstrap table
 =========================================================*/

App.directive('checkAll', function () {
  'use strict';

  return {
    restrict: 'A',
    controller: ["$scope", "$element", function ($scope, $element) {

      $element.on('change', function () {
        var $this = $(this),
          index = $this.index() + 1,
          checkbox = $this.find('input[type="checkbox"]'),
          table = $this.parents('table');
        // Make sure to affect only the correct checkbox column
        table.find('tbody > tr > td:nth-child(' + index + ') input[type="checkbox"]')
          .prop('checked', checkbox[0].checked);

      });
    }]
  };

});
/**=========================================================
 * Module: DemoResponsiveTableController.js
 * Controller for responsive tables components
 =========================================================*/

App.controller("ResponsiveTableController", ['$scope', 'colors', function ($scope, colors) {
  'use strict';

  $scope.sparkOps1 = {
    barColor: colors.byName('primary')
  };
  $scope.sparkOps2 = {
    barColor: colors.byName('info')
  };
  $scope.sparkOps3 = {
    barColor: colors.byName('turquoise')
  };

  $scope.sparkData1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.sparkData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.sparkData3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}]);
/**=========================================================
 * Module: demo-alerts.js
 * Provides a simple demo for pagination
 =========================================================*/

App.controller('AlertDemoCtrl', ["$scope", function AlertDemoCtrl($scope) {
  'use strict';

  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'warning', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function () {
    $scope.alerts.push({ msg: 'Another alert!' });
  };

  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

}]);
/**=========================================================
 * Module: DemoButtonsController.js
 * Provides a simple demo for buttons actions
 =========================================================*/

App.controller('ButtonsCtrl', ["$scope", function ($scope) {
  'use strict';
  $scope.singleModel = 1;

  $scope.radioModel = 'Middle';

  $scope.checkModel = {
    left: false,
    middle: true,
    right: false
  };

}]);
/**=========================================================
 * Module: DemoCarouselController
 * Provides a simple demo for bootstrap ui carousel
 =========================================================*/

App.controller('CarouselDemoCtrl', ["$scope", function ($scope) {
  'use strict';

  $scope.myInterval = 5000;
  var slides = $scope.slides = [];

  $scope.addSlide = function (index) {
    var newWidth = 800 + slides.length;
    index = index || (Math.floor((Math.random() * 2)) + 1);
    slides.push({
      image: 'app/img/bg' + index + '.jpg',
      text: "Nulla viverra dignissim metus ac placerat."
    });
  };
  for (var i = 1; i <= 3; i++) {
    $scope.addSlide(i);
  }
}]);
/**=========================================================
 * Module: DemoDatepickerController.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

App.controller('DatepickerDemoCtrl', ["$scope", function ($scope) {
  'use strict';

  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  };

  $scope.toggleMin = function () {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.initDate = new Date('2016-15-20');
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

}]);

/**=========================================================
 * Module: DemoPaginationController
 * Provides a simple demo for pagination
 =========================================================*/

App.controller('PaginationDemoCtrl', ["$scope", function ($scope) {
  'use strict';

  $scope.totalItems = 64;
  $scope.currentPage = 4;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function () {
    console.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
}]);
/**=========================================================
 * Module: DemoPopoverController.js
 * Provides a simple demo for popovers
 =========================================================*/

App.controller('PopoverDemoCtrl', ["$scope", function ($scope) {
  'use strict';

  $scope.dynamicPopover = 'Hello, World!';
  $scope.dynamicPopoverTitle = 'Title';

}]);
/**=========================================================
 * Module: DemoProgressController.js
 * Provides a simple demo to animate progress bar
 =========================================================*/

App.controller('ProgressDemoCtrl', ["$scope", function ($scope) {
  'use strict';

  $scope.max = 200;

  $scope.random = function () {
    var value = Math.floor((Math.random() * 100) + 1);
    var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    $scope.showWarning = (type === 'danger' || type === 'warning');

    $scope.dynamic = value;
    $scope.type = type;
  };
  $scope.random();

  $scope.randomStacked = function () {
    $scope.stacked = [];
    var types = ['success', 'info', 'warning', 'danger'];

    for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
      var index = Math.floor((Math.random() * 4));
      $scope.stacked.push({
        value: Math.floor((Math.random() * 30) + 1),
        type: types[index]
      });
    }
  };
  $scope.randomStacked();
}]);
/**=========================================================
 * Module: DemoRatingController.js
 * Provides a demo for ratings UI
 =========================================================*/

App.controller('RatingDemoCtrl', ["$scope", function ($scope) {
  'use strict';

  $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function (value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [
    { stateOn: 'fa fa-check', stateOff: 'fa fa-check-circle' },
    { stateOn: 'fa fa-star', stateOff: 'fa fa-star-o' },
    { stateOn: 'fa fa-heart', stateOff: 'fa fa-ban' },
    { stateOn: 'fa fa-heart' },
    { stateOff: 'fa fa-power-off' }
  ];

}]);
/**=========================================================
 * Module: DemoTimepickerController
 * Provides a simple demo for bootstrap ui timepicker
 =========================================================*/

App.controller('TimepickerDemoCtrl', ["$scope", function ($scope) {
  'use strict';
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function () {
    $scope.ismeridian = !$scope.ismeridian;
  };

  $scope.update = function () {
    var d = new Date();
    d.setHours(14);
    d.setMinutes(0);
    $scope.mytime = d;
  };

  $scope.changed = function () {
    console.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function () {
    $scope.mytime = null;
  };
}]);

/**=========================================================
 * Module: DemoToasterController.js
 * Demos for toaster notifications
 =========================================================*/

App.controller('ToasterDemoCtrl', ['$scope', 'toaster', function ($scope, toaster) {
  'use strict';
  $scope.toaster = {
    type: 'success',
    title: 'Title',
    text: 'Message'
  };

  $scope.pop = function () {
    toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
  };

}]);
/**=========================================================
 * Module: DemoTooltipController.js
 * Provides a simple demo for tooltip
 =========================================================*/
App.controller('TooltipDemoCtrl', ["$scope", function ($scope) {
  'use strict';
  $scope.dynamicTooltip = 'Hello, World!';
  $scope.dynamicTooltipText = 'dynamic';
  $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';

}]);
/**=========================================================
 * Module: DemoTypeaheadController.js
 * Provides a simple demo for typeahead
 =========================================================*/

App.controller('TypeaheadCtrl', ["$scope", "$http", function ($scope, $http) {
  'use strict';
  $scope.selected = undefined;
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocation = function (val) {
    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function (res) {
      var addresses = [];
      angular.forEach(res.data.results, function (item) {
        addresses.push(item.formatted_address);
      });
      return addresses;
    });
  };

  $scope.statesWithFlags = [{ 'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png' }, { 'name': 'Alaska', 'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png' }, { 'name': 'Arizona', 'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png' }, { 'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png' }, { 'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png' }, { 'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png' }, { 'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png' }, { 'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png' }, { 'name': 'Florida', 'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png' }, { 'name': 'Georgia', 'flag': '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png' }, { 'name': 'Hawaii', 'flag': 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png' }, { 'name': 'Idaho', 'flag': 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png' }, { 'name': 'Illinois', 'flag': '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png' }, { 'name': 'Indiana', 'flag': 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png' }, { 'name': 'Iowa', 'flag': 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png' }, { 'name': 'Kansas', 'flag': 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png' }, { 'name': 'Kentucky', 'flag': '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png' }, { 'name': 'Louisiana', 'flag': 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png' }, { 'name': 'Maine', 'flag': '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png' }, { 'name': 'Maryland', 'flag': 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png' }, { 'name': 'Massachusetts', 'flag': 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png' }, { 'name': 'Michigan', 'flag': 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png' }, { 'name': 'Minnesota', 'flag': 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png' }, { 'name': 'Mississippi', 'flag': '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png' }, { 'name': 'Missouri', 'flag': '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png' }, { 'name': 'Montana', 'flag': 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png' }, { 'name': 'Nebraska', 'flag': '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png' }, { 'name': 'Nevada', 'flag': 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png' }, { 'name': 'New Hampshire', 'flag': '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png' }, { 'name': 'New Jersey', 'flag': '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png' }, { 'name': 'New Mexico', 'flag': 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png' }, { 'name': 'New York', 'flag': '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png' }, { 'name': 'North Carolina', 'flag': 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png' }, { 'name': 'North Dakota', 'flag': 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png' }, { 'name': 'Ohio', 'flag': '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png' }, { 'name': 'Oklahoma', 'flag': '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png' }, { 'name': 'Oregon', 'flag': 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png' }, { 'name': 'Pennsylvania', 'flag': 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png' }, { 'name': 'Rhode Island', 'flag': 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png' }, { 'name': 'South Carolina', 'flag': '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png' }, { 'name': 'South Dakota', 'flag': '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png' }, { 'name': 'Tennessee', 'flag': '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png' }, { 'name': 'Texas', 'flag': 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png' }, { 'name': 'Utah', 'flag': 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png' }, { 'name': 'Vermont', 'flag': '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png' }, { 'name': 'Virginia', 'flag': '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png' }, { 'name': 'Washington', 'flag': '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png' }, { 'name': 'West Virginia', 'flag': '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png' }, { 'name': 'Wisconsin', 'flag': '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png' }, { 'name': 'Wyoming', 'flag': 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png' }];

}]);
/**=========================================================
 * Module: ModalController
 * Provides a simple way to implement bootstrap modals from templates
 =========================================================*/

App.controller('ModalController', ["$scope", "$modal", "$log", function ($scope, $modal, $log) {
  'use strict';
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: '/myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size
    });

    var state = $('#modal-state');
    modalInstance.result.then(function () {
      state.text('Modal dismissed with OK status');
    }, function () {
      state.text('Modal dismissed with Cancel status');
    });
  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.

  var ModalInstanceCtrl = function ($scope, $modalInstance) {

    $scope.ok = function () {
      $modalInstance.close('closed');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };
  ModalInstanceCtrl.$inject = ["$scope", "$modalInstance"];

}]);

/**=========================================================
 * Module: NotificationController.js
 * Initializes the notifications system
 =========================================================*/

App.controller('NotificationController', ["$scope", "$routeParams", function ($scope, $routeParams) {
  'use strict';
  $scope.autoplace = function (context, source) {
    //return (predictTooltipTop(source) < 0) ?  "bottom": "top";
    var pos = 'top';
    if (predictTooltipTop(source) < 0)
      pos = 'bottom';
    if (predictTooltipLeft(source) < 0)
      pos = 'right';
    return pos;
  };

  // Predicts tooltip top position 
  // based on the trigger element
  function predictTooltipTop(el) {
    var top = el.offsetTop;
    var height = 40; // asumes ~40px tooltip height

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
    }
    return (top - height) - (window.pageYOffset);
  }

  // Predicts tooltip top position 
  // based on the trigger element
  function predictTooltipLeft(el) {
    var left = el.offsetLeft;
    var width = el.offsetWidth;

    while (el.offsetParent) {
      el = el.offsetParent;
      left += el.offsetLeft;
    }
    return (left - width) - (window.pageXOffset);
  }

}]);
/**=========================================================
 * Module: ScrollableDirective.js
 * Make a content box scrollable
 =========================================================*/

App.directive('scrollable', function () {
  'use strict';
  return {
    restrict: 'EA',
    link: function (scope, elem, attrs) {
      var defaultHeight = 285;

      attrs.height = attrs.height || defaultHeight;

      elem.slimScroll(attrs);

    }
  };
});
/**=========================================================
 * Module: AnimateEnabledDirective.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

App.directive('animateEnabled', ['$animate', function ($animate) {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(function () {
        return scope.$eval(attrs.animateEnabled, scope);
      }, function (newValue) {
        $animate.enabled(!!newValue, element);
      });
    }
  };
}]);
/**=========================================================
 * Module: EmptyAnchorDirective.js
 * Disables null anchor behavior
 =========================================================*/

App.directive('href', function () {
  'use strict';
  return {
    restrict: 'A',
    compile: function (element, attr) {
      return function (scope, element) {
        if ((attr.ngClick || attr.href === '' || attr.href === '#')
          && (!element.hasClass('dropdown-toggle'))) {
          element.on('click', function (e) {
            e.preventDefault();
            // e.stopPropagation();
          });
        }
      };
    }
  };
});
/**=========================================================
 * Module: FullscreenDirective
 * Toggle the fullscreen mode on/off
 =========================================================*/

App.directive('toggleFullscreen', function () {
  'use strict';

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      // fullscreen not supported on ie
      if (/Edge\/|Trident\/|MSIE /.test(window.navigator.userAgent))
        return $('[toggle-fullscreen]').addClass('hide');

      if (screenfull.enabled) {

        element.on('click', function (e) {
          e.preventDefault();

          screenfull.toggle();

          // Switch icon indicator
          if (screenfull.isFullscreen)
            $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
          else
            $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

        });

      } else {
        element.remove();
      }
    }
  };

});


/**=========================================================
 * Module: ResetKeyDirective.js
 * Removes a key from the browser storage via element click
 =========================================================*/

App.directive('resetKey', ['$state', '$rootScope', function ($state, $rootScope) {
  'use strict';

  return {
    restrict: 'EA',
    link: function (scope, element, attrs) {

      var resetKey = attrs.resetKey;

      element.on('click', function (e) {
        e.preventDefault();

        if (resetKey) {
          delete $rootScope.$storage[resetKey];
          $state.go($state.current, {}, { reload: true });
        }
        else {
          $.error('No storage key specified for reset.');
        }
      });
    }
  };

}]);
/**=========================================================
 * Module: ToggleStateDirective.js
 * Toggle a classname from the BODY
 * Elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * [no-persist] to avoid saving the sate in browser storage
 =========================================================*/

App.directive('toggleState', ['toggleStateService', function (toggle) {
  'use strict';

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var $body = angular.element('body');

      $(element)
        .on('click', function (e) {
          e.preventDefault();
          var classname = attrs.toggleState;

          if (classname) {
            if ($body.hasClass(classname)) {
              $body.removeClass(classname);
              if (!attrs.noPersist)
                toggle.removeState(classname);
            }
            else {
              $body.addClass(classname);
              if (!attrs.noPersist)
                toggle.addState(classname);
            }

          }

        });
    }
  };

}]);

/**=========================================================
 * Module: TitleCaseFilter.js
 * Convert any case to title
 =========================================================*/

App.filter('titlecase', function () {
  'use strict';
  return function (s) {
    s = (s === undefined || s === null) ? '' : s;
    return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
      return ch.toUpperCase();
    });
  };
});
/**=========================================================
 * Module: BrowserDetectionService.js
 * Browser detection service
 =========================================================*/

App.service('browser', function () {
  "use strict";

  var matched, browser;

  var uaMatch = function (ua) {
    ua = ua.toLowerCase();

    var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
      [];

    var platform_match = /(ipad)/.exec(ua) ||
      /(iphone)/.exec(ua) ||
      /(android)/.exec(ua) ||
      /(windows phone)/.exec(ua) ||
      /(win)/.exec(ua) ||
      /(mac)/.exec(ua) ||
      /(linux)/.exec(ua) ||
      /(cros)/i.exec(ua) ||
      [];

    return {
      browser: match[3] || match[1] || "",
      version: match[2] || "0",
      platform: platform_match[0] || ""
    };
  };

  matched = uaMatch(window.navigator.userAgent);
  browser = {};

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.version);
  }

  if (matched.platform) {
    browser[matched.platform] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {
    browser.mobile = true;
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if (browser.cros || browser.mac || browser.linux || browser.win) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+ and Safari are webkit based browsers
  if (browser.chrome || browser.opr || browser.safari) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if (browser.rv) {
    var ie = "msie";

    matched.browser = ie;
    browser[ie] = true;
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    var opera = "opera";

    matched.browser = opera;
    browser[opera] = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if (browser.safari && browser.android) {
    var android = "android";

    matched.browser = android;
    browser[android] = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;


  return browser;

});
/**=========================================================
 * Module: ColorsService.js
 * Services to retrieve global colors
 =========================================================*/

App.factory('colors', ['appColors', function (appColors) {
  'use strict';
  return {
    byName: function (name) {
      return (appColors[name] || '#fff');
    }
  };

}]);



/**=========================================================
 * Module: AuthenticationService.js
 * Services to login
 =========================================================*/

App.factory('AuthenticationService', ['$http', '$cookies', '$rootScope', '$timeout', function ($http, $cookies, $rootScope, $timeout) {
  'use strict';
  var service = {};

  service.Login = Login;
  service.SetCredentials = SetCredentials;
  service.ClearCredentials = ClearCredentials;
  service.IsLogged = IsLogged;

  return service;

  function IsLogged() {
    var cookielogin = $cookies.get('globals');
    return !(cookielogin === undefined) && cookielogin != {}; 
  }

  function Login(username, password, callback) {

    $http.post('../loginSite', { Username: username, Password: password })
      .success(function (response) {
        callback(response);
      });
  }

  function SetCredentials(username, password) {
    var authdata = Base64.encode(username + ':' + password);

    $rootScope.globals = {
      currentUser: {
        username: username,
        authdata: authdata
      }
    };

    // set default auth header for http requests
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

    // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
    var cookieExp = new Date();
    cookieExp.setDate(cookieExp.getDate() + 7);
    $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
  }

  function ClearCredentials() {
    $rootScope.globals = {};
    $cookies.remove('globals');
    $http.defaults.headers.common.Authorization = 'Basic';
  }
}]);


// Base64 encoding service used by AuthenticationService
var Base64 = {

  keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this.keyStr.charAt(enc1) +
        this.keyStr.charAt(enc2) +
        this.keyStr.charAt(enc3) +
        this.keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
  },

  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
      window.alert("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
      enc1 = this.keyStr.indexOf(input.charAt(i++));
      enc2 = this.keyStr.indexOf(input.charAt(i++));
      enc3 = this.keyStr.indexOf(input.charAt(i++));
      enc4 = this.keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return output;
  }
};

App.controller('LockController', ['AuthenticationService', '$scope', '$cookies', '$location',
  function(AuthenticationService, $scope, $cookies, $location){
    $scope.message = '';
    $scope.login = login;

    if(!AuthenticationService.IsLogged()){
      $location.path('/page/login');
    }else{
      $scope.username = JSON.parse($cookies.get('globals')).currentUser.username;
      AuthenticationService.ClearCredentials();
    }
    
    $scope.$watch('password', function() {
      $scope.message = '';
    });

    function login() {
      $scope.dataLoading = true;
      AuthenticationService.Login($scope.username, $scope.password, function (response) {
        if (response.success) {
          AuthenticationService.SetCredentials($scope.username, $scope.password);
          $location.path('/');
        } else {
          $scope.dataLoading = false;
          $scope.message = response.message;
        }
      });
    };
}]);

App.controller('LoginController', ['$scope', '$location', 'AuthenticationService',
  function ($scope, $location, AuthenticationService) {
    var vm = this;
    $scope.login = login;

    (function initController() {
      // reset login status
      AuthenticationService.ClearCredentials();
    })();

    function login() {
    $scope.dataLoading = true;
      AuthenticationService.Login($scope.username, $scope.password, function (response) {
        if (response.success) {
          AuthenticationService.SetCredentials($scope.username, $scope.password);
          $location.path('/');
        } else {
          $scope.dataLoading = false;
        }
      });
    };
  }
]);

/**=========================================================
 * Module: SupportService.js
 * Checks for features supports on browser
 =========================================================*/

App.service('support', ["$document", "$window", function ($document, $window) {
  'use strict';
  var support = {};
  var doc = $document[0];

  // Check for transition support
  // ----------------------------------- 
  support.transition = (function () {

    var transitionEnd = (function () {

      var element = doc.body || doc.documentElement,
        transEndEventNames = {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd otransitionend',
          transition: 'transitionend'
        }, name;

      for (name in transEndEventNames) {
        if (element.style[name] !== undefined) return transEndEventNames[name];
      }
    }());

    return transitionEnd && { end: transitionEnd };
  })();

  // Check for animation support
  // ----------------------------------- 
  support.animation = (function () {

    var animationEnd = (function () {

      var element = doc.body || doc.documentElement,
        animEndEventNames = {
          WebkitAnimation: 'webkitAnimationEnd',
          MozAnimation: 'animationend',
          OAnimation: 'oAnimationEnd oanimationend',
          animation: 'animationend'
        }, name;

      for (name in animEndEventNames) {
        if (element.style[name] !== undefined) return animEndEventNames[name];
      }
    }());

    return animationEnd && { end: animationEnd };
  })();

  // Check touch device
  // ----------------------------------- 
  support.touch = (
    ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
    ($window.DocumentTouch && document instanceof $window.DocumentTouch) ||
    ($window.navigator['msPointerEnabled'] && $window.navigator['msMaxTouchPoints'] > 0) || //IE 10
    ($window.navigator['pointerEnabled'] && $window.navigator['maxTouchPoints'] > 0) || //IE >=11
    false
  );

  return support;
}]);
/**=========================================================
 * Module: ToggleStateService.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function ($rootScope) {
  'use strict';
  var storageKeyName = 'toggleState';

  // Helper object to check for words in a phrase //
  var WordChecker = {
    hasWord: function (phrase, word) {
      return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
    },
    addWord: function (phrase, word) {
      if (!this.hasWord(phrase, word)) {
        return (phrase + (phrase ? ' ' : '') + word);
      }
    },
    removeWord: function (phrase, word) {
      if (this.hasWord(phrase, word)) {
        return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
      }
    }
  };

  // Return service public methods
  return {
    // Add a state to the browser storage to be restored later
    addState: function (classname) {
      var data = $rootScope.$storage[storageKeyName];

      if (!data) {
        data = classname;
      }
      else {
        data = WordChecker.addWord(data, classname);
      }

      $rootScope.$storage[storageKeyName] = data;
    },

    // Remove a state from the browser storage
    removeState: function (classname) {
      var data = $rootScope.$storage[storageKeyName];
      // nothing to remove
      if (!data) return;

      data = WordChecker.removeWord(data, classname);

      $rootScope.$storage[storageKeyName] = data;
    },

    // Load the state string and restore the classlist
    restoreState: function ($elem) {
      var data = $rootScope.$storage[storageKeyName];

      // nothing to restore
      if (!data) return;
      $elem.addClass(data);
    }

  };

}]);
/**=========================================================
 * Module: TouchDragService.js
 * Services to add touch drag to a dom element
 =========================================================*/

App.service('touchDrag', ['$document', 'browser', function ($document, browser) {
  'use strict';
  return {
    touchHandler: function (event) {
      var touch = event.changedTouches[0];

      var simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
      }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

      touch.target.dispatchEvent(simulatedEvent);
      event.preventDefault();
    },
    addTo: function (element) {
      element = element || $document;
      if (browser.mobile) {
        element.addEventListener("touchstart", this.touchHandler, true);
        element.addEventListener("touchmove", this.touchHandler, true);
        element.addEventListener("touchend", this.touchHandler, true);
        element.addEventListener("touchcancel", this.touchHandler, true);
      }
    }
  };
}]);


function get_geolcode(http, lat, lng, data_in, point, callback) {


    http.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng : lat + ',' + lng,
        key: 'AIzaSyDh2ZoqiOa5x4N43XJoIWZOc__7MvHPa7I'
      }
    }).then(function (res) {
      var addresses = [];
      angular.forEach(res.data.results, function (item) {
        addresses.push(item.formatted_address);
      });
      callback(addresses, data_in, point);
    });
/*
  var options = {
      uri : 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng +'&key=AIzaSyDh2ZoqiOa5x4N43XJoIWZOc__7MvHPa7I',
      method : 'GET'
  }; 
  var res = '';
  console.log(options.uri);
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          res = body;
      }
      else {
          res = {
            "results" : [],
            "status" : "ZERO_RESULTS_WITH_ERROR"
          };
      }
      callback(res);
  });*/
}


/**
 if(post !== null){
              get_geolcode(post.lat, post.lng, function(data){
                var response = JSON.parse(data);
                if(response.status == 'OK'){
                  start_point = response.results[0].formatted_address;
                  console.log(start_point);
                }
              });
            }
 */