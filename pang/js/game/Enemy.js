//
// Class representing an Enemy
//

var BALL_RADIUS_N1;			const BALL_COLOR_N1 = "green";			var BALL_MINACEL_N1 = 40;
var BALL_RADIUS_N2;			const BALL_COLOR_N2 = "mediumpurple";	var BALL_MINACEL_N2 = 35;
var BALL_RADIUS_N3;			const BALL_COLOR_N3 = "red";			var BALL_MINACEL_N3 = 28;

const BALL_LEVEL_1 = 1;		const BALL_BORDER_N1 = "darkgreen";		const BALL_BUBBLE_NAME_N1 = "bubbleRed";
const BALL_LEVEL_2 = 2;		const BALL_BORDER_N2 = "purple";		const BALL_BUBBLE_NAME_N2 = "bubbleGreen";
const BALL_LEVEL_3 = 3;		const BALL_BORDER_N3 = "darkred";		const BALL_BUBBLE_NAME_N3 = "bubbleBlue";

const MAX_BALL_RADIUS = 90;
const LEFT = true;
const RIGHT = false;
const MAX_DW = 14;

function Enemy(centerX, centerY, level, movingLeft){	/*alert(	"WIDTH: " + CANVAS_WIDTH + 
			"\nHEIGHT: " + CANVAS_HEIGHT +
			"\NB1_R: " + BALL_RADIUS_N1 + 
			"\B2_R: " + BALL_RADIUS_N2 +
			"\B3_R: " + BALL_RADIUS_N3);
*/
	this.x = centerX;
	this.y = centerY;
	this.level = level;
	this.isAlive = true;
	this.w = 0; // 2 º/frame
	this.dw = 1;
	switch(level){
		case 1:
			this.r = BALL_RADIUS_N1;
			this.color = BALL_COLOR_N1;
			this.borderColor = BALL_BORDER_N1;
			this.minAcel = BALL_MINACEL_N1;
			this.bubbleName = BALL_BUBBLE_NAME_N1;
		break;
		case 2:
			this.r = BALL_RADIUS_N2;
			this.color = BALL_COLOR_N2;
			this.borderColor = BALL_BORDER_N2;
			this.minAcel = BALL_MINACEL_N2;
			this.bubbleName = BALL_BUBBLE_NAME_N2;
		break;
		case 3:
			this.r = BALL_RADIUS_N3;
			this.color = BALL_COLOR_N3;
			this.borderColor = BALL_BORDER_N3;
			this.minAcel = BALL_MINACEL_N3;
			this.bubbleName = BALL_BUBBLE_NAME_N3;
		break;
		default:
		
		break;
	}
	this.acel = 1;
	this.movingUp = true;
	this.movingLeft = movingLeft;
	this.backgroundName = null;
	
}

Enemy.prototype.move = function(yAxis, yStep, xAxis, xStep){
	(yAxis == "Up") ? this.y -= yStep : this.y += yStep;
	(xAxis == "Left") ? this.x -= xStep : this.x += xStep;
}