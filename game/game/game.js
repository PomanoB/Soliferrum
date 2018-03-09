
var Board = require("../board/board");
var GameRules = require("./gamerules");
var Player = require("../entity/player");
var Entity = require("../entity/entity");

var Game = function()
{
	/** @type {Board} */
	this.board = new Board(GameRules.kDiagonalHexCount, GameRules.kVerticalHexCount);
	/** @type {Player} */
	this.player = new Player();

	this.entities = [
		this.player
	];

	this.player.nextThink = 1;

	/** @type {GameRules} */
	this.rules = new GameRules(this);

	this.rules.loadLevel(0);

	this.gameTime = 0;
};

Game.prototype.update = function(timeStamp)
{
	this.gameTime = timeStamp;
	this.entities.forEach(function(ent){
		ent.moveThink(timeStamp, this);
		if (ent.nextThink > 0 && ent.nextThink <= timeStamp)
		{
			ent.nextThink = 0;
			ent.think(this, timeStamp);
		}
	}, this);
};

Game.prototype.setThinkToMonsters = function(timeStamp)
{
	this.entities.forEach(function(ent){
		if (ent.classify() === Entity.Class.Monster)
			ent.nextThink = timeStamp + 200.0;
	}, this);
};

Game.prototype.createEntity = function(entClass)
{
	var ent = new entClass();
	this.entities.push(ent);
	return ent;
};

Game.prototype.getEntitiesInHex = function(coord, opt_classFiler)
{
	var result = [];
	if (coord === null)
		return result;
	this.entities.forEach(function(ent){
		if (ent.origin.x !== coord.x || ent.origin.y !== coord.y)
			return;
		if (opt_classFiler !== undefined && ent.classify() !== opt_classFiler)
			return;
		result.push(ent);
	}, this);
	return result;
};

Game.prototype.onBeforeActivateHex = function(hex)
{

};

Game.prototype.onActivateHex = function(hex)
{
	if (!this.board.hexInBoard(hex))
		return;
	if (this.rules.playerCanMoveToCoord(hex))
	{
		this.player.moveToPosition(hex);
	}
};

module.exports = Game;
