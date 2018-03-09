
var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;

var Entity = function()
{
	this.health = 1;
	this.origin = new Coordinate();
	this.solid = Entity.Solid.Solid;

	this.nextThink = 0;
	this.visible = true;
	this.model = null;
};

Entity.prototype.classify = function()
{
	return Entity.Class.Interior;
};

/**
 * @param {Game} game
 * @param {number} timeStamp
 */
Entity.prototype.think = function(game, timeStamp)
{
};

Entity.prototype.setOrigin = function(coord)
{
	this.origin.x = coord.x;
	this.origin.y = coord.y;
};

Entity.prototype.takeDamage = function(attacker, damage)
{
	this.health = Math.max(0, this.health - damage);
	if (this.health === 0)
		return this.killed(attacker);
	return false;
};

Entity.prototype.killed = function(damager)
{
	return true;
};

Entity.prototype.isDead = function()
{
	return this.health <= 0;
};

Entity.Class = {
	Interior: 0,
	Item: 1,
	Monster: 2,
	Player: 3
};

Entity.Solid = {
	Solid: 0,
	Noclip: 1
};

module.exports = Entity;