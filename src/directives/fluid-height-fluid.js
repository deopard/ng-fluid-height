(function () {
  angular
    .module('deopard.ngFluidHeight', []);
})();

/**
  * @ngdoc directive
  * @name deopard.ngFluidHeight:fluidHeightFluid
  * @description
  * AngularJS directive to register fluid height element to calculation group in FluidHeightManager
  */
(function () {
  angular
    .module('deopard.ngFluidHeight')
    .directive('fluidHeightFluid', FluidHeightFluid);

  FluidHeightFluid.$inject = [
    '$window',
    'FluidHeightManager'
  ];

  function FluidHeightFluid (
    $window,
    FluidHeightManager
  ) {
    var directive = {
      restrict: 'A',
      scope: {
        /**
         * @ngdoc property
         * @name fluidHeightStatic
         * @description
         * Group name of fluid height calculation.
         */
        fluidHeightFluid: '='
      },
      link: linkFunc
    };

    return directive;

    function linkFunc (scope, el, attr, ctrl) {
      var w = angular.element($window);

      w.bind('resize', function () { scope.$apply(); });

      scope.$watch(getWindowDimensions, resize, true);

      scope.$on('fluid-height-changed', resize);

      FluidHeightManager.registerFluid(scope.fluidHeightFluid, scope);

      function getWindowDimensions () {
        return { 'h': w[0].outerHeight, 'w': w[0].outerHeight };
      }

      function resize () {
        var height = FluidHeightManager.getFluidHeight(scope.fluidHeightFluid);
        el.css('max-height', height + 'px');
      }
    }
  }
})();
