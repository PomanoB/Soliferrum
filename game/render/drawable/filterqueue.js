
var inherits = require("inherits");
var Filter = require("./filter");

/**
 * @constructor
 */
var FilterQueue = function()
{
	Filter.call(this);

	this.once = true;

	/**
	 * @type {Array.<Filter>}
	 * @private
	 */
	 this.filters_ = [];
};
inherits(FilterQueue, Filter);

FilterQueue.prototype.applyFilterInt_ = function(timeStamp, step, rect)
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

FilterQueue.prototype.addFilter = function(filter)
{
	if (!filter.once)
		return;
	this.filters_.push(filter);
	this.duration += filter.duration;
};

module.exports = FilterQueue;
