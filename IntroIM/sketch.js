// Game sprites
let sprites = {};
let birdFrames = [];

// Game objects
let bird;
let pipes = [];

// Game state and score
let gameState = 'start'; // 'start', 'calibrate', 'playing', 'gameOver'
let score = 0;
let base_x = 0; // for scrolling base

// Pitch detection
let mic;
let pitch;
let audioContext;
let currentFreq = 0;

// Calibration
let minPitch = 100; // Default low C
let maxPitch = 500; // Default high C
let isCalibratingLow = false;
let isCalibratingHigh = false;

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

// Preload all image sprites
function preload() {
  sprites.background = loadImage('sprites/background-day.png');
  sprites.base = loadImage('sprites/base.png');
  sprites.pipe = loadImage('sprites/pipe-green.png');
  sprites.gameOver = loadImage('sprites/gameover.png');
  sprites.message = loadImage('sprites/message.png');

  // Load bird animation frames
  birdFrames.push(loadImage('sprites/yellowbird-downflap.png'));
  birdFrames.push(loadImage('sprites/yellowbird-midflap.png'));
  birdFrames.push(loadImage('sprites/yellowbird-upflap.png'));

  // Load numbers for score
  sprites.numbers = [];
  for (let i = 0; i < 10; i++) {
    sprites.numbers.push(loadImage(`sprites/${i}.png`));
  }
}

function setup() {
  createCanvas(288, 512);
  bird = new Bird();

  // Setup audio for pitch detection
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
}

// --- PITCH DETECTION FUNCTIONS ---

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  console.log('Pitch model loaded');
  getPitch();
}

function getPitch() {
  pitch.getPitch((err, frequency) => {
    if (frequency) {
      currentFreq = frequency;
    } else {
      currentFreq = 0; // Set to 0 if no pitch is detected (breath break)
    }
    console.log(`Detected frequency: ${currentFreq.toFixed(2)} Hz`);
    getPitch();
  });
}

// --- GAME LOGIC AND DRAW LOOP ---

function draw() {
  // Draw background
  image(sprites.background, 0, 0, width, height);

  // Handle different game states
  switch (gameState) {
    case 'start':
      drawStartScreen();
      break;
    case 'calibrate':
      drawCalibrateScreen();
      break;
    case 'playing':
      drawPlayingScreen();
      break;
    case 'gameOver':
      drawGameOverScreen();
      break;
  }

  // Draw the scrolling base
  drawBase();
}

// --- GAME STATE DRAWING FUNCTIONS ---

function drawStartScreen() {
  image(sprites.message, width / 2 - sprites.message.width / 2, height / 2 - 150);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Use your voice to control the bird!\n\nClick to calibrate your vocal range.", width / 2, height / 2 + 50);
}

function drawCalibrateScreen() {
  textAlign(CENTER, CENTER);
  fill(255);
  if (isCalibratingLow) {
    text("Sing your LOWEST comfortable note.", width / 2, height / 2);
  } else if (isCalibratingHigh) {
    text("Now sing your HIGHEST comfortable note.", width / 2, height / 2);
  }
}

function drawPlayingScreen() {
  // Update and draw pipes
  if (frameCount % 90 === 0) {
    pipes.push(new Pipe());
  }
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    // Check for collisions
    if (pipes[i].hits(bird)) {
      gameState = 'gameOver';
    }
    
    // Update score
    if(pipes[i].pass(bird)) {
      score++;
    }

    // Remove pipes that are off-screen
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  // Update and draw bird
  bird.handlePitch(currentFreq);
  bird.update();
  bird.show();
  
  // Check for ground collision
  if (bird.y + bird.h / 2 > height - sprites.base.height) {
    gameState = 'gameOver';
  }

  drawScore();
}

function drawGameOverScreen() {
  image(sprites.gameOver, width / 2 - sprites.gameOver.width / 2, height / 2 - 100);
  drawScore(height / 2);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Click to play again.", width / 2, height / 2 + 80);
}

function drawBase() {
  // Create a seamless scrolling effect
  base_x -= 2;
  if (base_x <= -width) {
    base_x = 0;
  }
  image(sprites.base, base_x, height - sprites.base.height, width, sprites.base.height);
  image(sprites.base, base_x + width, height - sprites.base.height, width, sprites.base.height);
}

function drawScore(yPos = 30) {
    const scoreStr = score.toString();
    let totalWidth = 0;
    for(let char of scoreStr) {
        totalWidth += sprites.numbers[parseInt(char)].width;
    }

    let x = (width - totalWidth) / 2;
    for(let char of scoreStr) {
        const num = parseInt(char);
        image(sprites.numbers[num], x, yPos);
        x += sprites.numbers[num].width;
    }
}

// --- USER INPUT AND GAME RESET ---

function mousePressed() {
  switch (gameState) {
    case 'start':
      gameState = 'calibrate';
      isCalibratingLow = true;
      // Capture lowest pitch after a short delay
      setTimeout(() => {
        minPitch = currentFreq > 50 ? currentFreq : 100;
        console.log("Min pitch set to: " + minPitch);
        isCalibratingLow = false;
        isCalibratingHigh = true;
        // Capture highest pitch after another delay
        setTimeout(() => {
          maxPitch = currentFreq > minPitch ? currentFreq : 500;
          console.log("Max pitch set to: " + maxPitch);
          isCalibratingHigh = false;
          gameState = 'playing';
        }, 3000);
      }, 3000);
      break;
    case 'gameOver':
      resetGame();
      break;
  }
}

function resetGame() {
  pipes = [];
  bird = new Bird();
  score = 0;
  gameState = 'start';
}

// --- BIRD CLASS ---

class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.w = 34; // Approximate width from asset
    this.h = 24; // Approximate height from asset

    this.gravity = 0.6;
    this.velocity = 0;
    
    this.frame = 0;
  }

  show() {
    // Animate the bird by cycling through frames
    const currentFrame = birdFrames[floor(this.frame) % birdFrames.length];
    image(currentFrame, this.x - this.w / 2, this.y - this.h / 2);
    this.frame += 0.2; // Control animation speed
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Prevent bird from going above the screen
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
  
  // This is the core pitch control logic
  handlePitch(freq) {
    if (freq > 0) {
      // Map the calibrated pitch to the screen height
      // Using lerp for smooth transitions
      let targetY = map(freq, minPitch, maxPitch, height - sprites.base.height, 0);
      this.y = lerp(this.y, targetY, 0.2); 
      this.velocity = 0; // Override gravity when singing
    }
    // If freq is 0 (no sound), the regular update() method will apply gravity
  }
}

// --- PIPE CLASS ---

class Pipe {
  constructor() {
    this.spacing = 125; // Space between top and bottom pipe
    this.top = random(height / 6, 3 / 4 * height - this.spacing);
    this.bottom = this.top + this.spacing;
    this.x = width;
    this.w = 52; // Width of the pipe asset
    this.speed = 2;
    this.passed = false;
  }

  show() {
    // Draw bottom pipe
    image(sprites.pipe, this.x, this.bottom);
    
    // Draw top pipe (flipped)
    push();
    translate(this.x + this.w, this.top);
    scale(1, -1); // Flip vertically
    image(sprites.pipe, 0, 0);
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }

  hits(bird) {
    // Check if bird is within the x-range of the pipe
    if (bird.x + bird.w/2 > this.x && bird.x - bird.w/2 < this.x + this.w) {
      // Check if bird hits the top or bottom pipe
      if (bird.y - bird.h/2 < this.top || bird.y + bird.h/2 > this.bottom) {
        return true;
      }
    }
    return false;
  }
  
  pass(bird) {
    if (bird.x > this.x + this.w && !this.passed) {
      this.passed = true;
      return true;
    }
    return false;
  }
}