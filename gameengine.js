window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;  //that = this which mean that that is referring to game engine
    (function gameLoop() {
        that.loop();  //here we are referring to game engine, but if we used this, we would be referring to gameLoop
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
	/* The loop above is the equivalent below. We define the function and call it. But in the javascript above does it all in one setting.
		function gameLoop(){
			.....
		}
		gameloop();
	*/
	
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);  //paints a transparency and wipes the screen.
    this.ctx.save();  //This will store all the globals away into a remember these category
	//Paints all the ones below
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);  //leaves it up to the entities to know how they paint
    }
    this.ctx.restore(); //And restores all the ones back onto the screen
}

/*ctx.globalAlpha - alpha means transparency
(r, g, b, alpha "looks like a goldfish symbol")
You can't paint an image transparent, you have to set the global.
So when you draw one thing, you save before you draw and then restore it after the draw
drawGhost(){
	//ctx.save();   Seth wrapped this around the main design. But if you wanted it for individual pieces put them in the for loop
	ctx.globalAlpha=0.5;
	ctx.draw the ghost;
	//ctx.restore();
}
The same thing goes for reflection and rotation.
*/

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}