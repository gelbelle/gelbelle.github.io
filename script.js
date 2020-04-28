let output = document.getElementById("output");

output.innerHTML = "Project will display here";

function clearOutput() {
  output.innerHTML = "";
  output.style.fontFamily = "inherit";
}

function addClickHandler(elId, funcName) {
  document.getElementById(elId).addEventListener("click", clearOutput);
  document.getElementById(elId).addEventListener("click", funcName);
}

function loopTriangle(times) {
  for (let i = 1; i <= times; i++) {
    output.innerHTML += "#".repeat(i) + "<br>";
  }
}

addClickHandler("project21", () => {
  loopTriangle(7);
});

function fizzBuzz() {
  let newStr = [];
  for (let i = 0; i <= 100; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
      newStr.push("FizzBuzz");
    } else if (i % 3 == 0) {
      newStr.push("Fizz");
    } else if (i % 5 == 0) {
      newStr.push("Buzz");
    } else {
      newStr.push(i);
    }
  }
  output.innerHTML = newStr.join(", ");
}

addClickHandler("project22", fizzBuzz);

function chessboard(size) {
  output.style.fontFamily = "monospace";
  let grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      if ((i + j) % 2 === 0) {
        grid[i][j] = ".";
      } else {
        grid[i][j] = "x";
      }
    }
    output.innerHTML += grid[i].join("") + "<br>";
  }
}

//document.getElementById("project33").addEventListener("click", clearOutput);
addClickHandler("project23", () => {
  chessboard(8);
});

function getMin(x, y) {
  return Math.min(x, y);
}

addClickHandler("project31", () => {
  let min = getMin(3, 9);
  output.innerHTML = `The smallest value is ${min}`;
});

function isEven(num) {
  if (num < 0) {
    output.innerHTML = `You must enter a number greater than or equal to 0.`;
  }
  if (num == 0) {
    output.innerHTML = `Your number is even`;
  } else if (num == 1) {
    output.innerHTML = `Your number is odd`;
  } else {
    isEven(num - 2);
  }
}

addClickHandler("project32", () => {
  isEven(26);
});

function countChar(letter, word) {
  let times = 0;
  for (let i = 0; i < word.length; i++) {
    //output.innerHTML += ` Letter: ${letter} Word: ${word[i]} `;
    if (word[i] == letter) {
      times++;
    }
  }
  output.innerHTML = `The letter ${letter} appeared ${times} times in ${word}`;
}

addClickHandler("project33", () => {
  countChar("k", "kakkerlak");
});

function range(start, end, step = 1) {
  let numbers = [];

  if (step > 0 && start > end) {
    step = -step;
  }

  if (start > end) {
    for (let i = start; i >= end; i += step) {
      numbers.push(i);
    }
  }

  for (let i = start; i <= end; i += step) {
    numbers.push(i);
  }
  return numbers;
}

function sum(numbers) {
  let total = 0;
  for (num in numbers) {
    total += numbers[num];
  }
  output.innerHTML += ` Your total is ${total}`;
}

addClickHandler("project41", () => {
  sum(range(1, 10, 2));
});

function reverseArray(array) {
  let newArray = [];
  for (let i = array.length; i >= 0; i--) {
    newArray.push(array[i]);
  }
  output.innerHTML = newArray.join(" ");
}

addClickHandler("project42a", () => {
  reverseArray(["A", "B", "C"]);
});

function reverseArrayInPlace(array) {
  let temp = "";
  let end = array.length - 1;
  for (let i = 0; i <= end / 2; i++) {
    temp = array[i];
    array[i] = array[end - i];
    array[end - i] = temp;
  }
  output.innerHTML += `Your reversed array is ${array.join(" ")}`;
}

addClickHandler("project42b", () => {
  reverseArrayInPlace(["A", "B", "C"]);
});

function arrayToList(array) {
  output.innerHTML += `Passed array ${array} <br>`;
  let list = {};
  if (array.length >= 1) {
    for (let i = 0; i < array.length; i++) {
      list.value = array[0];
      array.shift();
      list.rest = arrayToList(array);
    }
  }
  output.innerHTML += `${list.value}: ${list.rest} `;
}

addClickHandler("project43a", () => {
  arrayToList([10, 20, 30]);
});
