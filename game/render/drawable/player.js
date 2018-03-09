
var inherits = require("inherits");

var BaseDrawable = require("./basedrawable");

var PlayerModel = function()
{
	BaseDrawable.call(this);

	var manager = require("../spritemanager");

	this.baseSprite = manager.getSprite(PlayerModel.DefaultSprites.Base);
	this.bodySprite = manager.getSprite(PlayerModel.DefaultSprites.Body);
	this.legsSprite = manager.getSprite(PlayerModel.DefaultSprites.Legs);
	this.hairSprite = manager.getSprite(PlayerModel.DefaultSprites.Hair);
};
inherits(PlayerModel, BaseDrawable);

PlayerModel.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
	this.baseSprite.draw(ctx, timeStamp, rect);
	this.hairSprite.draw(ctx, timeStamp, rect);
	this.legsSprite.draw(ctx, timeStamp, rect);
	this.bodySprite.draw(ctx, timeStamp, rect);
};

PlayerModel.DefaultSprites = {
	Base: "humanM",
	Body: "leatherArmour",
	Legs: "legArmor01",
	Hair: "aragorn"
};

module.exports = PlayerModel;
