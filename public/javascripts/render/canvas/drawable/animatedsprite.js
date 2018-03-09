
goog.provide("Falarica.Render.Canvas.Drawable.AnimatedSprite");

Falarica.Render.Canvas.Drawable.AnimatedSprite = function(descr)
{
	this.img = descr.img;

	this.x = descr.x;
	this.y = descr.y;
	this.width = descr.width;
	this.height = descr.height;
	this.anim = descr.anim;

	this.currentFrame = {
		number: 0,
		x: this.x,
		y: this.y
	};
	this.lastFrameTime = 0;
};

Falarica.Render.Canvas.Drawable.AnimatedSprite.prototype.draw = function(ctx, timeStamp, x, y)
{
	if (this.lastFrameTime !== 0)
	{
		if (this.lastFrameTime + this.anim.frameTime <= timeStamp)
		{
			this.nextFrame_();
			this.lastFrameTime = timeStamp;
		}
	}
	else
		this.lastFrameTime = timeStamp;

	ctx.drawImage(this.img, this.currentFrame.x, this.currentFrame.y, this.width, this.height, x | 0, y | 0, this.width, this.height);
};

Falarica.Render.Canvas.Drawable.AnimatedSprite.prototype.nextFrame_ = function()
{
	if (this.currentFrame.number + 1 >= this.anim.frameCount)
	{
		if (this.anim.cycle)
			this.currentFrame.number = 0;
	}
	else
		this.currentFrame.number++;
	this.currentFrame.x = this.x + this.currentFrame.number * this.width;
};
