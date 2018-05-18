const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


//load images
const water = new Image();
water.src = 'images/water.png';
const rocks = new Image();
rocks.src = 'images/rocks.png';
const ground = new Image();
ground.src = 'images/ground.png';
const badfrog = new Image();
badfrog.src = 'images/enemy.png';

const frog = []; // Create empty array of frog images
for (let i=0; i<4; i++) { // Init new images in array
	frog[i] = new Image();
}

// Add all images to an array
frog[0].src = 'images/frog-up.png';
frog[1].src = 'images/frog-left.png';
frog[2].src = 'images/frog-right.png';
frog[3].src = 'images/frog-down.png';

// This nested loop creates game board
const drawGameBoard = () => {
	let image = water;
	for (let x=0; x<=5; x++) {
		
		if (x == 1) { image = rocks; }
		if (x == 4) { image = ground; }
		
		for (let y=0; y<=4; y++) {

			ctx.drawImage(image,y*100,x*100,100,100);
		}
	}
};


class Player {
	constructor() {
		this.posX = 200;
		this.posY = 500;
		this.sprite = frog[0];
		this.animating = false;
		this.animation_tick = 0;
		this.direction = 'N';
	}

	drawPlayer() {
		ctx.drawImage(this.sprite, this.posX, this.posY);
		if (this.animating) {
			this.animate_move();
		}
	}

	handleInput(button) {
		if (this.animating)  {
			return
		}

		if (button == 'up' && this.posY > 0) { 
			this.animating = true;
			this.sprite = frog[0];
			this.direction = 'N';
		}
		if (button == 'left' && this.posX > 0) { 
			this.animating = true;
			this.sprite = frog[1];
			this.direction = 'W'; 
		}
		if (button == 'right' && this.posX < 400) { 
			this.animating = true;
			this.sprite = frog[2];
			this.direction = 'E';
		}
		if (button == 'down' && this.posY < 500) { 
			this.animating = true;
			this.sprite = frog[3];
			this.direction = 'S'; 
		}
	}

	resetPos() {
		this.posX = 200;
		this.posY = 500;
		this.animation_tick = 0;
		this.animating = false;
	}

	checkWin() {
		if (this.posY < 100) {
			alert("HURREY!!!");	
			this.resetPos();
		}
	}

	animate_move(direct) {
		if (this.direction === 'N') {this.posY-=20;}
		if (this.direction === 'W') {this.posX-=20;}
		if (this.direction === 'E') {this.posX+=20;}
		if (this.direction === 'S') {this.posY+=20;}
		
		this.animation_tick++;
		if (this.animation_tick === 5) {
			this.animating = false;
			this.animation_tick = 0;
		}

	}

}

// Enemy class
class Enemy {
	constructor() {
		this.paths = [100,200,300];
		this.posX = -200;
		this.posY = this.paths[Math.floor(Math.random()*this.paths.length)];
		this.sprite = badfrog;
		this.speed = 4 + (Math.floor(Math.random() * 6));
	}

	drawEnemy() {
		ctx.drawImage(this.sprite, this.posX, this.posY);
	}
	
	move() {
		this.posX += this.speed;
	}

	checkCollisions() {
		if (this.posX < player.posX + 80 && this.posX + 80 > player.posX &&
			this.posY < player.posY + 80 && this.posY + 80 > player.posY) { 
			player.resetPos();
		}
	}

	respawn() {
		if (this.posX > 550) {
			this.posY = this.paths[Math.floor(Math.random()*this.paths.length)];
			this.speed = 4 + (Math.floor(Math.random() * 6));
			this.posX = -200;
		}
	}
}

const allEnemies = []; // Create empty array of enemies

for (let i=0; i<3; i++) { // Create 3 enemies and append them to an array
	const enemy = new Enemy();
	allEnemies.push(enemy);
}

const player = new Player();


document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


const mainLoop = () => {
	ctx.clearRect(0,0, canvas.width, canvas.height); // Clear whole canvas, then redraw
	
	drawGameBoard();
	
	allEnemies.forEach(function(enemy) {
		enemy.move();
		enemy.checkCollisions();
		enemy.respawn();
		enemy.drawEnemy();
	});

	player.drawPlayer();
	player.checkWin();
	
	
	requestAnimationFrame(mainLoop);

};

requestAnimationFrame(mainLoop);