function config($urlRouterProvider, $stateProvider, $locationProvider) {


  // configure routes
  $stateProvider
    /**
     * Landing page
     * =============
     * The default entry point for the website.
     */
    .state('landing', {
      templateUrl: '/views/landing.html',
      controller: 'LandingController',
      controllerAs: 'landingCtrl',
      url: '/'
    })

    /**
     * User page
     * =========
     * Displays the user information and recent screen shots. Contains
     * multiple sibling views.
     */
    .state('user', {
      url: '/users/:username',
      views: {
        // main view
        '': {
          templateUrl: '/views/user.html',
          controller: 'UserPageController',
          controllerAs: 'userPageCtrl'
        },

        /**
         * profile bar
         * ===========
         * Creates a sidebar to display details for this user's page.
         * Information such as profile image, name, number of screenshots, etc.
         */
        'profile@user': {
          templateUrl: '/views/profileBar.html',
          controller: 'ProfileBarController',
          controllerAs: 'profileBarCtrl'
        },

        /**
         * screenshots
         * ===========
         * Displays all the screenshots from a user
         */
        'screenshots@user': {
          templateUrl: '/views/userScreenshots.html',
          controller: 'ScreenshotsController',
          controllerAs: 'screenshotsCtrl'
        }
      }
    })

    /**
     * screenshot
     * ==========
     * Provides view of a single screenshot. Sibling view to the user page.
     * Contains details on the screenshot as well as the ability to edit
     * the screenshot details (when authorized).
     */
    .state('user.screenshot', {
      url: '/screenshot/:screenshotId',
      templateUrl: '/views/screenshot.html',
      controller: 'ScreenshotController',
      controllerAs: 'screenshotCtrl'
    })

    /**
     * Sign up
     * =======
     * Allows user to sign up for the app.
     */
    .state('signup', {
      url: '/signup',
      templateUrl: '/views/signup.html',
      controller: 'AuthController',
      controllerAs: 'authCtrl'
    });

  // default uncaught routes to landing page
  $urlRouterProvider.otherwise('/');

  // enable HTML5 mode
  $locationProvider.html5Mode(true);

}

function AttachTokens($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  return {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.archivr');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
}

angular
  .module('Archivr', [
    'Archivr.auth',
    'Archivr.landing',
    'Archivr.profile',
    'Archivr.screenshots',
    'Archivr.screenshot',
    'Archivr.userPage',
    'ui.router'
  ])
  .config(config)
  .factory('AttachTokens', AttachTokens);
