
var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;

var Guard = require("../entity/gurad");
var Entity = require("../entity/entity");
var Hexagon = require("../board/hexagon");

var GameRules = function(game)
{
	/** @type {Game} */
	this.game = game;

	this.randomSeed = Math.random() * 123456 | 0;
	this.rnd = new mathUtils.RandomGenerator(this.randomSeed);

	this.lastPlayerAction = 0;
};

GameRules.prototype.loadLevel = function(levelNumber)
{
	this.placePlayer();
	this.placeLavaLake();
	this.placeMonsters();
};

GameRules.prototype.placeMonsters = function()
{
	var guard = this.game.createEntity(Guard);
	guard.setOrigin(new Coordinate(3, 3));
};

GameRules.prototype.placePlayer = function()
{
	this.game.player.setOrigin(GameRules.kPlayerStartOrigin);
};

GameRules.prototype.placeLavaLake = function()
{
	var startHex = new Coordinate(0, 0);
	startHex.x = this.rnd.next(0, this.game.board.width);
	var columnInfo = this.game.board.getColumnInfo(startHex.x);
	startHex.y = this.rnd.next(columnInfo.start, columnInfo.end);

	this.game.board.board[startHex.x][startHex.y] = new Hexagon(Hexagon.Type.Lava);

	var neiggtbors = [
		{
			hex: startHex,
			chance: 0.5
		}
	];

	while(neiggtbors.length)
	{
		var curHex = neiggtbors.shift();
		var currChance = curHex.chance - 0.2;

		if (currChance <= 0)
			break;

		neiggtbors.push.apply(
			neiggtbors,
			this.game.board.getNeighbors(curHex.hex).map(function(hex){
					if (this.rnd.nextFloat() <= currChance)
						this.game.board.board[hex.x][hex.y] = new Hexagon(Hexagon.Type.Lava);
					return {
						hex: hex.clone(),
						chance: currChance
					};
				},
				this)
			)
	}
};

GameRules.prototype.playerCanMoveToCoord = function(hexCoord)
{
	if (!hexCoord)
		return false;
	var hex = this.game.board.getHex(hexCoord);
	return hex && hex.contents === Hexagon.Contents.Ground;
};

GameRules.prototype.requestMove = function(oldOrigin, newOrigin)
{
	if (this.lastPlayerAction + GameRules.kPlayerActionDelay > this.game.gameTime)
		return false;
	this.lastPlayerAction = this.game.gameTime;

	this.performPlayerMoveAndHit(oldOrigin, newOrigin);
	return true;
};

GameRules.prototype.performPlayerMoveAndHit = function(oldOrigin, newOrigin)
{
	var moveDirection = this.game.board.getDirection(oldOrigin, newOrigin);
	var nextHex = this.game.board.getHexInDirection(newOrigin, moveDirection);
	var entToHit = this.game.getEntitiesInHex(nextHex, Entity.Class.Monster);
	for(var i = 0; i < entToHit.length; i++)
		entToHit[i].takeDamage(this.game.player, GameRules.kPlayerDamage);
};

GameRules.kPlayerActionDelay = 400;
GameRules.kPlayerDamage = 1;

GameRules.kDiagonalHexCount = 5;
GameRules.kVerticalHexCount = 7;

GameRules.kPlayerStartOrigin = new Coordinate(
	GameRules.kDiagonalHexCount - 1,
	GameRules.kVerticalHexCount + GameRules.kDiagonalHexCount - 3
);

module.exports = GameRules;
