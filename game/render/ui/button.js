
var inherits = require("inherits");

var Actor = require("./actor");
var NinePatch = require("../drawable/ninepatch");

var Button = function(width, height)
{
	Actor.call(this, width, height);

	this.text = "";

	this.normalTexture = new NinePatch("decoButtonNormal", width, height);
	this.hoverTexture = new NinePatch("decoButtonHover", width, height);

	this.setTexture(this.normalTexture);
};
inherits(Button, Actor);

Button.prototype.setText = function(text)
{
	this.text = text;
	this.textPosition = null;
};

Button.prototype.setNormalTexture = function(texture)
{
	this.normalTexture = texture;
	this.setTexture(this.normalTexture);
};

Button.prototype.setHoverTexture = function(texture)
{
	this.hoverTexture = texture;
};

Button.prototype.draw = function(ctx, timeStamp)
{
	Button.super_.prototype.draw.call(this, ctx, timeStamp);

	if (!this.text)
		return;
	if (this.font)
		ctx.font = this.font;
	ctx.textBaseline = "top";

	if (this.textPosition === null)
		this.calcTextPosition_(ctx);

	ctx.fillText(this.text, this.textPosition.x, this.textPosition.y);
};

Button.prototype.calcTextPosition_ = function(ctx)
{
	var size = ctx.measureText(this.text);
	this.textPosition = {
		x: (this.rect.width/2 - size.width/2) | 0,
		y: (this.rect.height/2 - this.lineHeight/2) | 0
	};
};

Button.prototype.onMouseOut = function()
{
	Button.super_.prototype.onMouseOut.call(this);
	this.setTexture(this.normalTexture);
};

Button.prototype.onMouseOver = function()
{
	Button.super_.prototype.onMouseOver.call(this);
	this.setTexture(this.hoverTexture);
};

Button.prototype.onMouseUp = function(coord)
{
	if (this.isMousePressed)
		this.emit("activate");

	Button.super_.prototype.onMouseUp.call(this, coord);

	return true;
};

Button.prototype.onMouseDown = function(coord)
{
	Button.super_.prototype.onMouseDown.call(this, coord);
	return true;
};

module.exports = Button;