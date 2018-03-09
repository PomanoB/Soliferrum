
goog.require("Falarica.Render.Canvas.UI.Screen");
goog.require("Falarica.Render.Canvas.SpriteManager");
goog.require("Falarica.Render.Canvas.UI.Player");
goog.require("Falarica.Game");
goog.require("Falarica.Render.Canvas.UI.Game.Field");

goog.provide("Falarica.Render.Canvas.UI.GameScreen");

Falarica.Render.Canvas.UI.GameScreen = function(width, height)
{
	Falarica.Render.Canvas.UI.Screen.call(this, width, height);

	this.setFont("small-caps bold 14px arial", 14 * 1.2);

	this.game = new Falarica.Game();

	this.field = new Falarica.Render.Canvas.UI.Game.Field(Falarica.Render.Canvas.UI.Game.Field.FieldWidth, Falarica.Render.Canvas.UI.Game.Field.FieldHeight);
	this.field.rect.top = 10;
	this.field.rect.left = 10;
	this.addChild(this.field);

	this.field.game = this.game;
};
goog.inherits(Falarica.Render.Canvas.UI.GameScreen, Falarica.Render.Canvas.UI.Screen);

Falarica.Render.Canvas.UI.GameScreen.prototype.draw = function(ctx, timeStamp)
{
	this.game.update(timeStamp);

	Falarica.Render.Canvas.UI.GameScreen.superClass_.draw.call(this, ctx, timeStamp);
};

Falarica.Render.Canvas.UI.Game.Field.FieldWidth =
	Falarica.Render.Canvas.UI.Game.Field.HexagonSize * 3/2 * (Falarica.GameRules.kDiagonalHexCount * 2 - 1) + (1/2) * Falarica.Render.Canvas.UI.Game.Field.HexagonSize;
Falarica.Render.Canvas.UI.Game.Field.FieldHeight = Math.sqrt(3) * Falarica.Render.Canvas.UI.Game.Field.HexagonSize *
	(Falarica.GameRules.kDiagonalHexCount + Falarica.GameRules.kVerticalHexCount - 0.5 * (Falarica.GameRules.kDiagonalHexCount % 2 + 1)) | 0 ;