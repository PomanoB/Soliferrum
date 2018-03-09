
var inherits = require("inherits");

var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;
var Entity = require("./entity");

var Monster = function()
{
	Entity.call(this);

	this.targetOrigin = new Coordinate(0, 0);
	this.speed = 300.0;
	this.lastMoving = 0;
};
inherits(Monster, Entity);

Monster.prototype.classify = function()
{
	return Entity.Class.Monster;
};

Monster.prototype.setTargetOrigin = function(x, y)
{
	if (y === undefined)
	{
		y = x.y;
		x = x.x;
	}
	this.targetOrigin.x = x;
	this.targetOrigin.y = y;
};

Monster.prototype.moveThink = function(timeStamp, game)
{
	if (this.lastMoving + this.speed <= timeStamp && !this.isMovingDone())
	{
		var path = game.board.findPath(this.origin, this.targetOrigin);
		if (path !== null && path.length)
		{
			this.origin.x = path[0].x;
			this.origin.y = path[0].y;
		}
		this.lastMoving = timeStamp;
	}
};

Monster.prototype.isMovingDone = function()
{
	return this.origin.x === this.targetOrigin.x &&
		this.origin.y === this.targetOrigin.y;
};

Monster.prototype.setOrigin = function(coord)
{
	Monster.super_.prototype.setOrigin.call(this, coord);
	this.targetOrigin.x = coord.x;
	this.targetOrigin.y = coord.y;
};

module.exports = Monster;
