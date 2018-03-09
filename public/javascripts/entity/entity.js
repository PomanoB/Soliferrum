
goog.require("goog.math.Coordinate");

goog.provide("Falarica.Entity.Entity");
goog.provide("Falarica.Entity.Class");

Falarica.Entity.Entity = function()
{
	this.health = 1;
	this.origin = new goog.math.Coordinate();
	this.solid = Falarica.Entity.Solid.Solid;

	this.nextThink = 0;
	this.visible = true;
	this.model = null;
};

Falarica.Entity.Entity.prototype.classify = function()
{
	return Falarica.Entity.Class.Interior;
};

/**
 * @param {Falarica.Game} game
 * @param {number} timeStamp
 */
Falarica.Entity.Entity.prototype.think = function(game, timeStamp)
{
};

Falarica.Entity.Entity.prototype.setOrigin = function(coord)
{
	this.origin.x = coord.x;
	this.origin.y = coord.y;
};

Falarica.Entity.Entity.prototype.takeDamage = function(attacker, damage)
{
	this.health = Math.max(0, this.health - damage);
	if (this.health === 0)
		return this.killed(attacker);
	return false;
};

Falarica.Entity.Entity.prototype.killed = function(damager)
{
	return true;
};

Falarica.Entity.Entity.prototype.isDead = function()
{
	return this.health <= 0;
};

Falarica.Entity.Class = {
	Interior: 0,
	Item: 1,
	Monster: 2,
	Player: 3
};

Falarica.Entity.Solid = {
	Solid: 0,
	Noclip: 1
};