
var inherits = require("inherits");
var Filter = require("./filter");
var mathUtils = require("../../util/math");
var Vector = mathUtils.Vector;

/**
 * @param {Coordinate} from
 * @param {Coordinate} to
 * @param {number} duration
 * @constructor
 */
var JumpFilter = function(from, to, duration)
{
	Filter.call(this);

	this.once = true;
	this.duration = duration;

	this.stepFunc = Filter.easeInOut(Filter.cube);

	this.directionVector_ = new Vector(to.x - from.x, to.y - from.y);
	this.distance = this.directionVector_.magnitude();
	this.directionVector_.normalize();
	this.startPoint_ = from;
};
inherits(JumpFilter, Filter);

JumpFilter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	var needDist = this.distance * this.stepFunc(step);
	rect.left = this.startPoint_.x + this.directionVector_.x * needDist;
	rect.top = this.startPoint_.y + this.directionVector_.y * needDist;
};

module.exports = JumpFilter;
