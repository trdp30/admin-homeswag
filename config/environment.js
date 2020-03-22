'use strict';

module.exports = function(environment) {
  const endPoint = process.env.API_ROOT ? process.env.API_ROOT : "https://homswag.herokuapp.com"
  let ENV = {
    modulePrefix: 'admin-homswag',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    "ember-simple-auth": {
      baseURL: endPoint,
      authorizer: 'authorizer:token',
      authenticationRoute: 'authentication.login',
      routeIfAlreadyAuthenticated: 'item.index',
      routeAfterAuthentication: 'item.index',
    },

    firebase: {
      apiKey: "AIzaSyAJ_W6Ba26Cblw3m7Q1rTEOOoQc7bi8Lds",
      authDomain: "homswag.firebaseapp.com",
      databaseURL: "https://homswag.firebaseio.com",
      projectId: "homswag",
      storageBucket: "homswag.appspot.com",
      messagingSenderId: "385989703905",
      appId: "1:385989703905:web:36b14827016cf8a9e3dfa0",
      measurementId: "G-88DTQ95208"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-toastr': {
      injectAs: 'toast',
      toastrOptions: {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
        onclick: null,
        showDuration: '300',
        hideDuration: '1000',
        timeOut: '4000',
        extendedTimeOut: '1000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      }
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
