

goog.require("Falarica.Entity.Monster");

goog.provide("Falarica.Entity.Guard");

Falarica.Entity.Guard = function()
{
	Falarica.Entity.Monster.call(this);
};
goog.inherits(Falarica.Entity.Guard, Falarica.Entity.Monster);

Falarica.Entity.Guard.prototype.classify = function()
{
	return Falarica.Entity.Class.Monster;
};

Falarica.Entity.Guard.prototype.think = function(game, timeStamp)
{
	Falarica.Entity.Guard.superClass_.think.call(this, game, timeStamp);

	var pathToPlayer = game.board.findPath(this.origin, game.player.origin);
	if (pathToPlayer !== null && pathToPlayer.length)
		this.setTargetOrigin(pathToPlayer[0]);
};
