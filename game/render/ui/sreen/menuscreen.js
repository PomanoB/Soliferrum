
var inherits = require("inherits");
var UIScreen = require("./screen");
var Button = require("../button");

var MenuScreen = function(width, height)
{
	UIScreen.call(this, width, height);

	var button = new Button(100, 50);
	button.rect.left = 20;
	button.rect.top = 20;
	button.setText("New Game");
	button.setFont("small-caps bold 18px arial", 18 * 1.2);
	this.addChild(button);

	button = new Button(100, 50);
	button.rect.left = 20;
	button.rect.top = 90;
	button.setText("Options");
	button.setFont("small-caps bold 18px arial", 18 * 1.2);

//	button.onActivate = function() {
//		var app = Falarica.Application.getInstance();
//		app.showGameScreen();
//	};
	this.addChild(button);
};
inherits(MenuScreen, UIScreen);

MenuScreen.prototype.show = function()
{

};

MenuScreen.prototype.hide = function()
{
};

MenuScreen.prototype.update = function(timeStamp)
{
};

module.exports = MenuScreen;
