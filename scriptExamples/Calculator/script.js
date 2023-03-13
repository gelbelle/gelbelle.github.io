/**
 * This program creates a basic calculator with addition, subtraction, multiplication, division, square, and squareroot functions.
 * @author Angeleah Hoeppner
 * @date January 18, 2023
 * @version 1.0
 */

/**
 * Performs basic addition
 * 
 * @param {int} num1 - Number to add to the second
 * @param {int} num2 - Number to add to the first
 * 
 * @return {int} - The sum of num1 and num2
 */

const add = (num1, num2) => {
    return num1 + num2;
}

/**
 * Performs basic subtraction
 * 
 * @param {int} num1 - Number to subtract the second one from
 * @param {int} num2 - Number to subtract from the first
 * 
 * @return {int} - The result of the second number subtracted from the first
 */

const subtract = (num1, num2) => {
    return num1 - num2;
}

/**
 * Performs basic multiplication
 * 
 * @param {int} num1 - Number to multiply the second by
 * @param {int} num2 - Number to multiply the first by
 * 
 * @return {int} - The result of the first and second numbers being multiplied together
 */

const multiply = (num1, num2) => {
    return num1 * num2;
}

/**
 * Performs basic division
 * 
 * @param {int} num1 - Number to divide be divided by the second number
 * @param {int} num2 - Number to divide the first number by
 * 
 * @return {int} - The result of the first number being divided by the second
 * @return {string} - Divide by 0 error message if the second number if a 0
 */

const divide = (num1, num2) => {
    if (num2 === 0) {
        return "DIV BY 0 ERR";
    } else {
        return num1 / num2;
    }
}

/**
 * Squares the number given
 * 
 * @param {int} num - Number to square
 * 
 * @return {int} - The result of the number being squared
 */

const square = (num) => {
    return Math.pow(num, 2);
}

/**
 * Performs the square root fuction
 * 
 * @param {int} num - Number to find the square root of
 * 
 * @return {int} - The square root of the given number
 * @return {string} - Negative square root error
 */
const squareRoot = (num) => {
    if (num < 0) {
        return "NEG SQ RT ERR";
    } else {
        return Math.sqrt(num);
    }
}

/**
 * Checks whether or not an operator has been clicked and then updates the screen accordingly
 * If an operator has been selected then the display screen will show the next number entered, it removed the "clicked" tag from the operator
 * If an operator has not been selected then it checks to see if the screen is showing a 0 or if equals has been pressed. In both these cases the screen will simply display the next number clicked. If these are both false then the screen will show what was on it before and the new number clicked.
 * It flags that the display as changed
 * 
 * @param {btn} target - The current button that has been clicked as an object
 * @param {calcSession} calculator - The instance of the current calcSession object
 */

const updateDisplay = (target, calculator) => {
    console.log("Content to be added")
}

/**
 * Resets the calculator after previous operation
 * Displays 0 on the screen
 * Removes the "clicked" tag from the classlist for all operators and the equals button
 * 
 * @param {char[]} operators - An array containing all the operators of the functions the calculator performs
 */

const resetCalc = (operators, calculator) => {
    display.value = "0";
    equals.classList.remove(["clicked"]);
    operators.forEach(op => {
        op.classList.remove(["clicked"]);
    });
    calculator.answered = false;
    calculator.prevDisplay = 0;
    calculator.displayChanged = false;
    calculator.prevVals = [];
    calculator.toCalc = [];
    calculator.hasSingle = false;
}

/** Determines whether or not any of the operators have been clicked
 * 
 * @param {char[]} operators - An array containing all the operators of the functions the calculator performs
 * 
 * @return {bool} - Whether or not an operator is clicked
 */

const opClicked = (operators) => {
    return [...operators].filter(op => op.classList.contains("clicked")).length > 0;
}

/** Removes the provided tags from all operators
 * 
 * @param {str[]} tags - An array containing all tags to be removed from the classlists of the operators
 * @param {char[]} operators - An array containing all the operators of the functions the calculator performs
 */

const removeTag = (tags, operators) => {
    tags.forEach(tag => operators.forEach(op => op.classList.remove(tag)));
}

/** Determines whether or not a single operator is selected
 * 
 * @param {char[]} operators - An array containing all the operators of the functions the calculator performs
 * 
 * @return {bool} - Whether or not a single operator has been clicked
 */

const oneOp = (operators) => {
    let numOps = 0;
    operators.forEach(item => {
        if (item.classList.contains("current")) numOps++
    });
    console.log(`Num operators: ${numOps}`);
    return numOps === 1;
}

/** Performs the actual calculations determined by the user
 * 
 * @param {calcSession} calculator - The instance of the current calcSession object
 * @param {int} ans - Defaults to 0 if a current total is not provided when calculate is called
 * 
 * @return {int} - The answer requested
 * @return {string} - An error message if appropriate
 */

const calculate = (calculator, ans = 0) => {
    let num1 = Number(calculator.toCalc[0]);
    let operation = calculator.toCalc[1];
    let num2 = Number(calculator.toCalc[2]);
    switch (operation) {
        case "x":
            ans = multiply(num1, num2);
            break;
        case "\xF7":
            ans = divide(num1, num2);
            break;
        case "+":
            ans = add(num1, num2);
            break;
        case "-":
            ans = subtract(num1, num2);
            break;
        case "X<sup>2</sup>":
            ans = square(num1);
            break;
        case "\u221A":
            ans = squareRoot(num1);
            break;
        default:
            return `ERROR ${calculator.toCalc}`;
    }
    return ans;
}

/** Checks to see if there are enough values in the toCalc list of the calculator to perform another complete operation.
 * If true - calculate is called and the answer returned, the previously used values are removed from the array, the new answer is added to the beginning of the array, and then getOp is called recursively
 * If false - The answer is returned
 * 
 * @param {calcSession} calculator - The instance of the current calcSession object
 * @param {int} ans - Defaults to 0 if a current total is not provided when calculate is called
 * 
 * @return {int} - The answer requested
 * @return {string} - An error message if appropriate
 */

const getOp = (calculator, ans = 0) => {
    console.log(calculator.toCalc);
    if (calculator.toCalc.length >= 3) {
        ans = calculate(calculator, ans);
        calculator.toCalc.splice(0, 3)
        calculator.toCalc.unshift(ans);
        ans = getOp(calculator, ans);
    } else if (calculator.toCalc.length === 2) {
        console.log(`Length is 2: ${calculator.toCalc}`);
        ans = calculate(calculator, ans);
        calculator.toCalc = [];
        calculator.toCalc[0] = ans;
    }
    console.log(calculator.toCalc);

    return ans;
}

//TODO Fix function description
/** Determines if only a single operator has been selected to account for users changing their minds on the operation they want to perform
 * False - Removes the "current" tag from the classList of the selected operator and removes the previously selected operator from the toCalc array.
 * True - Adds current to the currently selected operator
 * True - If there is an operator tagged "clicked" it removes this tag from it
 * True - Adds "clicked" to the classlist of the currently selected operator
 * True - Adds the operator to the toCalc array for processing
 * True - Sets hasDecimal to false
 * 
 * @param {btn} target - The current button that has been clicked as an object
 * @param {calcSession} calculator - The instance of the current calcSession object
 */

//TODO Correct to display answer on screen if the person has selected a second operator in the equation eg: 5+3-2. Should display 8 after the - is clicked.
const handleOperations = (target, calculator) => {
    //COMPLETE watch to see if this breaks operators or not, could solve the changing operator problem easily
    calculator.prevDisplay = calculator.display.value;
    calculator.displayChanged = false;
    if (calculator.toCalc.length === 3) calculator.answered = true;
    if (calculator.answered) {
        calculator.display.value = getAnswer(calculator);
    }
    calculator.answered = false;
    target.classList.add("current")
    console.log(calculator)
    if (oneOp(calculator.operators)) {
        console.log(`One op ${calculator.toCalc}`);
        calculator.toCalc.push(calculator.display.value);
        calculator.toCalc.push(target.innerHTML);
    } else {
        console.log(`Not one op ${calculator.toCalc}`);
        calculator.toCalc[1] = target.innerHTML;
        console.log(calculator);
    }
    removeTag(["clicked", "current"], calculator.operators);
    target.classList.add("clicked");
}

/** Deals with square root and squaring function, functions that only require a single number.
 * 
 * @param {btn} target - The current button that has been clicked as an object
 * @param {calcSession} calculator - The instance of the current calcSession object
 */

const handleSingle = (operator, calculator) => {
    calculator.toCalc = [];
    console.log(`Single ${calculator.toCalc}`);
    calculator.toCalc[0] = Number(calculator.display.value);
    calculator.toCalc[1] = operator;
    calculator.answered = true;
    calculator.displayChanged = true;
    return getOp(calculator);
}

/** Determines if there is already a decimal on the screen and does not allow a second decimal to be added
 * Sets hasDecimal to true;
 */
const handleDecimal = (target, calculator) => {
    if (!calculator.answered) {
        if (!calculator.display.value.includes(target) || calculator.lastPressed.classList.contains("ops")) {
            if (calculator.displayChanged) {
                return (calculator.display.value === "0") ? "0." : calculator.display.value + ".";
            } else {
                calculator.displayChanged = true;
                return "0."
            }
        }
    } else return "0.";
}

const flagOperator = (toFind, operators) => {
    console.log("Content to be added")
}

/** Determines if the problem has already been answered. If it is and it is a single number operator like square or square root it doesn't change the display screen.
 * It sets the first digital to be operated on to the current display for further calculations. If it hasn't been answered already it resets the previous values and adds the current value to the list to perform an operator on.
 * Calls getOp to perform the calculation selected by the user
 * Stores the answer in the previous values for further manipulation if needed. Sets the displayChanged and answered flags to true.
 * 
 * @param {calcSession} calculator - The instance of the current calcSession object
 * 
 * @return {num} - The answer to the current calculation. This could be an int or a float
 */

const getAnswer = (calculator) => {
    let ans;
    if (calculator.answered) {
        console.log(calculator.toCalc);
        if (calculator.hasSingle) {
            console.log("Found square");
            ans = getOp(calculator);
        }
        calculator.toCalc[0] = calculator.display.value;
    } else {
        calculator.prevVals = [];

        calculator.toCalc.push(calculator.display.value);

        //Add the operator and the current number to prevVals to repeat operation on successive answers
        calculator.prevVals[1] = (calculator.toCalc[1]);
        calculator.prevVals[2] = (calculator.display.value)
        console.log({ calculator });
    }

    ans = getOp(calculator);
    calculator.prevVals[0] = ans;
    console.log(calculator.prevVals);
    calculator.toCalc = calculator.prevVals.map(val => val);
    console.log(calculator.toCalc);
    calculator.displayChanged = true;
    console.log({ calculator });
    calculator.answered = true;
    calculator.hasSingle = false;
    return ans;
}

//TODO Fix function description
const handleNumber = (num, calculator) => {
    if (!opClicked(calculator.operators)) {
        if (!calculator.answered) {
            if (calculator.display.value === "0") {
                calculator.prevDisplay = num;
                return num;
            } else return calculator.display.value + num;
        } else {
            calculator.answered = false;
            calculator.prevDisplay = calculator.display.value;
            return calculator.display.value;
        }
    } else {
        removeTag(["clicked"], calculator.operators);
        console.log(calculator);
        if (calculator.display.value == calculator.prevDisplay) {
            return num;
        } else if (calculator.display.value.includes(".")) {
            return calculator.display.value + num;
        } else return num;
    }
}

/** Creates the current calcSession, opulates an array containing all the button objects of the calculator
 * Dynamically processes the buttons clicked by the user by adding the "click" eventlistener and calling the appropriate functions based on which button was selected.
 */

const main = () => {
    let calcSession = {
        toCalc: [],
        answered: false,
        operators: document.querySelectorAll(".ops"),
        display: document.getElementById("display"),
        prevVals: [],
        prevDisplay: 0,
        displayChanged: false,
        hasSingle: false,
        lastPressed: []
    }

    const allBtns = document.getElementById("buttons");

    resetCalc(calcSession.operators, calcSession);

    allBtns.addEventListener("click", (evt) => {
        console.log(calcSession);
        const { target } = evt;
        //console.log(target);
        if (!target.matches("button")) return;

        if (target.classList.contains("number")) {
            calcSession.display.value = handleNumber(Number(target.innerHTML), calcSession);
            calcSession.displayChanged = true;
        }

        if (target.classList.contains("single")) {
            console.log("Single")
            calcSession.display.value = handleSingle(target.innerHTML, calcSession);
            calcSession.displayChanged = true;
            calcSession.hasSingle = true;
            removeTag(["clicked"], calcSession.operators)
        } else if (target.classList.contains("ops")) {
            calcSession.hasSingle = false;
            handleOperations(target, calcSession);
            console.log(target);
        }

        if (target.innerHTML === ".") {
            console.log(calcSession);
            calcSession.display.value = handleDecimal(target.innerHTML, calcSession);
            calcSession.displayChanged = false;
            calcSession.hasSingle = false;
        }

        //COMPLETE Enable operations on answers once equals is pushed
        if (target.id === "equals") {
            calcSession.display.value = getAnswer(calcSession);
        }

        if (target.id === "clear") resetCalc(calcSession.operators, calcSession);
        calcSession.lastPressed = target;

    });
}

main();