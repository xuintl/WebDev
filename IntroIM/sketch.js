// A. GLOBAL VARIABLES

// Game State
let gameState = 'start'; // 'start', 'input', 'loading', 'capture', 'journey', 'end'

// INTEGRATION of Glitch server URL ---
const serverUrl = 'https://synthestry-server.onrender.com';

// User Input & AI Generation
let regionInput = 'Chinese';
let genderInput = 'Male';
let ageInput = '20s';
let currentInputFocus = 0;
const ageOptions = ["20s", "30s", "40s and above"];

// Assets
let webcam;
let playerPhoto;
let transitionSheet;
let transitionFrames = [];

const themeColor = [255, 210, 64]; // A nice gold/yellow color

// Gameplay
let currentStep = 0;
const narrativeText = [
  "This is you, a single moment in time.",
  "But within you are the echoes of a thousand years.",
  "A story told in the lines of a face you've never met.",
  "A connection to a place, a people, a past.",
  "This is the echo of your heritage."
];

// B. P5.JS CORE FUNCTIONS

function setup() {
  createCanvas(800, 600);
  webcam = createCapture(VIDEO);
  webcam.size(width, height);
  webcam.hide();
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(20, 20, 30);
  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'input') {
    drawInputScreen();
  } else if (gameState === 'loading') {
    drawLoadingScreen();
  } else if (gameState === 'capture') {
    drawCaptureScreen();
  } else if (gameState === 'journey') {
    drawJourneyScreen();
  } else if (gameState === 'end') {
    drawEndScreen();
  }
}

// C. EVENT HANDLERS

function mousePressed() {
  if (gameState === 'start') {
    gameState = 'input';
  } else if (gameState === 'input') {
    // Check for "Weave My Echo" button click
    if (mouseX > 250 && mouseX < 550 && mouseY > 430 && mouseY < 480) {
      // --- CHANGED: Move to capture screen first ---
      gameState = 'capture';
    }
    // Check for input field clicks to change focus
    if (mouseY > 120 && mouseY < 170) currentInputFocus = 0; // Adjusted Y
    if (mouseY > 220 && mouseY < 270) currentInputFocus = 1; // Adjusted Y

    // Check for age option clicks
    for (let i = 0; i < ageOptions.length; i++) {
        let buttonX = 150 + i * 170;
        let buttonY = 320; // Adjusted Y
        let buttonW = 160;
        let buttonH = 50;
        if (mouseX > buttonX && mouseX < buttonX + buttonW && mouseY > buttonY && mouseY < buttonY + buttonH) {
            ageInput = ageOptions[i];
        }
    }
  } else if (gameState === 'capture') {
    // --- CHANGED: Take photo, THEN start the API call ---
    playerPhoto = webcam.get();
    startGeneration();
  } else if (gameState === 'end') {
    resetGame();
  }
}

function keyPressed() {
  if (gameState === 'input') {
    handleTextInput();
  } else if (gameState === 'journey') {
    if (keyCode === 32) { // Spacebar
      currentStep++;
      if (currentStep >= narrativeText.length) {
        gameState = 'end';
      }
    }
  }
}

// D. DRAWING FUNCTIONS (for each game state)

function drawStartScreen() {
  fill(255);
  textSize(48);
  text("Ancestry Echo", width / 2, height / 2 - 40);
  textSize(24);
  text("Click anywhere to begin.", width / 2, height / 2 + 40);
}

function drawInputScreen() {
  // Draw labels
  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("Region of Heritage:", 150, 100);
  text("Gender Identity:", 150, 200);
  text("Age Group:", 150, 300);

  // Draw text input boxes
  drawTextBox(regionInput, 150, 120, 500, 50, currentInputFocus === 0);
  drawTextBox(genderInput, 150, 220, 500, 50, currentInputFocus === 1);

  // Draw age selection buttons
  for (let i = 0; i < ageOptions.length; i++) {
    let isSelected = (ageInput === ageOptions[i]);
    drawAgeButton(ageOptions[i], 150 + i * 170, 320, 160, 50, isSelected);
  }

  // Draw "Weave My Echo" button
  fill(...themeColor);
  noStroke();
  rect(250, 430, 300, 50, 10);
  fill(0); // Black text for better contrast on yellow
  textSize(28);
  textAlign(CENTER, CENTER);
  text("Weave My Echo", 400, 455);
}

function drawLoadingScreen() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Weaving your echo...", width / 2, height / 2 - 20);
  textSize(16);
  text("This may take a minute.", width / 2, height / 2 + 20);
}

function drawCaptureScreen() {
  push();
  translate(width, 0);
  scale(-1, 1);
  image(webcam, 0, 0, width, height);
  pop();
  fill(0, 180);
  rect(0, height - 80, width, 80);
  fill(255);
  textSize(32);
  text("Position your face and click to capture.", width / 2, height - 40);
}

function drawJourneyScreen() {
  if (currentStep === 0) {
    if (playerPhoto) image(playerPhoto, 0, 0, width, height);
  } else {
    if (transitionFrames[currentStep - 1]) {
        image(transitionFrames[currentStep - 1], 0, 0, width, height);
    }
  }
  // Text overlay
  fill(0, 150);
  noStroke();
  rect(0, height - 120, width, 120);
  fill(255);
  textSize(24);
  text(narrativeText[currentStep], width / 2, height - 70); // Adjusted Y
  textSize(16);
  fill(200);
  text("Press SPACE to continue", width/2, height - 30); // Adjusted Y
}

function drawEndScreen() {
    if (transitionFrames[3]) image(transitionFrames[3], 0, 0, width, height);
    fill(0, 150);
    rect(0, height - 120, width, 120);
    fill(255);
    textSize(28);
    text("This is your echo.", width / 2, height - 75);
    textSize(20);
    text("Click to explore again.", width / 2, height - 35);
}

// E. HELPER FUNCTIONS

async function startGeneration() {
  gameState = 'loading';
  currentStep = 0;

  console.log(`Sending request to server with: ${regionInput}, ${genderInput}, ${ageInput}`);

  let data = {
    region: regionInput.trim(),
    gender: genderInput.trim(),
    age: ageInput.trim()
  };

  try {
    // 1. Use fetch to make the POST request
    const response = await fetch(`${serverUrl}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convert our JS object to a JSON string
    });

    // 2. Check if the server responded with an error
    if (!response.ok) {
      // Get more detail from the server's error response if possible
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    // 3. If the response is OK, read the JSON data from the stream
    // The .json() method handles the ReadableStream for us!
    const result = await response.json();

    console.log("Received image data from server!");

    // 4. Load the image from the Base64 data URI
    transitionSheet = loadImage(result.imageData, () => {
      console.log("Image successfully loaded!");
      cropFrames();
      gameState = 'journey'; // Start the story!
    }, (err) => {
      console.error("Failed to load the generated image from data:", err);
      alert("Error: Could not load the generated image.");
      gameState = 'input';
    });

  } catch (error) {
    console.error("An error occurred during the fetch operation:", error);
    alert(`An error occurred: ${error.message}. Please check the server and try again.`);
    gameState = 'input'; // Go back to input screen on error
  }
}

function cropFrames() {
  transitionFrames = [];
  let frameWidth = transitionSheet.width / 4;
  let frameHeight = transitionSheet.height;
  for (let i = 0; i < 4; i++) {
    let frame = transitionSheet.get(i * frameWidth, 0, frameWidth, frameHeight);
    transitionFrames.push(frame);
  }
  console.log("Cropped 4 frames.");
}

function handleTextInput() {
    // Allow spaces in text input
    if (keyCode === BACKSPACE) {
        if (currentInputFocus === 0 && regionInput.length > 0) {
            regionInput = regionInput.slice(0, -1);
        } else if (currentInputFocus === 1 && genderInput.length > 0) {
            genderInput = genderInput.slice(0, -1);
        }
    } else if (keyCode === TAB) {
        currentInputFocus = (currentInputFocus + 1) % 2;
    } else if (key.length === 1 && key.match(/^[a-zA-Z\s]*$/)) { // Allow letters and spaces
        if (currentInputFocus === 0) {
            regionInput += key;
        } else if (currentInputFocus === 1) {
            genderInput += key;
        }
    }
}


function drawTextBox(txt, x, y, w, h, isFocused) {
  noFill();
  if (isFocused) {
    stroke(...themeColor); strokeWeight(3);
  } else {
    stroke(150); strokeWeight(1);
  }
  rect(x, y, w, h, 5);
  noStroke();
  fill(255);
  textSize(24);
  textAlign(LEFT, CENTER);
  text(txt, x + 15, y + h / 2);
  // Blinking cursor
  if (isFocused && frameCount % 60 < 30) {
      let textW = textWidth(txt);
      fill(255);
      rect(x + 15 + textW, y + 10, 2, h - 20);
  }
  textAlign(CENTER, CENTER);
}

function drawAgeButton(txt, x, y, w, h, isSelected) {
  noStroke();
  if (isSelected) {
    fill(...themeColor);
  } else {
    fill(50, 50, 60);
  }
  rect(x, y, w, h, 5);

  fill(isSelected ? 0 : 255); // Black text on selected, white on default
  textSize(18);
  textAlign(CENTER, CENTER);
  text(txt, x + w / 2, y + h / 2);
}

function resetGame() {
    gameState = 'start';
    currentStep = 0;
    playerPhoto = null;
    transitionFrames = [];
    regionInput = 'Chinese';
    genderInput = 'Male';
    ageInput = '20s';
    currentInputFocus = 0;
}