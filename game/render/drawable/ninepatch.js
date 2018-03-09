
var mathUtils = require("../../util/math");
var Rectangle = mathUtils.Rectangle;

var NinePatch = function(sprite, width, height)
{
	/** @type {SpriteManager} */
	var manager = require("../spritemanager");

	this.left = manager.getPattern(sprite + "L");
	this.right = manager.getPattern(sprite + "R");
	this.top = manager.getPattern(sprite + "T");
	this.bottom = manager.getPattern(sprite + "B");

	this.topLeft = manager.getSprite(sprite + "TL");
	this.topRight = manager.getSprite(sprite + "TR");
	this.bottomLeft = manager.getSprite(sprite + "BL");
	this.bottomRight = manager.getSprite(sprite + "BR");

	this.bg = manager.getPattern(sprite + "Bg");

	this.width = width;
	this.height = height;

	this.bgRect_ = null;
	this.leftRect_ = null;
	this.rightRect_ = null;
	this.topRect_ = null;
	this.bottomRect_ = null;
	this.topLeftRect_ = null;
	this.topRightRect_ = null;
	this.bottomLeftRect_ = null;
	this.bottomRightRect_ = null;

	this.calcRects_();
};

NinePatch.prototype.calcRects_ = function()
{
	var middleWidth = this.width - this.left.width - this.right.width;
	var middleHeight = this.height - this.top.height - this.bottom.height;

	this.bgRect_ = new Rectangle(this.left.width, this.top.height, middleWidth, middleHeight);
	this.leftRect_ = new Rectangle(0, this.top.height, this.left.width, middleHeight);
	this.rightRect_ = new Rectangle(this.width - this.right.width, this.top.height, this.right.width, middleHeight);
	this.topRect_ = new Rectangle(this.left.width, 0, middleWidth, this.top.height);
	this.bottomRect_ = new Rectangle(this.left.width, this.height - this.top.height, middleWidth, this.bottom.height);
	this.topLeftRect_ = new Rectangle(0, 0, 0, 0);
	this.topRightRect_ = new Rectangle(this.width - this.topRight.width, 0, 0, 0);
	this.bottomLeftRect_ = new Rectangle(0, this.height - this.bottomLeft.height, 0, 0);
	this.bottomRightRect_ = new Rectangle(this.width - this.bottomRight.width, this.height - this.bottomRight.height, 0, 0);
};

NinePatch.prototype.draw = function(ctx, timeSpan)
{
	var middleWidth = this.width - this.left.width - this.right.width;
	var middleHeight = this.height - this.top.height - this.bottom.height;

	if (this.bg !== null)
		this.bg.draw(ctx, timeSpan, this.bgRect_);

	this.left.draw(ctx, timeSpan, this.leftRect_);
	this.right.draw(ctx, timeSpan, this.rightRect_);
	this.top.draw(ctx, timeSpan, this.topRect_);
	this.bottom.draw(ctx, timeSpan, this.bottomRect_);

	this.topLeft.draw(ctx, timeSpan, this.topLeftRect_);
	this.topRight.draw(ctx, timeSpan, this.topRightRect_);
	this.bottomLeft.draw(ctx, timeSpan, this.bottomLeftRect_);
	this.bottomRight.draw(ctx, timeSpan, this.bottomRightRect_);
};

module.exports = NinePatch;