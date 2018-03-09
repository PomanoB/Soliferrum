
goog.require("Falarica.Render.Canvas.Drawable.BaseDrawable");

goog.provide("Falarica.Render.Canvas.Drawable.Sprite");

Falarica.Render.Canvas.Drawable.Sprite = function(descr)
{
	Falarica.Render.Canvas.Drawable.BaseDrawable.call(this);

	this.img = descr.img;

	this.x = descr.x;
	this.y = descr.y;
	this.width = descr.width;
	this.height = descr.height;
};
goog.inherits(Falarica.Render.Canvas.Drawable.Sprite, Falarica.Render.Canvas.Drawable.BaseDrawable);

Falarica.Render.Canvas.Drawable.Sprite.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height, rect.left | 0, rect.top | 0, this.width, this.height);
};
