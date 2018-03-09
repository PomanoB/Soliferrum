
var inherits = require("inherits");
var UIScreen = require("./screen");
var Button = require("../button");
var Scroller = require("../scroller");
var UIPlayer = require("../player");

var PlayerTiles = require("../../playertiles");

var OptionsScreen = function(width, height)
{
	Falarica.Render.Canvas.UI.Screen.call(this, width, height);

	var manager = require("../../spritemanager");

	this.playerBaseVariants = Object.keys(PlayerTiles.Base.sprites);
	this.playerBaseIndex = 0;

	var player = this.player = new UIPlayer();
	this.player.rect.left = 20;
	this.player.rect.top = 100;
	this.addChild(this.player);
//	this.playerBody = manager.getSprite("animalSkin");

	this.scroller = new Scroller(200, 14);
	this.scroller.rect.left = 20;
	this.scroller.rect.top = 200;
	this.addChild(this.scroller);
	this.scroller.setChooseList(Object.keys(PlayerTiles.Base.Base.sprites));

	this.scroller.onChange = function(newValue)
	{
		player.baseSprite = manager.getSprite(newValue);
	};

	this.setFont("small-caps bold 14px arial", 14 * 1.2);
};
inherits(OptionsScreen, UIScreen);

OptionsScreen.prototype.draw = function(ctx, timeStamp)
{
	OptionsScreen.super_prototype.draw.call(this, ctx, timeStamp);
};