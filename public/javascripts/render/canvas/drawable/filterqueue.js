

goog.require("Falarica.Render.Canvas.Drawable.Filter");

goog.provide("Falarica.Render.Canvas.Drawable.FilterQueue");

/**
 * @constructor
 */
Falarica.Render.Canvas.Drawable.FilterQueue = function()
{
	Falarica.Render.Canvas.Drawable.Filter.call(this);

	this.once = true;

	/**
	 * @type {Array.<Falarica.Render.Canvas.Drawable.Filter>}
	 * @private
	 */
	 this.filters_ = [];
};
goog.inherits(Falarica.Render.Canvas.Drawable.FilterQueue, Falarica.Render.Canvas.Drawable.Filter);

Falarica.Render.Canvas.Drawable.FilterQueue.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	var i = 0;
	var queuedDuration = 0;
	var filter;
	for(; i < this.filters_.length; i++)
	{
		filter = this.filters_[i];
		queuedDuration += filter.duration;
		if (timeStamp > this.startTime + queuedDuration)
			continue;
		filter.applyFilter(timeStamp, rect);
		break;
	}
};

Falarica.Render.Canvas.Drawable.FilterQueue.prototype.addFilter = function(filter)
{
	if (!filter.once)
		return;
	this.filters_.push(filter);
	this.duration += filter.duration;
};
