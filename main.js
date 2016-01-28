var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet; //this needs to be the actual image not a link to the image
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, yPos, isBackground) {
	var isBackground = isBackground || false;
	var yPoint = yPos || 0;
    this.elapsedTime += tick;
	var size = 1;

    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }//if we are done and we aren't looping, then we are done.
	
    var frame = this.currentFrame(); //This tells me what frame on am on
    var xindex = 0; //how far over onto he sprite index I am
    var yindex = 0; // this is how far down I am.

	if(!isBackground){
		size = 1.3; //make mario bigger in size
		//ATTACK ANIMATION
		if(yPoint === 2){
			if(frame < 3){}
			xindex = frame % 4;
			yindex = 2;
			if(frame > 3){
				xindex = 3;
			}
		} else if(this.frames === 16) {
			//walk to the left
			if(frame < 8){
				xindex = frame + 8;
			} else {
				xindex = frame;
			} 		
		} else {
			xindex = frame % this.frames;
			yindex = yPoint;
		}
	}

	ctx.drawImage(this.spriteSheet,
        (xindex * this.frameWidth), yindex * this.frameHeight,  // source from sheet, where we want to print from
        this.frameWidth, this.frameHeight, //how wide of a portion do I want
        x, y,  //where do I want to print it
        this.frameWidth * size,  //how big do I want to draw it?
        this.frameHeight * size); 	
    
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function MarioSnake(game, spritesheet) {
    
	//(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
	//ROW = 0
    this.animation = new Animation(spritesheet, 96, 95, 0.1, 1, true, false);	
	this.walkAnimation = new Animation(spritesheet, 96, 95, 0.1, 8, true, false);
	this.leftWalkAnimation = new Animation(spritesheet, 96, 95, 0.1, 16, true, false);
	this.runAnimation = new Animation(spritesheet, 96, 95, 0.02, 7, true, false);
	//ROW = 1
	this.slipAnimation = new Animation(spritesheet, 95, 95, 0.07, 2, false, true);	
	//ROW = 2
	this.attackAnimation = new Animation(spritesheet, 95, 98, 0.1, 8, true, false); 	
	//ROW = 4
	this.batAnimation = new Animation(spritesheet, 96, 97, 0.1, 7, true, false);
	
	this.run = false;
	this.walk = false;
	this.slip = false;
	this.leftWalk = false;
    this.x = -120;
    this.y = 665;
    this.game = game;
    this.ctx = game.ctx;
	this.gameTime = 0;

}
//GIMP - free photoshop
MarioSnake.prototype.draw = function () {
	
    this.gameTime += this.game.clockTick;
	
	if(this.gameTime < 2.2 ||(this.gameTime >= 8 && this.gameTime < 12)
		||(this.gameTime >= 14 && this.gameTime < 16)||(this.gameTime >= 18.8 && this.gameTime < 36)) {
		this.walkAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		this.walk = true;	
	} else if(this.gameTime < 3.5){
		this.run = true;
		this.runAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else if(this.gameTime < 4.3||(this.gameTime >= 18 && this.gameTime < 18.8)){
		this.attackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 2);		
	} else if(this.gameTime < 5.2){
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else if(this.gameTime < 8 ||(this.gameTime >= 16 && this.gameTime < 18)) {
		this.leftWalk = true;
		this.leftWalkAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);	
	}   else if(this.gameTime < 14) {
		this.slip = true;
		this.slipAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);	
	}
	
}

MarioSnake.prototype.update = function() {
	if(this.run){
		this.x += 275* this.game.clockTick;
		this.run = false;
	} else if(this.leftWalk){
		this.x -= 55 * this.game.clockTick;
		this.leftWalk = false;
	} else if(this.walk || this.slip){
		this.x += 55 * this.game.clockTick;
		this.walk = false;
		this.slip = false;
	} 
}

function Fireball(game, spritesheet) {
    this.fireAnimation = new Animation(spritesheet, 95, 97, 0.1, 8, true, false); 
    this.x = 415;
    this.y = 685;
	this.fire = false;
    this.game = game;
    this.ctx = game.ctx;
	this.gameTime = 0;
}

Fireball.prototype.draw = function () {
    this.gameTime += this.game.clockTick;	
	
	if((this.gameTime > 3.7 && this.gameTime < 7)||(this.gameTime > 18.1 && this.gameTime < 28)){
		this.fire = true;
		this.fireAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 3);
	} else if(this.gameTime > 7) {
		this.x = 580;
	}
    
}

Fireball.prototype.update = function() {
	if(this.fire){
		this.x += 200 * this.game.clockTick;
		this.fire = false;
	} 
}

function BG(game, spritesheet) {
	//(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.animation = new Animation(spritesheet, 800, 800, .1, 1, true, false); 
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
}

BG.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0, true);
}

BG.prototype.update = function() {
}

AM.queueDownload("./img/mariosnake.png");
AM.queueDownload("./img/background2.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

	
	gameEngine.addEntity(new BG(gameEngine, AM.getAsset("./img/background2.png")));
	gameEngine.addEntity(new MarioSnake(gameEngine, AM.getAsset("./img/mariosnake.png")));
	gameEngine.addEntity(new Fireball(gameEngine, AM.getAsset("./img/mariosnake.png")));

    console.log("All Done!");
});