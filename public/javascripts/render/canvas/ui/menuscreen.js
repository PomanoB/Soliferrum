
goog.require("Falarica.Render.Canvas.UI.Screen");
goog.require("Falarica.Render.Canvas.Drawable.NinePatch");
goog.require("Falarica.Render.Canvas.UI.Button");
goog.require("Falarica.Render.Canvas.UI.TextBox");
goog.require("Falarica.Application");

goog.provide("Falarica.Render.Canvas.UI.MenuScreen");

Falarica.Render.Canvas.UI.MenuScreen = function(width, height)
{
	Falarica.Render.Canvas.UI.Screen.call(this, width, height);

	var button = new Falarica.Render.Canvas.UI.Button(100, 50);
	button.rect.left = 20;
	button.rect.top = 20;
	button.setText("New Game");
	button.setFont("small-caps bold 18px arial", 18 * 1.2);

	button.onActivate = function() {
	};
	this.addChild(button);

	button = new Falarica.Render.Canvas.UI.Button(100, 50);
	button.rect.left = 20;
	button.rect.top = 90;
	button.setText("Options");
	button.setFont("small-caps bold 18px arial", 18 * 1.2);

	button.onActivate = function() {
		var app = Falarica.Application.getInstance();
		app.showGameScreen();
	};
	this.addChild(button);
};
goog.inherits(Falarica.Render.Canvas.UI.MenuScreen, Falarica.Render.Canvas.UI.Screen);

Falarica.Render.Canvas.UI.MenuScreen.prototype.show = function()
{

};

Falarica.Render.Canvas.UI.MenuScreen.prototype.hide = function()
{
};

Falarica.Render.Canvas.UI.MenuScreen.prototype.update = function(timeStamp)
{
};