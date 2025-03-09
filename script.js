// Constants
const splashes = [];
const GRAVITY_THRESHOLD = 100;
const BASE_SPEED = 2;
const GRAVITY_MULTIPLIER = 1.5;
const MAX_REGULAR_SPLASHES = 15;
const STREAMLINE_SPEED = 1;
const MIN_POLYGON_SIDES = 3;

// Set up the canvas and context
const canvas = document.getElementById("colorCanvas");
const ctx = canvas.getContext("2d");

// Resize the canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the color picker input and buttons
const colorPicker = document.getElementById("colorPicker");
const randomColorButton = document.getElementById("randomColorButton");
const resetButton = document.getElementById("resetButton");

class ColorSplash {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.rgb = this.parseColor(color);
        this.dx = (Math.random() - 0.5) * BASE_SPEED;
        this.dy = (Math.random() - 0.5) * BASE_SPEED;
        this.polygonSides = this.calculatePolygonSides();
        this.angle = 0;
        this.streamlineAngle = 0;
    }

    calculatePolygonSides() {
        const lastDigit = this.rgb.b % 10;
        return Math.max(MIN_POLYGON_SIDES, lastDigit);
    }

    parseColor(color) {
        const rgb = color.match(/\d+/g);
        return {
            r: parseInt(rgb[0]),
            g: parseInt(rgb[1]),
            b: parseInt(rgb[2])
        };
    }

    getRGBTotal() {
        return this.rgb.r + this.rgb.g + this.rgb.b;
    }

    update() {
        if (splashes.length >= MAX_REGULAR_SPLASHES) {
            this.updateStreamlineMotion();
        } else {
            this.updateRegularMotion();
        }
    }

    updateStreamlineMotion() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        
        this.streamlineAngle += STREAMLINE_SPEED * 0.01;
        const angleStep = (2 * Math.PI) / splashes.length;
        const currentAngle = this.streamlineAngle + splashes.indexOf(this) * angleStep;
        
        this.x = centerX + radius * Math.cos(currentAngle);
        this.y = centerY + radius * Math.sin(currentAngle);
        this.angle += 0.02;
    }

    updateRegularMotion() {
        splashes.forEach(otherSplash => {
            if (otherSplash !== this && otherSplash.getRGBTotal() > GRAVITY_THRESHOLD) {
                const dx = otherSplash.x - this.x;
                const dy = otherSplash.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    this.dx += (dx / distance) * GRAVITY_MULTIPLIER;
                    this.dy += (dy / distance) * GRAVITY_MULTIPLIER;
                }
            }
        });

        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx *= -0.8;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy *= -0.8;
        }

        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
    }

    draw() {
        ctx.save();
        ctx.beginPath();

        if (splashes.length >= MAX_REGULAR_SPLASHES) {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            const sides = this.polygonSides;
            ctx.beginPath();
            ctx.moveTo(this.radius, 0);
            
            for (let i = 1; i <= sides; i++) {
                const angle = (i * 2 * Math.PI / sides);
                ctx.lineTo(
                    this.radius * Math.cos(angle),
                    this.radius * Math.sin(angle)
                );
            }
            
            ctx.closePath();
        } else {
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        }

        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

function createColorSplash(color) {
    if (splashes.length >= MAX_REGULAR_SPLASHES * 2) {
        splashes.shift();
    }
    
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = Math.random() * (canvas.height - 100) + 50;
    const splashRadius = Math.floor(Math.random() * 30) + 20;
    const splash = new ColorSplash(x, y, splashRadius, color);
    splashes.push(splash);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;
    
    if (splashes.length >= MAX_REGULAR_SPLASHES) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        splashes.forEach((splash, i) => {
            const nextSplash = splashes[(i + 1) % splashes.length];
            ctx.moveTo(splash.x, splash.y);
            ctx.lineTo(nextSplash.x, nextSplash.y);
        });
        ctx.stroke();
    }
    
    splashes.forEach(splash => {
        splash.update();
        splash.draw();
    });

    requestAnimationFrame(animate);
}

// Event Listeners
colorPicker.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    const rgbColor = hexToRgb(selectedColor);
    createColorSplash(`rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})`);
});

randomColorButton.addEventListener("click", () => {
    const randomColor = getRandomColor();
    colorPicker.value = rgbToHex(randomColor);
    createColorSplash(randomColor);
});

resetButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    splashes.length = 0;
});

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(rgb) {
    const color = rgb.match(/\d+/g);
    return "#" + ((1 << 24) + (parseInt(color[0]) << 16) + (parseInt(color[1]) << 8) + parseInt(color[2])).toString(16).slice(1);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();