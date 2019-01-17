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

        function resolve(math) {

            var myArray;
            var isReady = false;

            math = math.replace(/\(/g, '');
            math = math.replace(/\)/g, '');
            math = math.replace(/\+\+/g, '+');

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

        function calculate(math) {

            var myArray;

            math = math.replace(/\s/g, '');
            math = math.replace(/\s/g, '');

            do {

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