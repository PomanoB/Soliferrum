
goog.require("goog.math.Rect");

goog.provide("Falarica.Render.Canvas.UI.Actor");

Falarica.Render.Canvas.UI.Actor = function(width, height)
{
	/** @type {goog.math.Rect} */
	this.rect = new goog.math.Rect(0, 0, width || 0, height || 0);

	this.font = "";
	this.lineHeight = Falarica.Render.Canvas.UI.Actor.DefaultFontSize * 1.2;

//	this.x = 0;
	Object.defineProperty(this, "x", {
		get: function() {
			debugger;
			return 0;
		},
		set: function() {
			debugger;
		}
	});
	this.y = 0;
	this.width = width || 0;
	this.height = height || 0;

	/** @type {Falarica.Render.Canvas.Drawable.Sprite} */
	this.texture = null;

	this.isMouseHover = false;
	this.isMousePressed = false;
};

Falarica.Render.Canvas.UI.Actor.prototype.setFont = function(fontStr, lineHeight)
{
	this.font = fontStr;
	this.lineHeight = lineHeight;
};

Falarica.Render.Canvas.UI.Actor.prototype.draw = function(ctx, timeStamp)
{
	if (this.texture === null)
		return;

	this.texture.draw(ctx, timeStamp);
};

Falarica.Render.Canvas.UI.Actor.prototype.setTexture = function(txt)
{
	this.texture = txt;
};

Falarica.Render.Canvas.UI.Actor.prototype.onMouseOut = function()
{
	this.isMouseHover = false;
};

Falarica.Render.Canvas.UI.Actor.prototype.onMouseOver = function()
{
	this.isMouseHover = true;
};

Falarica.Render.Canvas.UI.Actor.prototype.onMouseMove = function(coord)
{
};

Falarica.Render.Canvas.UI.Actor.prototype.onMouseDown = function(coord)
{
	this.isMousePressed = true;
	return false;
};

Falarica.Render.Canvas.UI.Actor.prototype.onMouseUp = function(coord)
{
	this.isMousePressed = false;
	return false;
};

Falarica.Render.Canvas.UI.Actor.DefaultFontSize = 10;