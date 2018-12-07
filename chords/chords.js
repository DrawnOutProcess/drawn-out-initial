var radius;
var hueCycles = 6;
var numLines = 1;
var lineThickness = 1;
var lineAlpha = 0.5;
var spanPower = 1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	radius = min(windowWidth, windowHeight) / 2 - 20;
	colorMode(HSB, 255);
}

function draw() {
	translate(width/2, height/2);
	coords = getCoords();
	if (!mouseIsPressed) {
		makeLines(coords);
	}
  	drawBorder();
}

function drawBorder() {
	let r = 2000;
	push();
	// stroke(getColor(getCoords()));
	stroke(0);
	noFill();
	strokeWeight(r - 2*radius);
	ellipse(0, 0, r, r);
	pop();
}

function getCoords() {
	let x = mouseX - width/2;
	let y = mouseY - height/2;
	return {
		x: x,
		y: y,
		r: sqrt(sq(x) + sq(y)),
		th: PI + atan2(y, x)
	};
}

function getColor(coords) {
	if (coords.r > radius) {
		return color(0, 0, 0, 255);
	}
	let th = (hueCycles * coords.th) % TWO_PI
	h = 255 * th / TWO_PI;
	s = 255 * sqrt(coords.r / radius);
	b = 255 * (0.5 + 0.5 * sqrt(coords.r / radius));
	a = 255 * lineAlpha;
	return color(h, s, b, a);
}

function getAngleSpan(coords) {
	return PI * ((radius - coords.r) / radius) ** spanPower;
}

function drawLine(span) {
	push();
	rotate(random(-span/2, span/2));
	line(0, -2 * radius, 0, 2 * radius);
	pop();
}

function makeLines(coords) {
	if (coords.r > radius) {
		return;
	}
	span = getAngleSpan(coords);
	push();
	translate(coords.x, coords.y);
	rotate(coords.th);
	strokeWeight(lineThickness);
	stroke(getColor(coords));
	for (let i = 0; i < numLines; i++) {
		drawLine(span);
	}
	pop();
}

function mouseReleased() {
	coords = getCoords();
	if (coords.r > radius) {
		background(255);
	}
}

// function keyReleased() {
// 	return;
// 	if (keyCode === ESCAPE) {
// 		fullscreen(!fullscreen());
// 		if fullscreen() {
// 			createCanvas(displayWidth, displayHeight);
// 		} else {
// 			createCanvas(windowWidth, windowHeight);
// 		}
// 	}
// }

