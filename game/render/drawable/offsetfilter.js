
var inherits = require("inherits");

var Filter = require("./filter");

/**
 * @param {Coordinate} offset
 * @constructor
 */
var OffsetFilter = function(offset)
{
	Filter.call(this);

	this.offset = offset;
};
inherits(OffsetFilter, Filter);

OffsetFilter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	rect.left += this.offset.x;
	rect.top += this.offset.y;
};

module.exports = OffsetFilter;
