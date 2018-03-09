
goog.provide("Falarica.Render.Canvas.Drawable.Filter");

Falarica.Render.Canvas.Drawable.Filter = function()
{
	this.once = false;
	this.duration = 0;
	this.startTime = 0;
};

Falarica.Render.Canvas.Drawable.Filter.prototype.applyFilter = function(timeStamp, rect)
{
	if (this.duration <= 0)
	{
		this.applyFilterInt_(timeStamp, 0, rect);
		return;
	}
	if (this.startTime === 0)
		this.startTime = timeStamp;

	var step = (timeStamp - this.startTime) / this.duration;
	step = Math.max(0, Math.min(step, 1));
	this.applyFilterInt_(timeStamp, step, rect);
};

/** @protected */
Falarica.Render.Canvas.Drawable.Filter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
};

Falarica.Render.Canvas.Drawable.Filter.prototype.reset = function()
{
	this.startTime = 0;
};

Falarica.Render.Canvas.Drawable.Filter.prototype.updateAndCheckEnd = function(timeStamp)
{
	if (this.startTime === 0)
	{
		this.startTime = timeStamp;
		return false;
	}
	if (this.startTime + this.duration > timeStamp)
		return false;
	if (this.once)
		return true;
	this.startTime = timeStamp;
	return false;
};

Falarica.Render.Canvas.Drawable.Filter.cube = function(progress)
{
	return Math.pow(progress, 3)
};
Falarica.Render.Canvas.Drawable.Filter.easeOut = function(deltaFunc)
{
	return function(progress) {
		return 1 - deltaFunc(1 - progress);
	}
};
Falarica.Render.Canvas.Drawable.Filter.easeInOut = function(deltaFunc)
{
	return function(progress) {
		if (progress <= 0.5)
			return deltaFunc(2 * progress) / 2;

		return (2 - deltaFunc(2 * (1 - progress))) / 2;
	}
};