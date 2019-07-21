function Bird(x, y, brain) {
    this.x = x;
    this.y = y;

    this.width = birdSize.width;
    this.height = birdSize.height;

    this.vel = 0;
    this.acc = 0;
    this.angle = 0;
    this.dead = false;
    this.onFloor = false;
    this.score = 0;
    this.fitness = 0;

    if (brain) {
        this.brain = brain.copy()
    } else {
        this.brain = new NeuralNetwork(5, 8, 2);
    }

    this.dispose = function() {
        this.brain.dispose();
    }

    this.mutate = function() {
        this.brain.mutate(0.1);
    }

    this.show = function() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        this.image = new Image();
        this.image.src = "img/bird.png";
        ctx.drawImage(this.image, this.width / -2, this.height / -2);
        ctx.restore();
    }

    this.think = function() {
        // find closest obstacle
        let closest = null;
        let closestD = Infinity;
        for (let i = 0; i < obstacles.length; i++) {
            let d = (obstacles[i].currX + obstacles[i].width) - this.x;
            if (d > 0 && d < closestD) {
                closest = i;
                closestD = d;
            }
        }

        let top = obstacles[closest];
        let bottom = obstacles[closest + 1];

        let inputs = [];
        inputs[0] = this.y / canvas.height;
        inputs[1] = (top.currY + top.height) / canvas.height;
        inputs[2] = bottom.currY / canvas.height;
        inputs[3] = top.currX / canvas.width;
        inputs[4] = this.vel / 12;

        let output = this.brain.predict(inputs);
        if (output[0] > output[1] && ! this.dead) {
            this.flap();
        }
    }

    this.update = function() {
        this.score++;

        this.acc = Math.max(this.acc, flapAcceleration * 1.25);
        this.vel += (this.acc + gravity) * frameRate;
        this.y += this.vel * frameRate * 100;
        this.acc = Math.min(0, this.acc + decay);

        if (this.vel > 0 && radiansToDegrees(this.angle) < 90) {
            this.angle += degreesToRadians(1);
        }

        this.onFloor = this.hitFloor();
        this.hitCeil();
    }

    this.die = function() {
        this.dead = true;
        document.body.onkeydown = null;
        canvas.removeEventListener('click', this.flap);
    }

    this.flap = function() {
        if (paused) return;

        this.acc = flapAcceleration;
        if (this.vel > 0) this.vel = 0;
        this.angle = degreesToRadians(flapAngle);
    }

    this.hitFloor = function() {
        var floor = canvas.height - this.height - floorHeight;
        if (this.y >= floor) {
            this.y = floor;
            this.vel = 0;
            this.angle = 0;
            return true;
        }
        return false;
    }

    this.hitCeil = function() {
        if (this.y <= 0) {
            this.y = 0;
            this.vel = 0;
            return true;
        }
        return false;
    }
}
