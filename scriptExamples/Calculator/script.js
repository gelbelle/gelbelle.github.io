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
    if (num <= 0) {
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
    let equalsPressed = equals.classList.contains("clicked");
    if (opClicked(calculator.operators)) {
        display.value = target.innerHTML;
        removeTag(["clicked"], calculator.operators);
    } else {
        display.value = (display.value === "0" || equalsPressed) ? target.innerHTML : display.value + target.innerHTML;
        equals.classList.remove("clicked");
    }
    calculator.displayChanged = true;
}

/**
 * Resets the calculator after previous operation
 * Displays 0 on the screen
 * Removes the "clicked" tag from the classlist for all operators and the equals button
 * 
 * @param {char[]} operators - An array containing all the operators of the functions the calculator performs
 */

const resetCalc = (operators) => {
    display.value = "0";
    equals.classList.remove(["clicked"]);
    operators.forEach(op => {
        op.classList.remove(["clicked"]);
    });
}

/**
 * Determines whether or not any of the operators have been clicked
 * 
 * @param {char[]} operators - An array containing all the operators of the functions the calculator performs
 * 
 * @return {bool} - Whether or not an operator is clicked
 */

const opClicked = (operators) => {
    return [...operators].filter(op => op.classList.contains("clicked")).length > 0;
}

/**
 * Removes the provided tags from all operators
 * 
 * @param {str[]} tags - An array containing all tags to be removed from the classlists of the operators
 * @param {char[]} operators - An array containing all the operators of the functions the calculator performs
 */

const removeTag = (tags, operators) => {
    tags.forEach(tag => operators.forEach(op => op.classList.remove(tags)));
}

/**
 * Determines whether or not a single operator is selected
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

    return numOps === 0;
}

/**
 * Performs the actual calculations determined by the user
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
            calculator.answered = true;
            ans = square(num1);
            break;
        case "\u221A":
            calculator.answered = true;
            if (num1 <= 0) ans = "NEG SQRT ERROR";
            else ans = Math.sqrt(num1);
            break;
        default:
            return "ERROR";
    }
    return ans;
}

/**
 * Checks to see if there are enough values in the toCalc list of the calculator to perform another complete operation.
 * If true - calculate is called and the answer returned, the previously used values are removed from the array, to new answer is added to the beginning of the array, and then getOp is called recursively
 * If false - The answer is returned
 * 
  * @param {calcSession} calculator - The instance of the current calcSession object
 * @param {int} ans - Defaults to 0 if a current total is not provided when calculate is called
 * 
 * @return {int} - The answer requested
 * @return {string} - An error message if appropriate
 */

const getOp = (calculator, ans = 0) => {
    if (calculator.toCalc.length >= 2) {
        ans = calculate(calculator, ans);
        calculator.toCalc.splice(0, 3)
        calculator.toCalc.unshift(ans);
        ans = getOp(calculator, ans);
    }
    return ans;
}

/**
 * Determines if only a single operator has been selected to account for users changing their minds on the operation they want to perform
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

const handleOperations = (target, calculator) => {
    if (!oneOp(calculator.operators)) {
        removeTag(["current"], calculator.operators);
        let idx = calculator.toCalc.length - 2;
        calculator.toCalc.splice(idx);
    };
    target.classList.add("current");

    if (opClicked(calculator.operators)) removeTag(["clicked"]);

    target.classList.add("clicked");
    calculator.toCalc.push(target.innerHTML);
    calculator.displayChanged = false;
    calculator.hasDecimal = false;
}

/**
 * Deals with square root and squaring function, functions that only require a single number.
 * 
 * @param {btn} target - The current button that has been clicked as an object
 * @param {calcSession} calculator - The instance of the current calcSession object
 */

const handleSingleNum = (target, calcSession) => {
    calcSession.toCalc.push(display.value);
    calcSession.toCalc.push(target.innerHTML);

    display.value = getOp(calcSession);
    calcSession.answered = true;

    calcSession.toCalc = [];
}

/**
 * Determines if there is already a decimal on the screen and does not allow a second decimal to be added
 * Sets hasDecimal to true;
 */
const handleDecimal = (target, calculator) => {
    if (!display.value.includes(target.innerHTML)) {
        display.value = (display.value === "0") ? "0." : display.value + target.innerHTML
    }
    calculator.hasDecimal = true;
}

/**
 * Determines whether or not the screen has changed prior to making the final calculation and checks to see if there are three values in the toCalc array.
 * Calls getOp to perform the calculation selected by the user
 */

const getAnswer = (calculator) => {
    if (calculator.displayChanged) calculator.toCalc.push(display.value);
    if (calculator.toCalc.length >= 3) display.value = getOp(calculator);
    else return;
    removeTag(["clicked", "current"], calculator.operators);
    equals.classList.add("clicked");
    calculator.toCalc = [];
    calculator.answered = true;
}

/**
 * Creates the current calcSession, opulates an array containing all the button objects of the calculator
 * Dynamically processes the buttons clicked by the user by adding the "click" eventlistener and calling the appropriate functions based on which button was selected.
 */

const main = () => {
    let calcSession = {
        toCalc: [],
        hasDecimal: false,
        displayChanged: false,
        answered: false,
        operators: document.querySelectorAll(".ops"),
        display: document.getElementById("display")
    }

    const allBtns = document.getElementById("buttons");

    resetCalc(calcSession.operators);

    allBtns.addEventListener("click", (evt) => {

        const { target } = evt;
        if (!target.matches("button")) return;

        if (target.classList.contains("number")) {
            if (calcSession.answered) {
                display.value = "";
                calcSession.answered = false;
            }
            updateDisplay(target, calcSession);
        }

        if (target.classList.contains("single")) {
            handleSingleNum(target, calcSession);
        } else {
            if (target.classList.contains("ops")) {
                calcSession.toCalc.push(display.value);
                if (!calcSession.answered) handleOperations(target, calcSession);
                else calcSession.toCalc.push(target.innerHTML);
            }
        }

        if (target.innerHTML === ".") {
            handleDecimal(target, calcSession);
        }

        if (target.id === "equals") {
            getAnswer(calcSession);
        }

        if (target.id === "clear") resetCalc(calcSession.operators);
    });
}

main();