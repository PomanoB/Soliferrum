
goog.require("Falarica.Render.Canvas.Drawable.Filter");
goog.require("Falarica.Board.Board.Direction");

goog.provide("Falarica.Render.Canvas.Drawable.JumpFilter");

/**
 * @param {goog.math.Coordinate} from
 * @param {goog.math.Coordinate} to
 * @param {number} duration
 * @constructor
 */
Falarica.Render.Canvas.Drawable.JumpFilter = function(from, to, duration)
{
	Falarica.Render.Canvas.Drawable.Filter.call(this);

	this.once = true;
//	this.duration = distance / speed * 1000;
	this.duration = duration;

//	this.distance = distance;
	this.stepFunc = Falarica.Render.Canvas.Drawable.Filter.easeInOut(
		Falarica.Render.Canvas.Drawable.Filter.cube);

//	this.directionVector_ = Falarica.Board.Board.getDirectionVec(direction);
	this.directionVector_ = new goog.math.Vec2(to.x - from.x, to.y - from.y);
	this.distance = this.directionVector_.magnitude();
	this.directionVector_.normalize();
	this.startPoint_ = from;
};
goog.inherits(Falarica.Render.Canvas.Drawable.JumpFilter, Falarica.Render.Canvas.Drawable.Filter);

Falarica.Render.Canvas.Drawable.JumpFilter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	var needDist = this.distance * this.stepFunc(step);
	rect.left = this.startPoint_.x + this.directionVector_.x * needDist;
	rect.top = this.startPoint_.y + this.directionVector_.y * needDist;
};


