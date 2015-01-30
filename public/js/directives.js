'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function (scope, elm, attrs) {
      elm.text(version);
    };
  })
  .directive('videoPlayer', function ($sce) {
    return {
      template: '<div><video ng-src="{{trustSrc()}}" autoplay></video></div>',
      restrict: 'E',
      replace: true,
      scope: {
        vidSrc: '@'
      },
      link: function (scope) {
        console.log('Initializing videoPlayer');
        scope.trustSrc = function () {
          if (!scope.vidSrc) {
            return undefined;
          }
          return $sce.trustAsResourceUrl(scope.vidSrc);
        };
      }
    };
  });
