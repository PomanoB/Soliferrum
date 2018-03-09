
goog.require("Falarica.Render.Canvas.UI.Group");

goog.provide("Falarica.Render.Canvas.UI.Screen");

Falarica.Render.Canvas.UI.Screen = function(width, height)
{
	Falarica.Render.Canvas.UI.Group.call(this, width, height);

	var text = new Falarica.Render.Canvas.Drawable.NinePatch("activeWindow", width, height);
	this.setTexture(text);
};
goog.inherits(Falarica.Render.Canvas.UI.Screen, Falarica.Render.Canvas.UI.Group);

Falarica.Render.Canvas.UI.Screen.prototype.show = function()
{
};

Falarica.Render.Canvas.UI.Screen.prototype.hide = function()
{
};

Falarica.Render.Canvas.UI.Screen.prototype.update = function(timeStamp)
{
};
