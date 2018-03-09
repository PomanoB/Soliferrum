
goog.require("Falarica.Render.Canvas.SpriteManager");
goog.require("Falarica.Render.Canvas.Drawable.BaseDrawable");

goog.provide("Falarica.Render.Canvas.Drawable.Player");

Falarica.Render.Canvas.Drawable.Player = function()
{
	Falarica.Render.Canvas.Drawable.BaseDrawable.call(this);

	var manager = Falarica.Render.Canvas.SpriteManager.getInstance();

	this.baseSprite = manager.getSprite(Falarica.Render.Canvas.Drawable.Player.DefaultSprites.Base);
	this.bodySprite = manager.getSprite(Falarica.Render.Canvas.Drawable.Player.DefaultSprites.Body);
	this.legsSprite = manager.getSprite(Falarica.Render.Canvas.Drawable.Player.DefaultSprites.Legs);
	this.hairSprite = manager.getSprite(Falarica.Render.Canvas.Drawable.Player.DefaultSprites.Hair);
};
goog.inherits(Falarica.Render.Canvas.Drawable.Player, Falarica.Render.Canvas.Drawable.BaseDrawable);

Falarica.Render.Canvas.Drawable.Player.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
	this.baseSprite.draw(ctx, timeStamp, rect);
	this.hairSprite.draw(ctx, timeStamp, rect);
	this.legsSprite.draw(ctx, timeStamp, rect);
	this.bodySprite.draw(ctx, timeStamp, rect);
};

Falarica.Render.Canvas.Drawable.Player.DefaultSprites = {
	Base: "humanM",
	Body: "leatherArmour",
	Legs: "legArmor01",
	Hair: "aragorn"
};