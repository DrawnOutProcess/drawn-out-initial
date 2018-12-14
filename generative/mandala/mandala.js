class Circle {
    constructor(r) {
        this.r = r;
    }

    drawCircle() {
        ellipse(0, 0, 2 * this.r, 2 * this.r);
    }

    clearCircle() {
        push();
        noStroke();
        this.drawCircle();
        pop();
    }
}

class Ring {
    constructor(petal, angle, inner, outer, offset=0.0, factor=1.0, span=TWO_PI, color=null) {
        this.petal = petal;
        this.angle = angle;
        this.inner = inner;
        this.outer = outer;
        this.offset = offset;
        this.factor = factor;
        this.span = span;
        this.color = color;
    }

    drawRing() {
        this.cleanRing();
        push();
        rotate(this.offset);
        for (let i = 0; i < floor(this.span / this.angle); i++) {
            this.petal.drawPetal(this.inner, this.outer, this.angle, this.factor);
        }
        pop();
    }

    cleanRing() {
        if (this.color) {
            fill(this.color);
        }
        Circle(this.outer).drawCircle();
    }
}

class Petal {
    constructor(color=null) {
        this.color = color;
    }
    
    drawPetal(inner, outer, angle, factor=1.0) {
        if (this.color) {
            fill(this.color);
        }
        this._draw(inner, outer, angle * factor / 2);
        rotate(angle);
    }
}

// class EllipsePetal(Petal):
//     def _draw(self, r1, r2, a):
//         c = cos(a)
//         s = sin(a)
//         x1a, y1a = c * r1, -s * r1
//         x2a, y2a = c * r2, -s * r2
//         x1b, y1b = c * r1, s * r1
//         x2b, y2b = c * r2, s * r2
//         bezier(x1a, y1a, x2a, y2a, x2b, y2b, x1b, y1b)


class BezierPetal extends Petal {
    _draw(r1, r2, a) {
        let c = cos(a);
        let s = sin(a);
        let b = {
            x1a: c * r1,
            y1a: -s * r1,
            x2a: c * r2,
            y2a: -s * r2,
            x1b: c * r1,
            y1b: s * r1,
            x2b: c * r2,
            y2b: s * r2
        };
        bezier(b.x1a, b.y1a, b.x2a, b.y2a, b.x2b, b.y2b, b.x1b, b.y1b);
    }
}


class LeafPetal extends Petal {
    _draw(r1, r2, a) {
        let c = cos(a);
        let s = sin(a);
        let b = {
            x1a: c * r1,
            y1a: -s * r1,
            x2a: c * r2,
            y2a: -s * r2,
            x1b: c * r1,
            y1b: s * r1,
            x2b: c * r2,
            y2b: s * r2
        };
        bezier(b.x1a, b.y1a, b.x2a, b.y2a, r1, 0, r2, 0);
        bezier(b.x1b, b.y1b, b.x2b, b.y2b, r1, 0, r2, 0);
    }
}


class CirclePetal extends Petal {
    _draw(r1, r2, a) {
        push();
        translate(0, (r1 + r2) / 2);
        let radius = this.maxRadius(r1, r2, a);
        Circle(radius).drawCircle();
        pop();
    }
    
    maxRadius(r1, r2, a) {
        let inout = (r2 - r1) / 2 - 2;
        let around = (r1 + r2) * sqrt((1 - cos(a)) / 2);
        return min(inout, around);
    }
}


class SawtoothPetal extends Petal {
    _draw(r1, r2, a) {
        let c = cos(a);
        let s = sin(a);
        triangle(c * r1, -s * r1, r2, 0, c * r1, s * r1);
    }
}

class SquareWavePetal extends Petal {
    _draw(r1, r2, a) {
        a = abs(a);
        arc(0, 0, 2 * r1, 2 * r1, -a, a, PI);
        arc(0, 0, 2 * r2, 2 * r2, -a / 2, a / 2, PI);
    }
}



function randomFlower(radius, number) {
    colorMode(HSB);
    let petals = [BezierPetal, LeafPetal, SawtoothPetal, CirclePetal, SquareWavePetal] #BandPetal, SolidPetal];
    let counts = [4, 6, 8, 10, 12, 14, 16, 18, 20];
    let diff = radius / (number + 1);
    // Circle(radius).drawCircle()
    let rings = [];
    for (let i = 0; i < number; i++) {
        let r2 = radius * (1 - i / (number + 1.0));
        let r1 = r2 - diff;
        let petal = petals[floor(random(len(petals)))];
        let count = counts[floor(random(len(counts)))];
        let cp = color(random(255), 255, 255);
        let cr = color(random(255), 255, 255);
        rings.append(Ring(petal(cp), TWO_PI / count, r1, r2, color=cr));
    }
    return rings;
}


class CustomPetal extends Petal {
    constructor(r1, r2, f) {}
}

class RadiiList {
    
    constructor(count, radius) {
        this.radius = radius
        this.radii = sorted([random(radius) for i in range(count)])
        this.speed = [random(-radius/1000.0, radius/1000.0) for i in range(count)]
    }
    
    alter() {
        for i in range(len(self.radii)):
            self.radii[i] += self.speed[i]
            if self.radii[i] > self.radius:
                self.radii[i] = 2 * self.radius - self.radii[i]
                self.speed[i] *= -1
            if self.radii[i] < 0:
                self.radii[i] = -self.radii[i]
                self.speed[i] *= -1
            self.radii[i] = constrain(self.radii[i], 0, self.radius)
            self.speed[i] += random(-self.radius/10000.0, self.radius/10000.0)
    }
    
    getPairs() {
        reversed = [self.radius] + sorted(self.radii)[::-1];
        return zip(reversed[:-1], reversed[1:]);
    }

}
    

NUM_RINGS = 8
rings = []
speeds = []
factspeeds = []

// def GET_RADIUS():
//     return sqrt(width**2

def setup():
    // noStroke()
    global speeds
    global factspeeds
    global diagonal
    global radii
    size(800, 600)
    diagonal = sqrt(sq(width/2) + sq(height/2))
    speeds = [random(-.01, .01) for i in range(NUM_RINGS)]
    factspeeds = [random(-0.01, 0.01) for i in range(NUM_RINGS)]
    radii = RadiiList(NUM_RINGS, diagonal)
    mouseReleased()

def draw():
    global rings
    global speeds
    global factspeeds
    global radii
    global backColor
    global centColor
    colorMode(HSB)
    background(*backColor)
    translate(width/2, height/2)
    radiiPairs = radii.getPairs()
    print radiiPairs
    for i in range(len(rings)):
        rings[i].offset += speeds[i]
        rings[i].factor = ((rings[i].factor + factspeeds[i]) + 1) % 2 - 1
        rings[i].outer = radiiPairs[i][0]
        rings[i].inner = radiiPairs[i][1]
        #rings[i].color = 
        speeds[i] += random(-0.001, 0.001)
        factspeeds[i] += random(-0.001, 0.001)
        rings[i].drawRing()
    fill(*centColor)
    Circle(radiiPairs[-1][1]).drawCircle()
    radii.alter()


def mouseReleased():
    // drawNodes()
    global rings
    global backColor
    global centColor
    backColor = [random(255), 255, 255]
    centColor = [random(255), 255, 255]
    translate(width/2, height/2)
    diagonal = sqrt(sq(width/2) + sq(height/2))
    rings = randomFlower(diagonal, NUM_RINGS)
