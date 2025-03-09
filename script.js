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

const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
    // Clear the canvas context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If using Pixi.js, also clear the stage
    if (app) {
        splashContainer.removeChildren();
    }
});


// Create a new Pixi application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    resolution: window.devicePixelRatio || 1,
});

document.body.appendChild(app.view);

// Create a brush cursor effect
const brush = new PIXI.Graphics();
let currentColor = 0x000000;

// Update brush position with mouse
app.stage.interactive = true;
app.stage.on('mousemove', (e) => {
    const { x, y } = e.data.global;
    brush.clear();
    brush.beginFill(currentColor, 0.3);
    brush.drawCircle(x, y, 20);
    brush.endFill();
});

app.stage.addChild(brush);

// Update color picker integration
document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = parseInt(e.target.value.replace('#', '0x'));
});