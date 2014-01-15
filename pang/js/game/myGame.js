const TO_RADIANS = Math.PI/180;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

const FLOOR_MARGIN = 2;
const ROOF_MARGIN = 10;
const WALL_MARGIN = 5;

var BALL_X_STEP;
const BISC = 6;			// Biscosity -> Guarantee less bounce each time
var G;					// Gravity
var FIRST_PUSH;		

const _2SECCOUNTDOWN = 4; // El loop count se ejecuta cada 500ms
var _2secCountdown;
var _2secs = 0;

var pause = false;

var canvas;
var ctx;
var imgLoader;
var imgLoaderLoop;

var stats;

var youWinImage = new Image();
var youLooseImage = new Image();
var bubbleImg;
var bubbleTextures = new Array(3);
var bubbleBackgrounds;
var projectileImg = new Image();
var lifeImg = new Image();
var heroImg = new Image();
var bubbleContinueImg = new Image();
var continueImg = new Image();

//weapon images
var weap_common_pattern = new Image();
var weap_common_top = new Image();

var loads = 0;

var raul;			// Our Hero!
var enemies;		// Bouncing balls
var projectiles;	// Projectiles!!

var timerLoop; // 10 ms -> 100 fps
var ballsLoop; // 50 ms -> 20 times per second
var projectilesLoop;
var heroLoop;
var welcome = true;
var won = false;
var lost = false;

// Controlls
var leftPressed, rightPressed, triggerPressed;
var weaponReloadLoop;
var weaponReloaded;
const STEPS_TO_RELOAD = 5;
var stepsCompletedToReload;

$('document').ready(loadGame);


function loadGame(){

	var device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	var device_height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    $("html").height(device_height).width(device_width);

    canvas = document.getElementById("canvas");
	CANVAS_WIDTH = device_width;
	CANVAS_HEIGHT = device_height;
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	ctx = canvas.getContext("2d");
	
	HERO_WIDTH = CANVAS_WIDTH / 10;
	HERO_HEIGHT = CANVAS_HEIGHT / 10;
	BALL_RADIUS_N1 = 1.5*Math.min(HERO_WIDTH, HERO_HEIGHT);
	BALL_RADIUS_N2 = BALL_RADIUS_N1 / 1.5;
	BALL_RADIUS_N3 = BALL_RADIUS_N2 / 3.5;
	G = HERO_HEIGHT / 50;
	FIRST_PUSH = 3*G;
	
	BALL_MINACEL_N1 = 26*G;
	BALL_MINACEL_N2 = 22*G;
	BALL_MINACEL_N3 = 17*G;
	BALL_X_STEP = HERO_WIDTH/16;
	
	leftPressed = rightPressed = triggerPressed = false;
	weaponReloaded = true;
	stepsCompletedToReload = 0;
	weaponReloadLoop = setInterval(reloadingWeapon, 50);
	
	
	imgLoader = new ImageLoader();
	
	stats = new Status(5, 99, 0, 1);	
	enemies = new Array();
	projectiles = new Array();
	
	loadImages();
	asignStaticImages();
	imgLoaderLoop = setInterval(checkImageLoader, 500);
	
	
	timerLoop = setInterval(loop, 30);
	
	startGame();
	newGame(1);
	
	turnOnControlls();
	
	$("#canvas")[0].addEventListener('touchstart', dealWithTouchStart);
	$("#canvas")[0].addEventListener('touchend', dealWithTouchEnd);
}

function reloadingWeapon(){
	if(!weaponReloaded){
		stepsCompletedToReload++;
		if(stepsCompletedToReload == STEPS_TO_RELOAD){
			weaponReloaded = true;
			stepsCompletedToReload = 0;
		}
	}
	else{
		stepsCompletedToReload = 0;
	}
}

function loadImages(){
	imgLoader.loadImage("bubbleRed", "img/bubble_red.png");
	imgLoader.loadImage("bubbleGreen", "img/bubble_green.png");
	imgLoader.loadImage("bubbleBlue", "img/bubble_blue.png");
	imgLoader.loadImage("bullet", "img/micro_bullet.png");
	imgLoader.loadImage("tank", "img/tank.png");
	imgLoader.loadImage("youWin", "img/victory.png");
	imgLoader.loadImage("youLoose", "img/youLoose.png");
	imgLoader.loadImage("life", "img/lifeImg.png");
	imgLoader.loadImage("patrusBack", "img/patrus_back.png");
	imgLoader.loadImage("enolBack", "img/enol_back.png");
	imgLoader.loadImage("continue", "img/continue.png");
	imgLoader.loadImage("bubbleContinue", "img/bubble_continue.png");
	imgLoader.loadImage("damianBack", "img/damian_back.png");
	imgLoader.loadImage("jorgeBack", "img/jorge_back.png");
	imgLoader.loadImage("manuBack", "img/manu_back.png");
	imgLoader.loadImage("martinBack", "img/martin_back.png");
	imgLoader.loadImage("motiBack", "img/moti_back.png");
	imgLoader.loadImage("nachinBack", "img/nachin_back.png");
	imgLoader.loadImage("olayaBack", "img/olaya_back.png");
	imgLoader.loadImage("pabloBack", "img/pablo_back.png");
	imgLoader.loadImage("pifiulBack", "img/pifiul_back.png");
	imgLoader.loadImage("privoBack", "img/privo_back.png");
	imgLoader.loadImage("quinosBack", "img/quinos_back.png");
	imgLoader.loadImage("sofiBack", "img/sofi_back.png");
	imgLoader.loadImage("noraBack", "img/nora_back.png");
	
	//Weapons / projectiles
	imgLoader.loadImage("weap_common", "img/weap_common_pattern.png");
	imgLoader.loadImage("weap_common2", "img/weap_common_pattern2.png");
	imgLoader.loadImage("weap_common_top", "img/weap_common_top.png");
	
}

function checkImageLoader(){
	if(imgLoader.loaded()){
		//startGame();
		
		clearInterval(imgLoaderLoop);
		newGame(1);
	}
}


function startGame(){
	
	timerLoop = setInterval(loop, 30);
	ballsLoop = setInterval(moveBalls, 40);
	projectilesLoop = setInterval(moveProjectiles, 20);
	heroLoop = setInterval(moveHero, 40);
	
	_2secCountdown = setInterval(countSecs, 500);

	raul = new Hero((CANVAS_WIDTH - HERO_WIDTH)/2, (CANVAS_HEIGHT - HERO_HEIGHT - FLOOR_MARGIN), HERO_WIDTH, HERO_HEIGHT);
}

// Por ahora no uso el nivel
function newGame(level){

	if(!welcome){
		enemies = new Array();
		projectiles = new Array();
		enemies[0] = new Enemy(60, 80, 1, LEFT);
		enemies[1] = new Enemy(CANVAS_WIDTH-60, 80, 1, RIGHT);
		//enemies[2] = new Enemy(280, 40, 1, LEFT);
		randomizeBubbleBackgrounds();
		pause = true;
	}
	
	_2secs = 0;
	
	
}

function randomizeBubbleBackgrounds(){
	bubbleBackgrounds = new Array();
	bubbleBackgrounds.push("patrusBack");
	bubbleBackgrounds.push("enolBack");
	bubbleBackgrounds.push("damianBack");
	bubbleBackgrounds.push("jorgeBack");
	bubbleBackgrounds.push("manuBack");
	bubbleBackgrounds.push("martinBack");
	bubbleBackgrounds.push("motiBack");
	bubbleBackgrounds.push("nachinBack");
	bubbleBackgrounds.push("noraBack");
	bubbleBackgrounds.push("olayaBack");
	bubbleBackgrounds.push("pabloBack");
	bubbleBackgrounds.push("pifiulBack");
	bubbleBackgrounds.push("privoBack");
	bubbleBackgrounds.push("quinosBack");
	bubbleBackgrounds.push("sofiBack");
	for(var i = 0; i< enemies.length; i++){
		var rand = Math.floor((Math.random()*bubbleBackgrounds.length));	
		enemies[i].backgroundName = bubbleBackgrounds[rand];
	}
}

function dealWithTouchStart(event){
	//alert("Hello");
	$canvas = $("#canvas");
	var c_relX = $canvas.position().left;
	var c_relY = $canvas.position().top;
	
	var touch_absX, touch_absY;
	var touches = [];
	touches = event.touches;
	
	// Recorro los dedos pulsados
	for(var i = 0; i<touches.length; i++){
		mTouch = touches[i];
		touch_absX = mTouch.pageX - c_relX;
		touch_absY = mTouch.pageY - c_relY;
		// Si toco a la izq del disparador -> movingLeft (y entre el suelo y sualtura)
		if((touch_absX < raul.x + HERO_WIDTH/2) && (touch_absY) > CANVAS_HEIGHT-2*HERO_HEIGHT){
			raul.isMovingLeft = true;
			raul.isMovingRight = false;
		}
		// Si toco a la dch del disparador -> movingRight
		else if((touch_absX > raul.x + HERO_WIDTH/2) && (touch_absY) > CANVAS_HEIGHT-2*HERO_HEIGHT){
			raul.isMovingRight = true;
			raul.isMovingLeft = false;
		}		
		// Disparo
		else{
			fireProjectile();
		}
	}
}

function dealWithTouchEnd(event){
	$canvas = $("#canvas");
	var c_relX = $canvas.position().left;
	var c_relY = $canvas.position().top;
	
	var touch_absX, touch_absY;
	var touches = [];
	touches = event.changedTouches;
	
	// Recorro los dedos pulsados
	for(var i = 0; i<touches.length; i++){
		mTouch = touches[i];
		touch_absX = mTouch.pageX - c_relX;
		touch_absY = mTouch.pageY - c_relY;
		// Si suelto a la izq del disparador -> wasMovingLeft (y entre el suelo y sualtura)
		if((touch_absX < raul.x + HERO_WIDTH/2) && (touch_absY) > CANVAS_HEIGHT-2*HERO_HEIGHT){
			raul.wasMovingLeft = true;
			raul.isMovingLeft = false;
		}
		// Si toco a la dch del disparador -> wasMovingRight
		else if((touch_absX > raul.x + HERO_WIDTH/2) && (touch_absY) > CANVAS_HEIGHT-2*HERO_HEIGHT){
			raul.wasMovingRight = true;
			raul.isMovingRight = false;
		}	
	}
}

// COMPRUEBO COLISIÓN HEROE - ENEMIGO!!
function moveHero(){

	// Gatillo apretado?? -> Disparar
	if(triggerPressed){
		fireProjectile();
	}
	
	if(!pause || won || lost){
			
		// quiero ir a la izquierda
		if(raul.isMovingLeft){
			//estaba yendo a la derecha -> Freno brusco mientras derrapo
			if(raul.wasMovingRight){
				raul.brake();
				raul.move("right");
				//Si ya paré
				if(raul.step == 0){
					raul.wasMovingRight = false;
				}
			}
			//estaba o parado o yendo hacia la izq
			else{
				
				raul.accel();
				raul.move("left");
				raul.wasMovingLeft = true;
			}
			
		}
		//quiero ir a la derecha
		else if(raul.isMovingRight){
			//estaba yendo a la izq -> Freno brusco mientras derrapo
			if(raul.wasMovingLeft){
				raul.brake();
				raul.move("left");
				//Si ya paré
				if(raul.step == 0){
					raul.wasMovingLeft = false;
				}
			}
			//estaba o parado o yendo hacia la izq
			else{
				raul.accel();
				raul.move("right");
				raul.wasMovingRight = true;
			}
		}
		//me deslizo hacia la izq con la inercia
		else if(raul.wasMovingLeft){
			raul.slip();
			if(raul.step == 0){
					raul.wasMovingLeft = false;
				}
			raul.move("left");
		}
		//me deslizo hacia la dch con la inercia
		else if(raul.wasMovingRight){
			raul.slip();
			if(raul.step == 0){
					raul.wasMovingRight = false;
				}
			raul.move("right");
		}
		
		//CHECK COLLISIONS!!!
		if(heroCollision() && !won && !lost){
			stats.looseLife();
			if(stats.lifes == 0){
				lost = true;
				pause = true;
				_2secs = 0;
			}
			// Perdimos una vida -> empezamos el nivel de nuevo
			newGame(1);
		}
	}
}

function countSecs(){
	if(pause){
		_2secs++;
		if(_2secs == _2SECCOUNTDOWN){
			pause = false;
		}
	}
}

function heroCollision(){
	for(var i = 0; i< enemies.length; i++){
		var enem = enemies[i];
		if((((raul.x+5 >= enem.x - enem.r) && (raul.x+5<= enem.x + enem.r)) || ((raul.x+HERO_WIDTH-5 >= enem.x - enem.r) && (raul.x+HERO_WIDTH-5<= enem.x + enem.r))) &&
			(enem.y + enem.r >= CANVAS_HEIGHT-HERO_HEIGHT)){
				//colsion
				enemies = new Array();
				return true;
			}
	}
	return false;
}

function moveBalls(){
	
		if(!pause){
			
		
		// Movemos las pelotas:
		
		for(var i = 0; i < enemies.length; i++){
		
			// Aplicamos la rotación:
			enemies[i].w += enemies[i].dw;
		
			// Moving left
			if(enemies[i].movingLeft){
				// Bounce on left wall
				if((enemies[i].x - enemies[i].r) <= 0){
					enemies[i].move("Up", 0, "Right", BALL_X_STEP);
					enemies[i].movingLeft = false;
					
					// Cambio la rotación de la pelota:
					if(!enemies[i].movingUp){
						(enemies[i].dw + enemies[i].acel >= MAX_DW) ? enemies[i].dw = MAX_DW : enemies[i].dw += enemies[i].acel;
					}
					else{
						(enemies[i].dw - enemies[i].acel <= -MAX_DW) ? enemies[i].dw = -MAX_DW : enemies[i].dw -= enemies[i].acel;
					}
				}
				// Standard x-axis movement
				else{
					enemies[i].move("Up", 0, "Left", BALL_X_STEP);
				}
			}
			// Moving right
			else{
				// Bounce on right wall
				if((enemies[i].x + enemies[i].r) >= canvas.width){
					enemies[i].move("Up", 0, "Left", BALL_X_STEP);
					enemies[i].movingLeft = true;
					
					// Cambio la rotación de la pelota:
					if(enemies[i].movingUp){
						(enemies[i].dw + enemies[i].acel/80 >= MAX_DW) ? enemies[i].dw = MAX_DW : enemies[i].dw += enemies[i].acel/80;
					}
					else{
						(enemies[i].dw - enemies[i].acel/80 <= -MAX_DW) ? enemies[i].dw = -MAX_DW : enemies[i].dw -= enemies[i].acel/80;
					}
				}
				// Standard x-axis movement
				else{
					enemies[i].move("Up", 0, "Right", BALL_X_STEP);
				}
			}
			
			// Pelota subiendo:
			if(enemies[i].movingUp){
				enemies[i].acel -= G;
				
				// Pelota llega a la cima:
				if (enemies[i].acel <= 0){
					enemies[i].movingUp = false;
				}
				enemies[i].move("Up", enemies[i].acel, "Left", 0);
			}
			
			// Pelota bajando:
			else{
				enemies[i].acel += G;
				enemies[i].move("Down", enemies[i].acel, "Left", 0);
				
				// Pelota impacta en el suelo:
				if(enemies[i].y + enemies[i].r >= canvas.height){
					enemies[i].y = canvas.height - enemies[i].r;
					enemies[i].movingUp = true;
					
					// El suelo absorve parte del impacto -> sube menos
					(enemies[i].acel - BISC <= enemies[i].minAcel)? enemies[i].acel = enemies[i].minAcel : enemies[i].acel -= BISC;
					
				}
			}
		}
	
	}

}

function collideWithContinue(p){
/*var cont_x = (CANVAS_WIDTH - continueImg.width*2/3)/2;
var cont_w = continueImg.width*2/3;
var cont_y = 30 + youLooseImage.height*2/3 + 50;
var cont_h = continueImg.width*2/3;*/

	var cont_w = CANVAS_WIDTH/2.5;
	var cont_x = (CANVAS_WIDTH - cont_w)/2;
	var cont_h = cont_w;
	var cont_y = 3*HERO_HEIGHT;
	
	if((p.x + p.width >= cont_x) && (p.x <= cont_x + cont_w)){
		if((p.y<= cont_y + cont_w) && (p.y+p.height >= cont_y)){
			// Impacto en continue!!
			return true;
			
		}
	}
}

//COMPRUEBO COLISIONES PROYECTIL-ENEMIGO!!
function moveProjectiles(){
	if(!pause|| won){
	
		for(var i = 0; i<projectiles.length; i++){
			// Advance projectile
			projectiles[i].advance(projectiles[i].vel);
				if(projectiles[i].y <= 0){
					projectiles[i].isAlive = false;
				}
				
				// Pantalla de continue
				if(welcome ||won ||lost){
					if(collideWithContinue(projectiles[i])){
						welcome = won = lost = false;
						stats = new Status(5, 99, 0, 1);
						newGame(1);
					}
				}
				else{
				
					// CHECK COLLISION!!
					for(var j = 0; j<enemies.length; j++){
						// Miro una bola
						if(	(enemies[j].isAlive) && (projectiles[i].isAlive) &&
							((projectiles[i].x + projectiles[i].width/2) <= (enemies[j].x +  enemies[j].r) && 		// Si el proyectil está más a la IZQ del limite DCH de la bola y
							(projectiles[i].x + projectiles[i].width/2) >= (enemies[j].x - enemies[j].r))){			// si el proyectil está más a la izq del limite izq de la bola y
							if(	(	projectiles[i].y<= (enemies[j].y + enemies[j].r)&&								// (si la punta del proyectil entró en la bola Y
									(projectiles[i].y  + projectiles[i].height)>= (enemies[j].y -enemies[j].r)))	// si la cola no salió de la bola
								{
								
								// HUBO COLISIÓN!!!
								enemies[j].isAlive = false;
								projectiles[i].isAlive = false;
								var newLevel = enemies[j].level + 1;
								// Si no es colisión con bola pequeña
								if(newLevel<=3){
									var doughterBallLeft = new Enemy(enemies[j].x-5, enemies[j].y, newLevel, LEFT);
									doughterBallLeft.x = enemies[j].x - doughterBallLeft.r;
									var doughterBallRight = new Enemy(enemies[j].x+5, enemies[j].y, newLevel, RIGHT);
									doughterBallRight.x = enemies[j].x + doughterBallRight.r;
									doughterBallLeft.movingUp = doughterBallRight.movingUp = true;
									
									doughterBallLeft.acel = doughterBallRight.acel = FIRST_PUSH;
									enemies.push(doughterBallLeft);
									enemies.push(doughterBallRight);
									// Le damos un fondo aleatorio a las nuevas bolas
									randomizeBubbleBackgrounds();
			
								}
								
								// Reformo el array de enemigos
								var tmpEnemies = new Array();
								for (var i = 0; i<enemies.length; i++){
									if(enemies[i].isAlive){
										tmpEnemies.push(enemies[i]);
									}
								}
								enemies = tmpEnemies;
								if(enemies.length == 0){
									won = true;
									pause = true;
									projectiles = new Array();
									_2secs = 0;
								}
								
							}
						}
					} // for enemies
				} // else -> estamos en partida normal
			}
		// Reformo el array de proyectiles
		var tmpProjectiles = new Array();
		for(var i = 0; i<projectiles.length; i++){
			if(projectiles[i].isAlive)
			tmpProjectiles.push(projectiles[i]);
		}
		projectiles = tmpProjectiles;
	
	}
}

function loop(){
	clearCanvas();
	paintCanvas();
}

// imágenes estaticas: youWin, youLoose, hero, life
function asignStaticImages(){
	youLooseImage = imgLoader.getImage("youLoose");
	youWinImage = imgLoader.getImage("youWin");
	heroImg = imgLoader.getImage("tank");
	lifeImg = imgLoader.getImage("life");
	continueImg = imgLoader.getImage("continue");
	bubbleContinueImg = imgLoader.getImage("bubbleContinue");
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function paintCanvas(){

	// PARTIDA NORMAL
	if(!lost && !welcome){
		// Pinto las pelotas:
		paintBalls();
		// Pinto los proyectiles:
		paintProjectiles();
		// Pinto el status
		paintStatus();
		// Pinto el mensaje de victoria:
		if(won){
			paintWinMessage();
			paintContinue();
		}
	}
	
	// GAME-OVER
	else if(lost){
		paintLooseMessage();
		paintContinue();
		paintProjectiles();
	}
	
	else if(welcome){
		paintContinue();
		// Pinto los proyectiles:
		paintProjectiles();
	}
	
	// Pinto a Raúl
	paintHero();
	
}

function paintBalls(){
	for(var i = enemies.length-1; i >= 0; i--){
	
		var cEnemy = enemies[i];
		var cBubbleTextureName = cEnemy.bubbleName;
		var cBubbleTexture = imgLoader.getImage(cBubbleTextureName);
		
		var cBubbleBackgroundName = cEnemy.backgroundName;
		var cBubbleBackground = imgLoader.getImage(cBubbleBackgroundName);
			
		drawRotatedImage(cBubbleBackground, cEnemy.x, cEnemy.y, 2*cEnemy.r, 2*cEnemy.r, cEnemy.w);
		ctx.drawImage(cBubbleTexture, cEnemy.x-cEnemy.r, cEnemy.y-cEnemy.r, 2*cEnemy.r, 2*cEnemy.r);
	}
	
}

function paintProjectiles(){
	weap_common_pattern = imgLoader.getImage("weap_common2");
	weap_common_top = imgLoader.getImage("weap_common_top");
	var pat = ctx.createPattern(weap_common_pattern, 'repeat');
	ctx.fillStyle = pat;
	for(var i = 0; i<projectiles.length; i++){
		if(projectiles[i].isAlive){
			ctx.drawImage(weap_common_top, projectiles[i].x, projectiles[i].y, weap_common_top.width, weap_common_top.height);
			ctx.fillRect(projectiles[i].x, projectiles[i].y + weap_common_top.height, weap_common_pattern.width, projectiles[i].height);
		}
	}
	
}

function paintStatus(){
	var life_w = Math.min(HERO_HEIGHT, HERO_WIDTH)/2;
	var life_posx = life_w;
	var life_posy = life_w;
	for (var i = 0; i< stats.lifes; i++){
		ctx.drawImage(lifeImg, life_posx*(i+1), life_posy, life_w, life_w);
	}
}

function paintHero(){
	ctx.drawImage(heroImg, raul.x, raul.y, raul.w, raul.h);
}

function paintWinMessage(){
	ctx.drawImage(youWinImage, (CANVAS_WIDTH - youWinImage.width*2/3)/2, 60, youWinImage.width*2/3, youWinImage.height*2/3);
}

function paintLooseMessage(){
	ctx.drawImage(youLooseImage, (CANVAS_WIDTH - youLooseImage.width*2/3)/2, 30, youLooseImage.width*2/3, youLooseImage.height*2/3);
}

function paintContinue(){
	var cont_w = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT)/3;
	var cont_x = (CANVAS_WIDTH - cont_w)/2;
	var cont_h = cont_w;
	var cont_y = 3*HERO_HEIGHT;

	if(!pause){
		/*ctx.drawImage(continueImg, (CANVAS_WIDTH - continueImg.width*2/3)/2, 30 + youLooseImage.height*2/3 + 50, continueImg.width*2/3, continueImg.height*2/3);
		ctx.drawImage(bubbleContinueImg, (CANVAS_WIDTH - continueImg.width*2/3)/2, 30 + youLooseImage.height*2/3 + 50, continueImg.width*2/3, continueImg.height*2/3);
	*/
		ctx.drawImage(continueImg, cont_x, 3*HERO_HEIGHT, cont_w, cont_h);
		ctx.drawImage(bubbleContinueImg, cont_x, 3*HERO_HEIGHT, cont_w, cont_h);

	}
	
}

function drawRotatedImage(image, x_center, y_center, width, height, angle) { 

		// save the current co-ordinate system 
		// before we screw with it
		ctx.save(); 

		// move to the middle of where we want to draw our image
		ctx.translate(x_center, y_center);

		// rotate around that point, converting our 
		// angle from degrees to radians 
		ctx.rotate(angle * TO_RADIANS);

		// draw it up and to the left by half the width
		// and height of the image 
		ctx.drawImage(image, -(width/2), -(height/2), width, height);

		// and restore the co-ords to how they were when we began
		ctx.restore(); 
}

function fireProjectile(){
	if(!pause){
		if(weaponReloaded){
			weaponReloaded = false;
			var newProjectile = new Projectile(raul.x + raul.w/2, PROJECTILE_TYPE_1);
			projectiles.push(newProjectile);
		}
	}
}

function turnOnControlls(){
	turnOnKeyDowns();
	turnOnKeyUps();
}

function turnOnKeyDowns(){
	document.onkeydown = manageKeyDowns;
}
function turnOnKeyUps(){
	document.onkeyup = manageKeyUps;
}

function manageKeyDowns(e){
	// Left controll pressed
	if(e.which == 37 || e.which == 65){
		leftPressed = true;
	}
	// Right controll pressed
	if(e.which == 39 || e.which == 68){
		rightPressed = true;
	}
	// Disparar!!
	if(e.which == 16 || e.which == 32){
		triggerPressed = true;
	}
	manageMoveControllsOnKeyDown();
}

function manageKeyUps(e){
	// Left controll released
	if(e.which == 37 || e.which == 65){
		leftPressed = false;
		raul.isMovingLeft = false;
	}
	// Right controll released
	if(e.which == 39 || e.which == 68){
		rightPressed = false;
		raul.isMovingRight = false;
	}
	if(e.which == 16 || e.which == 32){
		triggerPressed = false;
	}
	manageMoveControllsOnKeyUp();

}

function manageMoveControllsOnKeyDown(){
	if(leftPressed && !rightPressed){
		raul.isMovingLeft = true;
		if(!raul.wasMovingLeft && !raul.wasMovingRight){
			raul.wasMovingLeft = true;
		}
	}
	else if(rightPressed && !leftPressed){
		raul.isMovingRight = true;
		if(!raul.wasMovingRight && !raul.wasMovingLeft){
			raul.wasMovingRight = true;
		}
	}
	else if(leftPressed && rightPressed){
		raul.isMovingLeft = raul.isMovingRight = false;
	}
}
function manageMoveControllsOnKeyUp(){
	if(leftPressed && !rightPressed){
		raul.isMovingLeft = true;
		if(!raul.wasMovingLeft && !raul.wasMovingRight){
			raul.wasMovingLeft = true;
		}
	}
	else if(rightPressed && !leftPressed){
		raul.isMovingRight = true;
		if(!raul.wasMovingRight && !raul.wasMovingLeft){
			raul.wasMovingRight = true;
		}
	}
	else if(!leftPressed && !rightPressed){
		raul.isMovingLeft = raul.isMovingRight = false;
	}
}

