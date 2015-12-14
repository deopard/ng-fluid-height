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
