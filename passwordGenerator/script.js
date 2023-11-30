const inputslider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%^&*()_-+={}[]|/:;',.?/";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey

//set passwordlength a/q slider
function handleSlider() {
  inputslider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputslider.min;
  const max = inputslider.max;
  inputslider.style.backgroundSize =
    ((inputslider.value - min) * 100) / (max - min) + "% 100%";
}

inputslider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

async function copyContent() {
  try {
    if (password === "") {
      alert("First Generate Password to copy");
      throw "Failed";
    }
    await navigator.clipboard.writeText(password);
    copyMsg.innerText = "Copied";
  } catch (error) {
    copyMsg.innerText = "Failed";
  }
  //   to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

copyBtn.addEventListener("click", () => {
  // if (passwordDisplay.value)
  copyContent();
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color} `;
}

setIndicator("#ccc");

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasLower && hasUpper && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

//shuffle funtion
function shufflePassword(array) {
  //Fihser Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected

  if (checkCount <= 0) {
    alert("Atleast check one checkbox");
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //let start to jourmey to find new passsword
  //remove old password
  // console.log("Start gnerating");

  password = "";

  let funArr = [];
  if (uppercaseCheck.checked) funArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funArr.push(generateLowerCase);

  if (symbolsCheck.checked) funArr.push(generateSymbol);

  if (numbersCheck.checked) funArr.push(generateRandNumber);

  //compulsory addtion

  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }
  // console.log("compulsory addition done");

  //remaining addition
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randIndex = getRndInteger(0, funArr.length);
    password += funArr[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in UI
  passwordDisplay.value = password;
  console.log("passwod :", password);

  //calculate Strength
  calcStrength();
});
