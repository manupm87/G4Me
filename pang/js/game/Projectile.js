//
// Class to represent the Hero
//

const PROJECTILE_TYPE_1 = 1;			var PROJECTILE_WIDTH_1 = 14;		
const PROJECTILE_TYPE_2 = 2;			var PROJECTILE_WIDTH_2 = 2;		
const PROJECTILE_TYPE_3 = 3;			var PROJECTILE_WIDTH_3 = 2;		
const PROJECTILE_TYPE_4 = 4;			var PROJECTILE_WIDTH_4 = 2;		

const PROJECTILE_LAPSE_LONG = 500;		var PROJECTILE_HEIGHT_1 = CANVAS_HEIGHT;
const PROJECTILE_LAPSE_FULL = -1;		var PROJECTILE_HEIGHT_2 = 60;
const PROJECTILE_LAPSE_SHORT = 200;		var PROJECTILE_HEIGHT_3 = CANVAS_HEIGHT;
const PROJECTILE_LAPSE_NULL = 0;		var PROJECTILE_HEIGHT_4 = 3;

const PROJECTILE_VELOCITY_1 = 35;		const PROJECTILE_NAME_1 = "bullet";
const PROJECTILE_VELOCITY_2 = 5;		const PROJECTILE_NAME_2 = "bullet";
const PROJECTILE_VELOCITY_3 = 10;		const PROJECTILE_NAME_3 = "bullet";
const PROJECTILE_VELOCITY_4 = 20;		const PROJECTILE_NAME_4 = "bullet";

function Projectile(posX, type){
	var PROJECTILE_START_Y = CANVAS_HEIGHT - (FLOOR_MARGIN + HERO_HEIGHT);
	PROJECTILE_HEIGHT_1 = CANVAS_HEIGHT;
	PROJECTILE_WIDTH_1 = Math.min(HERO_WIDTH, HERO_HEIGHT) / 4;

	this.x = posX;
	this.y = PROJECTILE_START_Y;
	this.isAlive = true;
	switch(type){
		case PROJECTILE_TYPE_1:
			this.type = type;
			this.width = PROJECTILE_WIDTH_1;
			this.lapse = PROJECTILE_LAPSE_SHORT;
			this.height = PROJECTILE_HEIGHT_1;
			this.vel = PROJECTILE_VELOCITY_1;
			this.name = PROJECTILE_NAME_1;
		break;
		case PROJECTILE_TYPE_2:
			this.type = type;
			this.width = PROJECTILE_WIDTH_2;
			this.lapse = PROJECTILE_LAPSE_LONG;
			this.height = PROJECTILE_HEIGHT_2;
			this.vel = PROJECTILE_VELOCITY_2;
			this.name = PROJECTILE_NAME_1;
		
		break;
		case PROJECTILE_TYPE_3:
			this.type = type;
			this.width = PROJECTILE_WIDTH_3;
			this.lapse = PROJECTILE_LAPSE_FULL;
			this.height = PROJECTILE_HEIGHT_3;
			this.vel = PROJECTILE_VELOCITY_3;
			this.name = PROJECTILE_NAME_3;
		break;
		case PROJECTILE_TYPE_4:
			this.type = type;
			this.width = PROJECTILE_WIDTH_4;
			this.lapse = PROJECTILE_LAPSE_NULL;
			this.height = PROJECTILE_HEIGHT_4;
			this.vel = PROJECTILE_VELOCITY_4;
			this.name = PROJECTILE_NAME_4;
		break;
		default:
		
		break;

	}

}

Projectile.prototype.advance = function(step){
	this.y -= step;
}