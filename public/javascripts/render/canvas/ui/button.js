
goog.require("Falarica.Render.Canvas.UI.Actor");
goog.require("Falarica.Render.Canvas.Drawable.NinePatch");

goog.provide("Falarica.Render.Canvas.UI.Button");

Falarica.Render.Canvas.UI.Button = function(width, height)
{
	Falarica.Render.Canvas.UI.Actor.call(this, width, height);

	this.text = "";

	this.normalTexture = new Falarica.Render.Canvas.Drawable.NinePatch("decoButtonNormal", width, height);
	this.hoverTexture = new Falarica.Render.Canvas.Drawable.NinePatch("decoButtonHover", width, height);

	this.setTexture(this.normalTexture);

	this.onActivate = goog.nullFunction;
};
goog.inherits(Falarica.Render.Canvas.UI.Button, Falarica.Render.Canvas.UI.Actor);

Falarica.Render.Canvas.UI.Button.prototype.setText = function(text)
{
	this.text = text;
	this.textPosition = null;
};

Falarica.Render.Canvas.UI.Button.prototype.setNormalTexture = function(texture)
{
	this.normalTexture = texture;
	this.setTexture(this.normalTexture);
};

Falarica.Render.Canvas.UI.Button.prototype.setHoverTexture = function(texture)
{
	this.hoverTexture = texture;
};

Falarica.Render.Canvas.UI.Button.prototype.draw = function(ctx, timeStamp)
{
	Falarica.Render.Canvas.UI.Button.superClass_.draw.call(this, ctx, timeStamp);

	if (!this.text)
		return;
	if (this.font)
		ctx.font = this.font;
	ctx.textBaseline = "top";

	if (this.textPosition === null)
		this.calcTextPosition_(ctx);

	ctx.fillText(this.text, this.textPosition.x, this.textPosition.y);
};

Falarica.Render.Canvas.UI.Button.prototype.calcTextPosition_ = function(ctx)
{
	var size = ctx.measureText(this.text);
	this.textPosition = {
		x: (this.rect.width/2 - size.width/2) | 0,
		y: (this.rect.height/2 - this.lineHeight/2) | 0
	};
};

Falarica.Render.Canvas.UI.Button.prototype.onMouseOut = function()
{
	Falarica.Render.Canvas.UI.Button.superClass_.onMouseOut.call(this);
	this.setTexture(this.normalTexture);
};

Falarica.Render.Canvas.UI.Button.prototype.onMouseOver = function()
{
	Falarica.Render.Canvas.UI.Button.superClass_.onMouseOver.call(this);
	this.setTexture(this.hoverTexture);
};

Falarica.Render.Canvas.UI.Button.prototype.onMouseUp = function(coord)
{
	if (this.isMousePressed)
		this.onActivate();

	Falarica.Render.Canvas.UI.Button.superClass_.onMouseUp.call(this, coord);

	return true;
};

Falarica.Render.Canvas.UI.Button.prototype.onMouseDown = function(coord)
{
	Falarica.Render.Canvas.UI.Button.superClass_.onMouseDown.call(this, coord);
	return true;
};