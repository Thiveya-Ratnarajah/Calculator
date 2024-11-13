// Grab DOM elements
let display = document.querySelector('.large-display');
let buttons = document.querySelectorAll('button');
let firstOperand = null;
let currentOperator = null;
let currentInput = "";
const clickSound = new Audio("click.mp3"); // Initialize click sound

// Load the click sound
clickSound.load();  // Preload audio to avoid delays

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    let isDarkMode = document.body.classList.contains("dark-mode");
    let buttonText = isDarkMode ? "🌕 Light Mode" : "🌙 Dark Mode";
    document.getElementById("dark-mode-toggle").textContent = buttonText;
}

// Function to play click sound on button press
function playClickSound() {
    clickSound.play().catch(error => {
        console.error("Audio playback failed: ", error);
    });
}

// Function to calculate the result based on the operator
function calculateResult() {
    switch (currentOperator) {
        case '+':
            return firstOperand + parseFloat(currentInput);
        case '-':
            return firstOperand - parseFloat(currentInput);
        case '*':
            return firstOperand * parseFloat(currentInput);
        case '/':
            return firstOperand / parseFloat(currentInput);
        default:
            return parseFloat(currentInput);
    }
}

// Handle number and operator buttons
buttons.forEach(button => {
    button.addEventListener("click", () => {
        playClickSound();  // Play sound on button click
        let value = button.textContent;

        if (button.classList.contains("clear")) {
            // Clear the display and reset
            display.value = "";
            firstOperand = null;
            currentOperator = null;
            currentInput = "";
        } else if (!isNaN(value) || value === ".") { 
            // If a number or decimal is clicked, build the current input
            currentInput += value;
            display.value = currentInput;
        } else if (value === "=") { 
            // If equals is clicked, perform the calculation
            if (currentOperator && currentInput) {
                let result = calculateResult();
                display.value = result;

                // Update history
                let historyItem = `${firstOperand} ${currentOperator} ${currentInput} = ${result}`;
                let newHistory = document.createElement("div");
                newHistory.textContent = historyItem;
                history.prepend(newHistory);
                history.style.display = "block";

                firstOperand = result; // Store the result as the first operand for the next calculation
                currentOperator = null;
                currentInput = ""; // Clear current input for the next entry
            }
        } else { 
            // Operator button clicked
            if (currentInput || firstOperand !== null) {
                if (firstOperand === null) {
                    firstOperand = parseFloat(currentInput);
                } else if (currentOperator) {
                    firstOperand = calculateResult();
                    display.value = firstOperand;
                }

                // Map the operators to lowercase
                currentOperator = value === "÷" ? "/" :
                                  value === "×" ? "*" :
                                  value === "−" ? "-" : value;

                // Display the operator in lowercase
                display.value += " " + currentOperator.toLowerCase(); // Show operator in lowercase
                currentInput = ""; // Clear input for next number entry
            }
        }
    });
});