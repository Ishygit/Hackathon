// Set up the canvas and context
const canvas = document.getElementById("colorCanvas");
const ctx = canvas.getContext("2d");

// Resize the canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the color picker input and the button
const colorPicker = document.getElementById("colorPicker");
const randomColorButton = document.getElementById("randomColorButton");

// Function to generate a random RGB color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

// Function to handle splash effect
function createColorSplash(color) {
    // Get the RGB values from the color
    const rgb = color.match(/\d+/g);
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);

    // Calculate position based on the RGB values (mod by width/height to keep it within bounds)
    const x = (r + g + b) % canvas.width;
    const y = (r * g * b) % canvas.height;

    // Draw the color splash as a circle
    const splashRadius = Math.floor(Math.random() * 30) + 20; // Random size for the splash
    ctx.beginPath();
    ctx.arc(x, y, splashRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

// Event listener for the color picker
colorPicker.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    createColorSplash(selectedColor);
});

// Event listener for the random color button
randomColorButton.addEventListener("click", () => {
    const randomColor = getRandomColor();
    colorPicker.value = randomColor; // Update the color picker to match the random color
    createColorSplash(randomColor);
});
