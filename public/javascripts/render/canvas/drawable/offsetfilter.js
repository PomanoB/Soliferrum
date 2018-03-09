
goog.require("Falarica.Render.Canvas.Drawable.Filter");

goog.provide("Falarica.Render.Canvas.Drawable.OffsetFilter");

/**
 * @param {goog.math.Coordinate} offset
 * @constructor
 */
Falarica.Render.Canvas.Drawable.OffsetFilter = function(offset)
{
	Falarica.Render.Canvas.Drawable.Filter.call(this);

	this.offset = offset;
};
goog.inherits(Falarica.Render.Canvas.Drawable.OffsetFilter, Falarica.Render.Canvas.Drawable.Filter);

Falarica.Render.Canvas.Drawable.OffsetFilter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	rect.left += this.offset.x;
	rect.top += this.offset.y;
};
