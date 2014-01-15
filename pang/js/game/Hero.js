//
// Class to represent the Hero
//

var HERO_WIDTH;
var HERO_HEIGHT;

//const HERO_START_X = (CANVAS_WIDTH - HERO_WIDTH)/2;
//const HERO_START_Y = (CANVAS_HEIGHT - FLOOR_MARGIN - HERO_HEIGHT);

const MAX_HERO_VEL = 32;
const HERO_REPRIS = 3;
const HERO_FRENADA = 9;
const HERO_SLIP = 6;

function Hero(posX, posY, width, height){

	
	this.x = posX;
	this.y = posY;
	this.w = width;
	this.h = height;
	
	this.step = 0;
	this.isMovingLeft = false;
	this.isMovingRight = false;
	
	// Posiblemente sobren
	this.wasMovingLeft = false;
	this.wasMovingRight = false;
}

Hero.prototype.move = function(direction){
	switch (direction){
		case "left":
			if(this.x <= WALL_MARGIN){
				this.x = WALL_MARGIN;
				this.step = 0;
			}
			else{
				this.x -= this.step;
			}
			break;
		case "right":
		if(this.x >= CANVAS_WIDTH - HERO_WIDTH - WALL_MARGIN){
				this.x = CANVAS_WIDTH - HERO_WIDTH - WALL_MARGIN;
				this.step = 0;
			}
			else{
				this.x += this.step;
			}
			break;
		default:
		
			break;
	}
}

Hero.prototype.accel = function(){
	(this.step + HERO_REPRIS) >= MAX_HERO_VEL ? this.step = MAX_HERO_VEL : this.step += HERO_REPRIS;
}

Hero.prototype.slip = function(){
	(this.step - HERO_SLIP) <= 0 ? this.step = 0 : this.step -= HERO_SLIP;

}

Hero.prototype.brake = function(){
	(this.step - HERO_FRENADA) <= 0 ? this.step = 0 : this.step -= HERO_FRENADA;

}