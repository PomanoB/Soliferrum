
var inherits = require("inherits");
var events = require("events");

var mathUtils = require("../../util/math");
var Rectangle = mathUtils.Rectangle;

var Actor = function(width, height)
{
	events.EventEmitter.call(this);

	/** @type {goog.math.Rect} */
	this.rect = new Rectangle(0, 0, width || 0, height || 0);

	this.font = "";
	this.lineHeight = Actor.kDefaultFontSize * 1.2;

	/** @type {Sprite} */
	this.texture = null;

	this.isMouseHover = false;
	this.isMousePressed = false;
};
inherits(Actor, events.EventEmitter);

Actor.prototype.setFont = function(fontStr, lineHeight)
{
	this.font = fontStr;
	this.lineHeight = lineHeight;
};

Actor.prototype.draw = function(ctx, timeStamp)
{
	if (this.texture === null)
		return;

	this.texture.draw(ctx, timeStamp);
};

Actor.prototype.setTexture = function(txt)
{
	this.texture = txt;
};

Actor.prototype.onMouseOut = function()
{
	this.isMouseHover = false;
};

Actor.prototype.onMouseOver = function()
{
	this.isMouseHover = true;
};

Actor.prototype.onMouseMove = function(coord)
{
};

Actor.prototype.onMouseDown = function(coord)
{
	this.isMousePressed = true;
	return false;
};

Actor.prototype.onMouseUp = function(coord)
{
	this.isMousePressed = false;
	return false;
};

Actor.kDefaultFontSize = 10;

module.exports = Actor;