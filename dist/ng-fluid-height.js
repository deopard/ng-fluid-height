/*! 
 * ng-fluid-height v1.0.0
 * https://github.com/deopard/ng-fluid-height#readme
 * Copyright (c) 2015 Tom Kim
 * License: MIT
 */
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

/**
  * @ngdoc directive
  * @name remember:fluidHeightStatic
  * @description
  *
  *
  */
(function () {
	angular
	    .module('remember')
	    .directive('fluidHeightStatic', fluidHeightStatic);

	fluidHeightStatic.$inject = ['$window', '$timeout', 'FluidHeightManager'];

	function fluidHeightStatic ($window, $timeout, FluidHeightManager) {
	    var directive = {
	        restrict: 'A',
			scope: {
				fluidHeightStaticShown: '='
			},
		    link: linkFunc
	    };

	    return directive;

	    function linkFunc (scope, el, attr, ctrl) {
			var key = attr.fluidHeightStatic;
			var id = attr.fluidHeightStaticKey;
			var height = parseInt(attr.fluidHeightStaticHeight);

			// 만약 높이가 지정되어있지 않거나 올바르지 않을 경우 자동으로 높이를 조절하여 사용한다.
			if (!height || height.toString() != attr.fluidHeightStaticHeight) {
				height = el.outerHeight();

				// 로딩중에 따라 높이가 변경될 경우에 따른 처리도 한다.
				scope.$watch(
					function () { return el.outerHeight(); },
					function (newHeight) {
						FluidHeightManager.changed(
							key, id,
							!!scope.fluidHeightStaticShown ? newHeight : 0
						);
					}
				);
			}

			FluidHeightManager.registerStatic(
				key, id,
				!!scope.fluidHeightStaticShown ? height : 0
			);

			//visibility changed
			scope.$watch(
				function () { return !!scope.fluidHeightStaticShown; },
				function (shown) {
					FluidHeightManager.changed(
						key, id,
						shown ? height : 0
					);
				}
			);
	    }
	}
})();

/**
 * @ngdoc service
 * @name remember:FluidHeightManager
 * @description
 * Popover등을 보여
 */
(function () {
	angular
		.module('remember')
		.service('FluidHeightManager', FluidHeightManager)

	FluidHeightManager.$inject = ['$window'];

	function FluidHeightManager ($window) {
		var w = angular.element($window);

		/**
		  * @ngdoc property
		  * @name height
		  * @propertyOf remember:FluidHeightManager
		  * @description
		  *
		  */
		var heights = {};

		var scopes = {};

		this.registerFluid = registerFluid;

		/**
		  * @ngdoc method
		  * @name register
		  * @methodOf remember:FluidHeightManager
		  * @param {string} key Fluid layout을 구분지을 key.
		  * @param {string} drtvId directive의 고유 id
		  * @param {number} height register일때의 height
		  * @description
		  * Fluid layout에 static height로 drtv를 등록한다.
		  */
		this.registerStatic = registerStatic;

		/**
		  * @ngdoc method
		  * @name register
		  * @methodOf remember:FluidHeightManager
		  * @param {string} key Fluid layout을 구분지을 key
		  * @description
		  * FluidHeightManager에게 현재 Fluid layout key에서 fluid 부분의 높이를 계산해달라 요청한다.
		  */
		this.getFluidHeight = getFluidHeight;

		/**
		  * @ngdoc method
		  * @name register
		  * @methodOf remember:FluidHeightManager
		  * @param {string} key Fluid layout을 구분지을 key.
		  * @param {string} drtvId directive의 고유 id
		  * @param {number} height 변경된 높이의
		  * @description
		  * FluidHeightManager에게 등록되어있는 static element의 크기가 변경되었음을 알려준다.
		  */
		this.changed = changed;

		function registerFluid (key, scope) {
			scopes[key] = scope;
		}

		function registerStatic (key, drtvId, height) {
			if (_.isUndefined(heights[key])) {
				heights[key] = {};
			}

			heights[key][drtvId] = height;
		}

		function changed (key, drtvId, height) {
			heights[key][drtvId] = height;

			if (!_.isUndefined(scopes[key])) {
				scopes[key].$emit('fluid-height-changed');
			}
		}

		function getFluidHeight (key) {
			//window height - [static heights]
			var sh = 0;
			_.each(heights[key], function (h) {
				sh += h;
			});

			//common에 대한 높이도 계산
			_.each(heights.common, function (h) {
				sh += h;
			});

			return $(window).height() - sh - 10;
		}
	}
})();
