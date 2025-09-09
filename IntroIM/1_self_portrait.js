let treeBaseX;
let lights = [];
let stones = [];

let maxPortraitFrames = 9000; // Total frames before the portrait freezes; should I keeep this? – Decided to keep this because the final scene serves as a portrait
let treeGrowthDuration = 900; // Number of frames for the tree to grow to full size (15 seconds)

let lightSpawnInterval = 10; // The smaller the frame number, the more frequent the spawn is
let stoneSpawnInterval = 40;

function setup() {
  createCanvas(600, 600);
  background(0);
  angleMode(DEGREES); // Use degrees for easier rotation calculations
  treeBaseX = random(width * 0.35, width * 0.65); // Keep tree base  a bit off the edges
}

function draw() {
  // Black or semi-transparent?
  background(125, 10);
  
  // Mouse press animation, simple but I found quite effective, especially in black background
  if (mouseIsPressed === true) {
    frameRate(10);
  } else {
    frameRate(60);
  }

  // 1. Draw the growing tree
  push(); // Isolate tree transformations
  translate(treeBaseX, height);

  // Calculate current tree height based on frameCount
  let currentTreeHeight = map(frameCount, 0, treeGrowthDuration, 0, 150);
  currentTreeHeight = constrain(currentTreeHeight, 0, 150);

  // Draw the main trunk and branches
  stroke(100, 70, 40);
  strokeWeight(map(currentTreeHeight, 0, 150, 1, 10));
  line(0, 0, 0, -currentTreeHeight);

  if (currentTreeHeight > 50) {
    drawBranch(currentTreeHeight * 0.8, 0, 10); // Start recursive branching
  }
  pop(); // Restore previous transformations

  // 2. Spawn lights & stones
  if (frameCount < maxPortraitFrames) { // Only spawn while the portrait is in its making
    // Spawn Lights
    if (frameCount % lightSpawnInterval === 0) {
      // Random starting X, and Y slightly above the canvas
      let startX = random(width);
      let startY = random(-50, -10);
      lights.push(new LightParticle(startX, startY));
    }

    // Spawn Stones
    if (frameCount % stoneSpawnInterval === 0) {
      let startX = random(width);
      let startY = random(-100, -30);
      stones.push(new StoneParticle(startX, startY));
    }
  }

  // 3. Update and Display Particles 
  // Lights
  for (let i = lights.length - 1; i >= 0; i--) {
    lights[i].update();
    lights[i].display();
    if (lights[i].isFinished()) {
      lights.splice(i, 1); // Remove light if its lifetime is over
    }
  }
  // Stones
  for (let i = stones.length - 1; i >= 0; i--) {
    stones[i].update();
    stones[i].display();
    // Stones are permanent once they settle, so no removal here
  }

  // 4. Stop animation
  if (frameCount >= maxPortraitFrames) {
    noLoop(); // Freeze the canvas on the final frame
    console.log("Self-Portrait Complete!");
  }
}

// Recursive tree branching (Gemini assistance)
function drawBranch(len, currentAngle, depth) {
  // Base case: branches are too small, draw leaves
  if (len < 5 || depth <= 0) {
    if (len >= 2) {
      fill(50, 150, 50, 200); // Greenish leaves
      noStroke();
      ellipse(0, 0, len * 2, len * 1.5);
    }
    return;
  }

  push();
  rotate(currentAngle); // Rotate to the branch's angle
  stroke(100, 70, 40); // Brown
  strokeWeight(map(len, 5, 150, 1, 5)); // Thinner branches
  line(0, 0, 0, -len); // Draw the branch segment
  translate(0, -len); // Move to the end of the branch

  // Recursive calls for two new branches
  // Randomness in angle and length for organic look
  let branchAngle1 = random(20, 35);
  let branchAngle2 = random(-35, -20);
  let branchLenFactor = random(0.6, 0.8);

  drawBranch(len * branchLenFactor, branchAngle1, depth - 1);
  drawBranch(len * branchLenFactor, branchAngle2, depth - 1);
  pop();
}

// LightParticle class (Gemini assistance)
class LightParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.5, 0.5); // Small horizontal drift
    this.vy = random(0.5, 1.5); // Initial vertical velocity
    this.gravity = 0.05; // Gentle gravity
    this.size = random(3, 7);
    this.color = color(255, 255, 0); // Yellow
    this.initialLifetime = random(120, 240); // How long it lives (2-4 seconds)
    this.lifetime = this.initialLifetime;
    this.opacity = 255;
  }

  update() {
    if (this.lifetime > 0) {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.lifetime--;
      this.opacity = map(this.lifetime, 0, this.initialLifetime, 0, 255);
    }
  }

  display() {
    if (this.lifetime > 0) {
      noStroke();
      fill(255, 255, 0, this.opacity); // Yellow with fading opacity
      circle(this.x, this.y, this.size);
    }
  }

  isFinished() {
    return this.lifetime <= 0; // Light disappears after its lifetime
  }
}

// StoneParticle class
class StoneParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.2, 0.2); // Small horizontal drift
    this.vy = random(1, 2); // Initial vertical velocity
    this.gravity = 0.1; // Stronger gravity than lights
    this.size = random(8, 15);
    this.color = color(200, 200, 200); // White/light gray
    this.settled = false; // Flag to check if it has hit the ground
  }

  update() {
    if (!this.settled) {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;

      // Check if it hits the ground
      if (this.y >= height - this.size / 2) {
        this.y = height - this.size / 2; // Snap to ground
        this.settled = true;
        this.vx = 0; // Stop horizontal movement
        this.vy = 0; // Stop vertical movement
      }
    }
  }

  display() {
    noStroke();
    fill(this.color);
    // Draw a simple rectangle for a stone, can be made more complex
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size * random(0.8, 1.2)); // Slightly varied height
  }

  // Stones are permanent once settled, so they are not "finished" in the sense of removal
  // They just stop moving
}