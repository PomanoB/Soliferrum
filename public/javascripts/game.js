
goog.require("Falarica.Board.Board");
goog.require("Falarica.Entity.Player");
goog.require("Falarica.GameRules");

goog.provide("Falarica.Game");

Falarica.Game = function()
{
	/** @type {Falarica.Board.Board} */
	this.board = new Falarica.Board.Board(Falarica.GameRules.kDiagonalHexCount, Falarica.GameRules.kVerticalHexCount);
	/** @type {Falarica.Entity.Player} */
	this.player = new Falarica.Entity.Player();

	this.entities = [
		this.player
	];

	this.player.nextThink = 1;

	/** @type {Falarica.GameRules} */
	this.rules = new Falarica.GameRules(this);

	this.rules.loadLevel(0);

	this.gameTime = 0;
};

Falarica.Game.prototype.update = function(timeStamp)
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

Falarica.Game.prototype.setThinkToMonsters = function(timeStamp)
{
	this.entities.forEach(function(ent){
		if (ent.classify() === Falarica.Entity.Class.Monster)
			ent.nextThink = timeStamp + 200.0;
	}, this);
};

Falarica.Game.prototype.createEntity = function(entClass)
{
	var ent = new entClass();
	this.entities.push(ent);
	return ent;
};

Falarica.Game.prototype.getEntitiesInHex = function(coord, opt_classFiler)
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

Falarica.Game.prototype.onBeforeActivateHex = function(hex)
{

};

Falarica.Game.prototype.onActivateHex = function(hex)
{
	if (!this.board.hexInBoard(hex))
		return;
	if (this.rules.playerCanMoveToCoord(hex))
	{
		this.player.moveToPosition(hex);
	}
};
