/**
  * @ngdoc directive
  * @name deopard.ngFluidHeight:fluidHeightStatic
  * @description
  *
  */
(function () {
  angular
    .module('deopard.ngFluidHeight')
    .directive('fluidHeightStatic', FluidHeightStatic);

  FluidHeightStatic.$inject = ['FluidHeightManager'];

  function FluidHeightStatic (FluidHeightManager) {
    var directive = {
      restrict: 'A',
      scope: {
        /**
         * @ngdoc property
         * @name fluidHeightStatic
         * @description
         * Group name of fluid height calculation.
         */
        fluidHeightStatic: '=',

        /**
         * @ngdoc property
         * @name fluidHeightStatic
         * @description
         * Unique key of the static height element in calculation group.
         */
        fluidHeightStaticKey: '=',

        /**
         * @ngdoc property
         * @name fluidHeightStatic
         * @description
         * Element's static height.
         */
        fluidHeightStaticHeight: '=?',

        /**
         * @ngdoc property
         * @name fluidHeightStatic
         * @description
         * Expression whether this element is shown.
         */
        fluidHeightStaticShown: '=?'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc (scope, el, attr, ctrl) {
      var key = scope.fluidHeightStatic;
      var id = scope.fluidHeightStaticKey;
      var height = scope.fluidHeightStaticHeight;

      // When height is not explicitly declared,
      // automatically calculate the element's height and use it
      if (!height) {
        height = el[0].offsetHeight;

        // Register scope.$watch to watch element's height change.
        scope.$watch(
          function () { return el[0].offsetHeight; },
          function (newHeight) {
            FluidHeightManager.changed(
              key, id,
              scope.fluidHeightStaticShown === false ? 0 : newHeight
            );
          }
        );
      }

      // Register static height element to FluidHeightManager
      FluidHeightManager.registerStatic(
        key, id,
        scope.fluidHeightStaticShown === false ? 0 : height
      );

      //visibility changed
      scope.$watch(
        function () { return scope.fluidHeightStaticShown !== false; },
        function (shown) {
          FluidHeightManager.changed(
            key, id,
            shown ? height : 0
          );
        }
      );

      //destroy
      scope.$on('$destroy',
        function () {
          FluidHeightManager.changed(
            key, id,
            0
          );
        }
      );
    }
  }
})();
