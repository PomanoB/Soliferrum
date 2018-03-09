
goog.require("goog.math.Coordinate");

goog.require("Falarica.Entity.Entity");

goog.provide("Falarica.Entity.Monster");

Falarica.Entity.Monster = function()
{
	Falarica.Entity.Entity.call(this);

	this.targetOrigin = new goog.math.Coordinate(0, 0);
	this.speed = 300.0;
	this.lastMoving = 0;
};
goog.inherits(Falarica.Entity.Monster, Falarica.Entity.Entity);

Falarica.Entity.Monster.prototype.classify = function()
{
	return Falarica.Entity.Class.Monster;
};

Falarica.Entity.Monster.prototype.setTargetOrigin = function(x, y)
{
	if (y === undefined)
	{
		y = x.y;
		x = x.x;
	}
	this.targetOrigin.x = x;
	this.targetOrigin.y = y;
};

Falarica.Entity.Monster.prototype.moveThink = function(timeStamp, game)
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

Falarica.Entity.Monster.prototype.isMovingDone = function()
{
	return this.origin.x === this.targetOrigin.x &&
		this.origin.y === this.targetOrigin.y;
};

Falarica.Entity.Monster.prototype.setOrigin = function(coord)
{
	Falarica.Entity.Monster.superClass_.setOrigin.call(this, coord);
	this.targetOrigin.x = coord.x;
	this.targetOrigin.y = coord.y;
};
