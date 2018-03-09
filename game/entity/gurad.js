
var inherits = require("inherits");

var Monster = require("./monster");
var Entity = require("./entity");

var Guard = function()
{
	Monster.call(this);
};
inherits(Guard, Monster);

Guard.prototype.classify = function()
{
	return Entity.Class.Monster;
};

Guard.prototype.think = function(game, timeStamp)
{
	Guard.super_.prototype.think.call(this, game, timeStamp);

	var pathToPlayer = game.board.findPath(this.origin, game.player.origin);
	if (pathToPlayer !== null && pathToPlayer.length)
		this.setTargetOrigin(pathToPlayer[0]);
};

module.exports = Guard;
