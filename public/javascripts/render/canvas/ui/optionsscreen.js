
goog.require("Falarica.Render.Canvas.UI.Screen");
goog.require("Falarica.Render.Canvas.SpriteManager");
goog.require("Falarica.Render.Canvas.UI.Player");
goog.require("Falarica.Render.Canvas.UI.Scroller");

goog.provide("Falarica.Render.Canvas.UI.OptionsScreen");

Falarica.Render.Canvas.UI.OptionsScreen = function(width, height)
{
	Falarica.Render.Canvas.UI.Screen.call(this, width, height);

//	var button = new Falarica.Render.Canvas.UI.Button(100, 50);
//	button.rect.left = 20;
//	button.rect.top = height - 100;
//	button.setText("Next body");
//	button.setFont("small-caps bold 18px arial", 18 * 1.2);

//	button.onActivate = goog.bind(function() {
////		var app = Falarica.Application.getInstance();
////		app.showMainMenu();
//
//		this.playerBase = manager.getSprite(this.playerBaseVariants[(++this.playerBaseIndex) % this.playerBaseVariants.length]);
//	}, this);
//	this.addChild(button);

	var manager = Falarica.Render.Canvas.SpriteManager.getInstance();

	this.playerBaseVariants = Object.keys(Falarica.Render.Canvas.PlayerTiles.Base.sprites);
	this.playerBaseIndex = 0;

	var player = this.player = new Falarica.Render.Canvas.UI.Player();
	this.player.rect.left = 20;
	this.player.rect.top = 100;
	this.addChild(this.player);
//	this.playerBody = manager.getSprite("animalSkin");

	this.scroller = new Falarica.Render.Canvas.UI.Scroller(200, 14);
	this.scroller.rect.left = 20;
	this.scroller.rect.top = 200;
	this.addChild(this.scroller);
	this.scroller.setChooseList(Object.keys(Falarica.Render.Canvas.PlayerTiles.Base.sprites));

	this.scroller.onChange = function(newValue)
	{
		player.baseSprite = manager.getSprite(newValue);
	};

	this.setFont("small-caps bold 14px arial", 14 * 1.2);
};
goog.inherits(Falarica.Render.Canvas.UI.OptionsScreen, Falarica.Render.Canvas.UI.Screen);

Falarica.Render.Canvas.UI.OptionsScreen.prototype.draw = function(ctx, timeStamp)
{
	Falarica.Render.Canvas.UI.OptionsScreen.superClass_.draw.call(this, ctx, timeStamp);
};