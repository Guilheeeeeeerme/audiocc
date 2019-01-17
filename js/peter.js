
(function () {
    'use strict';

    angular.module('tasks.module').controller('PeterController', PeterController);

    PeterController.$inject = ['$scope'];

    function PeterController($scope) {

        function peter(input) {
            let temp = [];
            let output;
            let lastDigit = 0;

            for (var i = 0; i < input.toString().length; i++) {
                temp[i] = 0;
            }

            for (var i = 0; i < input.toString().length; i++) {
                output = +temp.join('');

                while (output <= input) {
                    lastDigit++;
                    for (var j = i; j < input.toString().length; j++) {
                        temp[j] = lastDigit;
                    }
                    output = +temp.join('');
                }
                lastDigit--;
                for (var j = i; j < input.toString().length; j++) {
                    temp[j] = lastDigit;
                }

            }

            output = +temp.join('');
            return output;

        }

        $scope.peter = peter;

        // peter(23245);
        // peter(11235888);
        // peter(111110);
        // peter(33245);

    }

})();