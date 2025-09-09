const CELL_SIZE = 30; // size of each cell in the grid
let cols, rows;
let phase = 0; // time variable for animation

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	noStroke();
	calcGrid();
	colorMode(HSB, 360, 100, 100, 1);
}

function calcGrid() {
	cols = floor(width / CELL_SIZE) + 1;
	rows = floor(height / CELL_SIZE) + 1;
}

function draw() {
	background(12, 12, 16);
	phase += 0.05; // animation speed

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			// wave value based on position + time
			const w = sin(phase + (x * 0.35) + (y * 0.45)); // -1..1
			// wave size
			const s = map(w, -1, 1, CELL_SIZE * 0.25, CELL_SIZE * 0.85);
			// positional shift
			const dx = sin(phase);
			const dy = cos(phase);
			const px = x * CELL_SIZE + CELL_SIZE * 0.5 + dx;
			const py = y * CELL_SIZE + CELL_SIZE * 0.5 + dy;
			// hue drifts
			const hueVal = (x * 8 + y * 6 + frameCount * 0.4) % 360;
			let bri = map(w, -1, 1, 35, 90);
			let size = s;

			// Interactive pulse
			if (mouseIsPressed) {
				const mx = mouseX;
				const my = mouseY;
				const d = dist(px, py, mx, my);
				const radius = CELL_SIZE * 12; // influence radius
				if (d < radius) { // Gamini assistance
					const influence = 1 - d / radius; // 0..1
					const pulse = sin(phase * 6) * 0.5 + 0.5; // faster local oscillation
					const boost = influence * pulse;
					size = lerp(size, size * 1.9, boost);
					bri = min(100, bri + boost * 40);
					// subtle hue shift toward complementary region
					fill((hueVal + boost * 140) % 360, 70, bri, 0.95);
				} else {
					fill(hueVal, 60, bri, 0.9);
				}
			} else {
				fill(hueVal, 60, bri, 0.9);
			}

			rect(px, py, size, size, 6);
		}
	}
}