
var StaticPattern = function(name)
{
	/** @type {SpriteManager} */
	var manager = require("../spritemanager");

	var sprite = manager.getSprite(name);

	var patternCanvas = document.createElement("CANVAS");
	patternCanvas.width = sprite.width;
	patternCanvas.height = sprite.height;
	var pctx = patternCanvas.getContext('2d');
	sprite.draw(pctx, 0, 0, 0);

	this.pattern = pctx.createPattern(patternCanvas, "repeat");

	this.sprite = sprite;
	this.width = sprite.width;
	this.height = sprite.height;
};

StaticPattern.prototype.draw = function(ctx, timeStamp, rect)
{
	ctx.save();
	ctx.fillStyle = this.pattern;
	ctx.fillRect(rect.left, rect.top, rect.width || this.width, rect.height || this.height);
	ctx.restore();
};

module.exports = StaticPattern;