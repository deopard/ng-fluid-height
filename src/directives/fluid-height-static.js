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
