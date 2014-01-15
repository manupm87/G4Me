// Class to represent status

function Status(lifes, time_s, points, level){
	this.lifes = lifes;
	this.time_s = time_s;
	this.points = points;
	this.level = level;
}

/*function Status(){
	Status(3, 99, 0, 1);
}*/

Status.prototype.looseLife = function(){
	this.lifes--;
}
Status.prototype.gainLife = function(){
	this.lifes++;
}