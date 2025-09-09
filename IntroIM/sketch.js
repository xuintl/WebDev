let cell = 50;
let cols, rows;
let phase = 0; // time variable for animation

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	noStroke();
	calcGrid();
	// colorMode(HSB, 360, 100, 100, 1);
}

function calcGrid() {
	cols = floor(width / cell) + 1;
	rows = floor(height / cell) + 1;
}

function draw() {
	background(12, 12, 16);
	phase += 0.02; // animation speed

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			// wave value based on position + time
			const w = sin(phase + (x * 0.35) + (y * 0.45)); // -1..1
			// wave size
			const s = map(w, -1, 1, cell * 0.25, cell * 0.85);
			// positional shift
			const dx = sin(phase * 0.7 + x * 0.3) * 6;
			const dy = cos(phase * 0.7 + y * 0.3) * 6;
			const px = x * cell + cell * 0.5 + dx;
			const py = y * cell + cell * 0.5 + dy;
			// hue drifts
			// const hueVal = (x * 8 + y * 6 + frameCount * 0.4) % 360;
			// let bri = map(w, -1, 1, 35, 90);
      // fill(hueVal, 60, bri, 0.9);
			let size = s;
			rect(px, py, size, size, 6);
		}
	}
}