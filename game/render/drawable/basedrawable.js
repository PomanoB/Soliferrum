
var BaseDrawable = function()
{
	this.filters = [];
};

BaseDrawable.prototype.addFilter = function(filter, unshift)
{
	if (unshift)
		this.filters.unshift(filter);
	else
		this.filters.push(filter);
};

BaseDrawable.prototype.draw = function(ctx, timeStamp, rect)
{
	this.applyFilters_(ctx, timeStamp, rect);
	this.drawInt_(ctx, timeStamp, rect);
};

/** @protected */
BaseDrawable.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
};

/** @protected */
BaseDrawable.prototype.applyFilters_ = function(ctx, timeStamp, rect)
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

module.exports = BaseDrawable;