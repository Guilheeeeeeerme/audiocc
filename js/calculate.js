(function () {
    'use strict';

    angular.module('tasks.module').controller('CalculateController', CalculateController);

    CalculateController.$inject = ['$scope'];

    function CalculateController($scope) {
        const has_parenthesis = /\(([\d,.,\+,\-,\*,\\])+\)/g

        $scope.points = [];

        for(var i = -500; i < 500 ; i = i + 10) {
            $scope.points.push(i);
        }

        /**
         * 
         * @param {*} math simple expressions without paranthesis to be solved 
         */
        function resolve(math) {

            var myArray;
            var isReady = false;

            /**
             * Removing useless stuff
             */
            math = math.replace(/\(/g, '');
            math = math.replace(/\)/g, '');
            math = math.replace(/\+\+/g, '+');

            /**
             * First try * and /
             * Later try + and -
             */
            const priority = [
                /([+-]?)(\d+(\.\d+)?)([/*])([+-]?)(\d+(\.\d+)?)/g,
                /([+-]?)(\d+(\.\d+)?)([+-])([+-]?)(\d+(\.\d+)?)/g
            ];

            while (!isReady) {

                isReady = true;

                for (const i in priority) {
                    const regex = priority[i];

                    while ((myArray = regex.exec(math)) !== null) {

                        const expression = myArray[0];

                        if (!isNaN(expression))
                            break;

                        let result;
                        const operator = expression.split(regex)[4];
                        let valueA = expression.split(regex)[1] + '' + expression.split(regex)[2];
                        let valueB = expression.split(regex)[5] + '' + expression.split(regex)[6];

                        valueA = +valueA;
                        valueB = +valueB;

                        isReady = false;

                        if (operator == '*') {
                            result = valueA * valueB;
                        } else if (operator == '/') {
                            result = valueA / valueB;
                        } else if (operator == '+') {
                            result = valueA + valueB;
                        } else {
                            result = valueA - valueB;
                        }

                        math =
                            math.substr(0, myArray.index) +
                            ((result < 0) ? '' : '+') + result +
                            math.substr(myArray.index + expression.length);


                    }

                }

            }

            return math;
        }

        /**
         * @param {*} the math formula as string 
         */
        function calculate(math) {

            var myArray;

            // remove white spaces
            math = math.replace(/\s/g, '');
            math = math.replace(/\s/g, '');

            do {
                /**
                 * Find deep expressions between parenthesis
                 * These expression are solved and then replaced
                 * on the formula
                 * For instance:
                 * Loop 1: ( 1 + ( 2 + 3 ) )
                 * Loop 2: ( 1 + 5 )
                 * Loop 3: ( 6 )
                 */
                while ((myArray = has_parenthesis.exec(math)) !== null) {
                    const expression = myArray[0];
                    const result = resolve(expression);

                    math =
                        math.substr(0, myArray.index) +
                        ((result < 0) ? '' : '+') + result +
                        math.substr(myArray.index + expression.length);
                }

            } while (math.match(has_parenthesis));

            return resolve(math);
        }

        function do_line(line, point){
            line = line.replace(/x/g, point);
            console.log(point, +calculate(line));
            return +calculate(line);
        }

        $scope.calculate = calculate;
        $scope.do_line = do_line;

        // console.log(calculate('2 * 3 + 10.5 / 8'));
        // console.log((2 * 3 + 10.5 / 8));
        // console.log(calculate('(+2.5 * -3.5) + 10 / 8'));
        // console.log(((+2.5 * -3.5) + 10 / 8));
        // console.log(calculate('(2 * 3 + 10) / 8'));
        // console.log(((2 * 3 + 10) / 8));
        // console.log(calculate('2 * (3 + 10) / 8'));
        // console.log((2 * (3 + 10) / 8));
    

    }

})();