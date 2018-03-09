
var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;

var CanvasRenderer = function(canvasElement)
{
	this.canvas = canvasElement;
	this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
	this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
	this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));

	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.offsetWidth;
	this.height = this.canvas.offsetHeight;

	this.framesCount = 0;
	this.lastFPS = 0;

	/** @type {SpriteManager} */
	this.spriteManager = require("./spritemanager");
	/** @type {UIScreen} */
	this.screen = null;
};

CanvasRenderer.prototype.setScreen = function(screen)
{
	if (this.screen !== null)
		this.screen.hide();
	this.screen = screen;
	this.screen.show();
};

CanvasRenderer.prototype.draw = function(timeStamp)
{
	if (timeStamp >= this.lastFPS + 1000)
	{
//		console.log("FPS: %d", this.framesCount);
		this.framesCount = 0;
		this.lastFPS = timeStamp;
	}
	this.framesCount++;

	this.ctx.clearRect(0, 0, this.width, this.height);

	if (this.screen !== null)
	{
		this.screen.update(timeStamp);
		this.screen.draw(this.ctx, timeStamp);
	}
};

/**
 * @param {Event} event
 */
CanvasRenderer.prototype.handleMouseMove = function(event)
{
	if (this.screen === null)
		return;
//	this.hexOnMouse = this.getHexByCoordinate(event.offsetX, event.offsetY);
	this.screen.onMouseMove(new Coordinate(event.offsetX, event.offsetY));
};

/**
 * @param {Event} event
 */
CanvasRenderer.prototype.handleMouseDown = function(event)
{
	if (event.button !== 0 || this.screen === null)
		return;
	this.screen.onMouseDown(new Coordinate(event.offsetX, event.offsetY));
};

/**
 * @param {goog.events.BrowserEvent} event
 */
CanvasRenderer.prototype.handleMouseUp = function(event)
{
	if (event.button !== 0 || this.screen === null)
		return;
	this.screen.onMouseUp(new Coordinate(event.offsetX, event.offsetY));
};

module.exports = CanvasRenderer;
