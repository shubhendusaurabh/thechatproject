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
  })
  .directive('elastic', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function($scope, element) {
          $scope.initialHeight = $scope.initialHeight || element[0].offsetHeight;
          var resize = function() {
            element[0].style.height = $scope.initialHeight+'px';
            element[0].style.height = "" + element[0].scrollHeight + 'px';
          };
          element.on('input blur keyup change', resize);
          $timeout(resize, 0);
        }
      };
    }
  ]);
