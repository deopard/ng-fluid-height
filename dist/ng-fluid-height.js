/*! 
 * ng-fluid-height v1.0.1
 * https://github.com/deopard/ng-fluid-height#readme
 * Copyright (c) 2016 Tom Kim
 * License: MIT
 */
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
        return { 'h': w[0].innerHeight, 'w': w[0].innerHeight };
      }

      function resize () {
        var height = FluidHeightManager.getFluidHeight(scope.fluidHeightFluid);
        el.css('max-height', height + 'px');
      }
    }
  }
})();

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

/**
  * @ngdoc service
  * @name deopard.ngFluidHeight:FluidHeightManager
  * @description
  * Help register and unregistering height calc elements
  */
(function () {
  angular
    .module('deopard.ngFluidHeight')
    .service('FluidHeightManager', FluidHeightManager);

  FluidHeightManager.$inject = ['$window'];

  function FluidHeightManager ($window) {
    // current window element
    // var w = angular.element($window);
    var w = angular.element($window);

    // Dictionary of heights of registered height elements
    var heights = {};

    // Dictionary of scopes of registered height elements
    var scopes = {};

    /**
      * @ngdoc method
      * @name registerFluid
      * @methodOf deopard.ngFluidHeight:FluidHeightManager
      * @param {string} key Calculation group's key. Should be unique among groups
      * @param {scope} scope Scope of the fluid height element
      * @description
      * Register fluid height sized element to calcuation group.
      */
    this.registerFluid = registerFluid;

    /**
      * @ngdoc method
      * @name registerStatic
      * @methodOf deopard.ngFluidHeight:FluidHeightManager
      * @param {string} key Calculation group's key. Should be unique among groups. "common" is a special key and will be calculated in all groups.
      * @param {string} name Element's unique name in group
      * @param {number} height Static height of the element
      * @description
      * Register static height sized element to calculation group.
      */
    this.registerStatic = registerStatic;

    /**
      * @ngdoc method
      * @name getFluidHeight
      * @methodOf deopard.ngFluidHeight:FluidHeightManager
      * @param {string} key Calculation group's key. Should be unique among groups
      * @description
      * Calculates the fluid height in calculation group and returns it.
      * The calculation formula: Window's current height - sum of static heights in this calculation group
      */
    this.getFluidHeight = getFluidHeight;

    /**
      * @ngdoc method
      * @name changed
      * @methodOf deopard.ngFluidHeight:FluidHeightManager
      * @param {string} key Calculation group's key. Should be unique among groups
      * @param {string} name Element's unique name in group
      * @param {number} height Static height of the element
      * @description
      * Change the size of static height element in specified calculation group.
      */
    this.changed = changed;

    function registerFluid (key, scope) {
      scopes[key] = scope;
    }

    function registerStatic (key, name, height) {
      if (angular.isUndefined(heights[key])) {
        heights[key] = {};
      }

      heights[key][name] = height;
    }

    function getFluidHeight (key) {
      // window height - [static heights]
      var sh = 0;
      angular.forEach(heights[key], function (h) {
        sh += h;
      });

      // calculate common heights
      angular.forEach(heights.common, function (h) {
        sh += h;
      });

      return w[0].innerHeight - sh;
    }

    function changed (key, name, height) {
      heights[key][name] = height;

      if (!angular.isUndefined(scopes[key])) {
        scopes[key].$emit('fluid-height-changed');
      }
    }
  }
})();
