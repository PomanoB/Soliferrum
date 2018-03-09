
goog.require("goog.dom");
goog.require('goog.dom.TagName');

goog.provide("Falarica.Render.Canvas.Drawable.StaticPattern");

Falarica.Render.Canvas.Drawable.StaticPattern = function(name)
{
	/** @type {Falarica.Render.Canvas.SpriteManager} */
	var manager = Falarica.Render.Canvas.SpriteManager.getInstance();

	var sprite = manager.getSprite(name);

	var patternCanvas = goog.dom.createElement(goog.dom.TagName.CANVAS);
	patternCanvas.width = sprite.width;
	patternCanvas.height = sprite.height;
	var pctx = patternCanvas.getContext('2d');
	sprite.draw(pctx, 0, 0, 0);

	this.pattern = pctx.createPattern(patternCanvas, "repeat");

	this.sprite = sprite;
	this.width = sprite.width;
	this.height = sprite.height;
};

Falarica.Render.Canvas.Drawable.StaticPattern.prototype.draw = function(ctx, timeStamp, rect)
{
	ctx.save();
	ctx.fillStyle = this.pattern;
	ctx.fillRect(rect.left, rect.top, rect.width || this.width, rect.height || this.height);
	ctx.restore();
};