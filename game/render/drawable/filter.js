
var inherits = require("inherits");
var events = require("events");

var Filter = function()
{
	events.EventEmitter.call(this);

	this.once = false;
	this.duration = 0;
	this.startTime = 0;
};
inherits(Filter, events.EventEmitter);

Filter.prototype.applyFilter = function(timeStamp, rect)
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
Filter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
};

Filter.prototype.reset = function()
{
	this.startTime = 0;
};

Filter.prototype.updateAndCheckEnd = function(timeStamp)
{
	if (this.startTime === 0)
	{
		this.startTime = timeStamp;
		return false;
	}
	if (this.startTime + this.duration > timeStamp)
		return false;

	this.emit("filterEnd");

	if (this.once)
		return true;
	this.startTime = timeStamp;
	return false;
};

Filter.cube = function(progress)
{
	return Math.pow(progress, 3)
};
Filter.easeOut = function(deltaFunc)
{
	return function(progress) {
		return 1 - deltaFunc(1 - progress);
	}
};
Filter.easeInOut = function(deltaFunc)
{
	return function(progress) {
		if (progress <= 0.5)
			return deltaFunc(2 * progress) / 2;

		return (2 - deltaFunc(2 * (1 - progress))) / 2;
	}
};

module.exports = Filter;
