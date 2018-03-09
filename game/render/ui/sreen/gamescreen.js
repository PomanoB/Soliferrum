
var inherits = require("inherits");
var UIScreen = require("./screen");

var GameField = require("../game/gamefield");
var Game = require("../../../game/game");
var GameRules = require("../../../game/gamerules");

var GameScreen = function(width, height)
{
	UIScreen.call(this, width, height);

	this.setFont("small-caps bold 14px arial", 14 * 1.2);

	this.game = new Game();

	this.field = new GameField(kFieldWidth, kFieldHeight);
	this.field.rect.top = 10;
	this.field.rect.left = 10;
	this.addChild(this.field);

	this.field.game = this.game;
};
inherits(GameScreen, UIScreen);

GameScreen.prototype.draw = function(ctx, timeStamp)
{
	this.game.update(timeStamp);

	GameScreen.super_.prototype.draw.call(this, ctx, timeStamp);
};

var kFieldWidth =
	GameField.kHexagonSize * 3/2 * (GameRules.kDiagonalHexCount * 2 - 1) + (1/2) * GameField.kHexagonSize;
var kFieldHeight = Math.sqrt(3) * GameField.kHexagonSize *
	(GameRules.kDiagonalHexCount + GameRules.kVerticalHexCount - 0.5 * (GameRules.kDiagonalHexCount % 2 + 1)) | 0 ;

module.exports = GameScreen;