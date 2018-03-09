
goog.require("Falarica.Render.Canvas.UI.Actor");
goog.require("Falarica.Render.Canvas.Drawable.Player");

goog.provide("Falarica.Render.Canvas.UI.Player");

Falarica.Render.Canvas.UI.Player = function()
{
	Falarica.Render.Canvas.UI.Actor.call(this,
		Falarica.Render.Canvas.UI.Player.PlayerSpriteWidth, Falarica.Render.Canvas.UI.Player.PlayerSpriteHeight);

	this.player = new Falarica.Render.Canvas.Drawable.Player();
};
goog.inherits(Falarica.Render.Canvas.UI.Player, Falarica.Render.Canvas.UI.Actor);

Falarica.Render.Canvas.UI.Player.prototype.draw = function(ctx, timeStamp)
{
	Falarica.Render.Canvas.UI.Player.superClass_.draw.call(this, ctx, timeStamp);

	this.player.draw(ctx, timeStamp, 0, 0);
};

Falarica.Render.Canvas.UI.Player.PlayerSpriteWidth = 32;
Falarica.Render.Canvas.UI.Player.PlayerSpriteHeight = 32;
