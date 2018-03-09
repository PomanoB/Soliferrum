
goog.require("goog.math.Rect");

goog.require("Falarica.Render.Canvas.Drawable.Filter");

goog.provide("Falarica.Render.Canvas.Drawable.BaseDrawable");

Falarica.Render.Canvas.Drawable.BaseDrawable = function()
{
	/** @type {Array.<Falarica.Render.Canvas.Drawable.Filter>} */
	this.filters = [];
};

/**
 * @param {Falarica.Render.Canvas.Drawable.Animation} filter
 * @param {boolean} unshift
 */
Falarica.Render.Canvas.Drawable.BaseDrawable.prototype.addFilter = function(filter, unshift)
{
	if (unshift)
		this.filters.unshift(filter);
	else
		this.filters.push(filter);
};

Falarica.Render.Canvas.Drawable.BaseDrawable.prototype.draw = function(ctx, timeStamp, rect)
{
	this.applyFilters_(ctx, timeStamp, rect);
	this.drawInt_(ctx, timeStamp, rect);
};

/** @protected */
Falarica.Render.Canvas.Drawable.BaseDrawable.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
};

/** @protected */
Falarica.Render.Canvas.Drawable.BaseDrawable.prototype.applyFilters_ = function(ctx, timeStamp, rect)
{
	var i = 0;
	var filter;
	for(; i < this.filters.length; i++)
	{
		filter = this.filters[i];
		if (filter.updateAndCheckEnd(timeStamp))
		{
			this.filters.splice(i, 1);
			i--;
			continue;
		}
		filter.applyFilter(timeStamp, rect);
	}
};
