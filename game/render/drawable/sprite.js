
var inherits = require("inherits");

var BaseDrawable = require("./basedrawable");

var Sprite = function(descr)
{
	BaseDrawable.call(this);

	this.img = descr.img;

	this.x = descr.x;
	this.y = descr.y;
	this.width = descr.width;
	this.height = descr.height;
};
inherits(Sprite, BaseDrawable);

Sprite.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height, rect.left | 0, rect.top | 0, this.width, this.height);
};

module.exports = Sprite;