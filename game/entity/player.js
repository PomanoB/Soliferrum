
var inherits = require("inherits");

var Monster = require("./monster");
var Entity = require("./entity");

var Player = function()
{
	Monster.call(this);

	this.health = 3;
};
inherits(Player, Monster);

Player.prototype.classify = function()
{
	return Entity.Class.Player;
};

module.exports = Player;
