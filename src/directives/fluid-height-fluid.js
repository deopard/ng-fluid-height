/**
  * @ngdoc directive
  * @name remember:fluidHeightFluid
  * @description
  *
  *
  */
(function () {
  angular
      .module('remember')
      .directive('fluidHeightFluid', fluidHeightFluid);

  fluidHeightFluid.$inject = [
    '$window', '$timeout',
    'FluidHeightManager'
  ];

  function fluidHeightFluid (
    $window, $timeout,
    FluidHeightManager
  ) {
    var directive = {
      restrict: 'A',
      link: linkFunc
    };

    return directive;

    function linkFunc (scope, el, attr, ctrl) {
      var w = angular.element($window);

      scope.getWindowDimensions = function () {
        return { 'h': w.height(), 'w': w.width() };
      };

      w.bind('resize', function () {
        scope.$apply();
      });

      scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
        // IE9과 같은 브라우저를 위하여 시간차를 두고 두번 resizing..
        resize();
        $timeout(resize, 100);

        function resize () {
          var height = FluidHeightManager.getFluidHeight(attr.fluidHeightFluid);
          el.css('max-height', height + 'px');
        }
      }, true);

      scope.$on('fluid-height-changed', function () {
        // IE9과 같은 브라우저를 위하여 시간차를 두고 두번 resizing..
        resize();
        $timeout(resize, 100);

        function resize () {
          var height = FluidHeightManager.getFluidHeight(attr.fluidHeightFluid);
          el.css('max-height', height + 'px');
        }
      });

      FluidHeightManager.registerFluid(attr.fluidHeightFluid, scope);
    }
  }
})();
