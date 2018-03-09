
goog.require("Falarica.Entity.Monster");

goog.provide("Falarica.Entity.Player");

Falarica.Entity.Player = function()
{
	Falarica.Entity.Monster.call(this);

	this.health = 3;
};
goog.inherits(Falarica.Entity.Player, Falarica.Entity.Monster);

Falarica.Entity.Player.prototype.classify = function()
{
	return Falarica.Entity.Class.Player;
};
