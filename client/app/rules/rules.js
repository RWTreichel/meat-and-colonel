<<<<<<< HEAD
var rules = angular.module('game.rules', []);

rules.controller('rulesCtrl', function($scope) {
  $scope.overlayClass = "white_content";

  $scope.displayBlock = { "display":"block" };
  $scope.displayNone = { "display":"none" };    

  $scope.lightStyle = $scope.displayNone;
  $scope.fadeStyle = $scope.displayNone;
<<<<<<< HEAD
=======
  
=======
var main = angular.module('game.main', ['game.rules'])

.controller('mainCtrl', function($scope, Overlay){

  $scope.showOverlay = function (id) {
      return Overlay.show(id, $scope);
  };
  return $scope.closeOverlay = function () {
      return Overlay.close($scope);
  };

});


var rules = angular.module('game.rules', [])

.factory('Overlay', function ($rootScope) {
    var Overlay;
    Overlay = {};
    Overlay.show = function (id, scope) {
        return (scope || $rootScope).$broadcast('overlay.show', id);
    };
    Overlay.close = function (scope) {
        return (scope || $rootScope).$broadcast('overlay.close');
    };
    return Overlay;
})

.directive('rulesOverlay', function () {
  return {
    restrict: 'E',
    scope: { overlayId: '@id' },
    transclude: true,
    template: '<div class="overlay-bg" ng-show="overlayVisible" ng-click="close($event)"><div id="{id}" class="overlay-container"><button class="overlay-close-button" ng-click="close($event)"></button><div class="overlay-content" ng-transclude></div><div class="overlay-footer"></div></div></div>',
    link: function (scope, elem, attrs) {
      var close;
      close = function (event) {
        return scope.overlayVisible = event != null && !angular.element(event.srcElement).hasClass('overlay-bg') && !angular.element(event.srcElement).hasClass('overlay-close-button');
      };
      close();
      scope.close = close;
      scope.$on('overlay.close', function (e) {
        return close();
      });
      return scope.$on('overlay.show', function (e, id) {
        return scope.overlayVisible = id === scope.overlayId;
      });
    }
  };
>>>>>>> Another attempt at Angular modal
>>>>>>> Another attempt at Angular modal
});