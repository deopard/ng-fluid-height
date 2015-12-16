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
