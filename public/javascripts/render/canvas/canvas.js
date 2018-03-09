
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.events.EventHandler");
goog.require("goog.math.Coordinate");

goog.require("Falarica.Board.Hexagon.Type");
goog.require("Falarica.Render.Canvas.SpriteManager");
goog.require("Falarica.Render.Canvas.Drawable.Sprite");
goog.require("Falarica.Render.Canvas.TilesetDescription");
goog.require("Falarica.Render.Canvas.UISprite");

goog.require("Falarica.Render.Canvas.Utils");

goog.provide("Falarica.Render.Canvas.Renderer");

Falarica.Render.Canvas.Renderer = function(canvasElement)
{
	this.eventHandler = new goog.events.EventHandler(this);
	this.canvas = canvasElement;
	this.eventHandler.listen(this.canvas, goog.events.EventType.MOUSEMOVE, this.handleMouseMove);
	this.eventHandler.listen(this.canvas, goog.events.EventType.MOUSEDOWN, this.handleMouseDown);
	this.eventHandler.listen(this.canvas, goog.events.EventType.MOUSEUP, this.handleMouseUp);

	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.offsetWidth;
	this.height = this.canvas.offsetHeight;

	this.framesCount = 0;
	this.lastFPS = 0;

	/** @type {Falarica.Render.Canvas.SpriteManager} */
	this.spriteManager = Falarica.Render.Canvas.SpriteManager.getInstance();
	/** @type {Falarica.Render.Canvas.UI.Screen} */
	this.screen = null;
};

Falarica.Render.Canvas.Renderer.prototype.setScreen = function(screen)
{
	if (this.screen !== null)
		this.screen.hide();
	this.screen = screen;
	this.screen.show();
};

Falarica.Render.Canvas.Renderer.prototype.draw = function(timeStamp)
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
 * @param {goog.events.BrowserEvent} event
 */
Falarica.Render.Canvas.Renderer.prototype.handleMouseMove = function(event)
{
	if (this.screen === null)
		return;
//	this.hexOnMouse = this.getHexByCoordinate(event.offsetX, event.offsetY);
	this.screen.onMouseMove(new goog.math.Coordinate(event.offsetX, event.offsetY));
};

/**
 * @param {goog.events.BrowserEvent} event
 */
Falarica.Render.Canvas.Renderer.prototype.handleMouseDown = function(event)
{
	if (!event.isMouseActionButton() || this.screen === null)
		return;
	this.screen.onMouseDown(new goog.math.Coordinate(event.offsetX, event.offsetY));
};

/**
 * @param {goog.events.BrowserEvent} event
 */
Falarica.Render.Canvas.Renderer.prototype.handleMouseUp = function(event)
{
	if (!event.isMouseActionButton() || this.screen === null)
		return;
	this.screen.onMouseUp(new goog.math.Coordinate(event.offsetX, event.offsetY));
};

