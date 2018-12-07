var radius;
var hueCycles = 6;
var numLines = 3;
var lineThickness = 1;
var lineAlpha = 50;
var spanPower = 1;
var hueOffset = 0;


function setup() {
	radius = min(windowWidth, windowHeight) / 2;
	createCanvas(2 * radius, 2 * radius);
	colorMode(HSB, 1);
	clearCircle();
}

function clearCircle() {
	background(255);
	drawBorder();
}

function windowResized() {
	console.log("RESIZED");
	let newRadius = min(windowWidth, windowHeight) / 2;
	if (radius !== newRadius) {
  		resizeCanvas(windowWidth, windowHeight);
  		radius = newRadius;
  		clearCircle();
  	}
}

function draw() {
	coords = getCoords();
	if (shouldDraw()) {
		makeLines(coords);
	}
  	drawBorder();
}

function drawBorder() {
	let r = 10000;
	push();
	translate(width/2, height/2);
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
		return color(0, 0, 0, 1);
	}
	h = (hueCycles * (coords.th / TWO_PI + 1.75) - hueOffset / 360.0) % 1.0
	s = sqrt(coords.r / radius);
	b = (0.5 + 0.5 * sqrt(coords.r / radius));
	a = lineAlpha / 100.0;
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
	translate(coords.x + width/2, coords.y + height/2);
	rotate(coords.th);
	strokeWeight(lineThickness);
	stroke(getColor(coords));
	for (let i = 0; i < numLines; i++) {
		drawLine(span);
	}
	pop();
}


function shouldDraw() {
	return !mouseIsPressed;
}

function keyReleased() {
	if (keyCode === ESCAPE) {
		console.log("FULLSCREENED");
		fullscreen(!fullscreen());
	}
}

