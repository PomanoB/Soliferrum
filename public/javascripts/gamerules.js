
goog.require("goog.math.Coordinate");
goog.require("goog.array");

goog.require("Falarica.Utils");
goog.require("Falarica.Entity.Guard");

goog.provide("Falarica.GameRules");

Falarica.GameRules = function(game)
{
	/** @type {Falarica.Game} */
	this.game = game;

	this.randomSeed = Math.random() * 123456 | 0;
	this.rnd = new Falarica.Utils.RandomGenerator(this.randomSeed);

	this.lastPlayerAction = 0;
};

Falarica.GameRules.prototype.loadLevel = function(levelNumber)
{
	this.placePlayer();
	this.placeLavaLake();
	this.placeMonsters();
};

Falarica.GameRules.prototype.placeMonsters = function()
{
	var guard = this.game.createEntity(Falarica.Entity.Guard);
	guard.setOrigin(new goog.math.Coordinate(3, 3));
};

Falarica.GameRules.prototype.placePlayer = function()
{
	this.game.player.setOrigin(Falarica.GameRules.kPlayerStartOrigin);
};

Falarica.GameRules.prototype.placeLavaLake = function()
{
	var startHex = new goog.math.Coordinate(0, 0);
	startHex.x = this.rnd.next(0, this.game.board.width);
	var columnInfo = this.game.board.getColumnInfo(startHex.x);
	startHex.y = this.rnd.next(columnInfo.start, columnInfo.end);

	this.game.board.board[startHex.x][startHex.y] = new Falarica.Board.Hexagon(Falarica.Board.Hexagon.Type.Lava);

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
			goog.array.map(
				this.game.board.getNeighbors(curHex.hex),
				function(hex){
					if (this.rnd.nextFloat() <= currChance)
						this.game.board.board[hex.x][hex.y] = new Falarica.Board.Hexagon(Falarica.Board.Hexagon.Type.Lava);
					return {
						hex: hex.clone(),
						chance: currChance
					};
				},
				this)
			)
	}
};

Falarica.GameRules.prototype.playerCanMoveToCoord = function(hexCoord)
{
	if (!hexCoord)
		return false;
	var hex = this.game.board.getHex(hexCoord);
	return hex && hex.contents === Falarica.Board.Hexagon.Contents.Ground;
};

Falarica.GameRules.prototype.requestMove = function(oldOrigin, newOrigin)
{
	if (this.lastPlayerAction + Falarica.GameRules.kPlayerActionDelay > this.game.gameTime)
		return false;
	this.lastPlayerAction = this.game.gameTime;

	this.performPlayerMoveAndHit(oldOrigin, newOrigin);
	return true;
};

Falarica.GameRules.prototype.performPlayerMoveAndHit = function(oldOrigin, newOrigin)
{
	var moveDirection = this.game.board.getDirection(oldOrigin, newOrigin);
	var nextHex = this.game.board.getHexInDirection(newOrigin, moveDirection);
	var entToHit = this.game.getEntitiesInHex(nextHex, Falarica.Entity.Class.Monster);
	for(var i = 0; i < entToHit.length; i++)
		entToHit[i].takeDamage(this.game.player, Falarica.GameRules.kPlayerDamage);
};

Falarica.GameRules.kPlayerActionDelay = 400;
Falarica.GameRules.kPlayerDamage = 1;

Falarica.GameRules.kDiagonalHexCount = 5;
Falarica.GameRules.kVerticalHexCount = 7;

Falarica.GameRules.kPlayerStartOrigin = new goog.math.Coordinate(
	Falarica.GameRules.kDiagonalHexCount - 1,
	Falarica.GameRules.kVerticalHexCount + Falarica.GameRules.kDiagonalHexCount - 3
);