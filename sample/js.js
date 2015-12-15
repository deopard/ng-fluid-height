angular.module('app', ['deopard.ngFluidHeight'])
  .controller('Ctrl', function($scope, $interval) {
    $scope.showToggle = false;
    $scope.list = [1,2,3,4,5,6,7,8,9,10];

    $interval(function () {
      $scope.showToggle = !$scope.showToggle;
    }, 2000);
  });
