
goog.require("goog.dom.TagName");

goog.require("Falarica.Render.Canvas.UI.MenuScreen");
goog.require("Falarica.Render.Canvas.UI.OptionsScreen");
goog.require("Falarica.Render.Canvas.UI.GameScreen");
goog.require("Falarica.Render.Canvas.SpriteManager");
goog.require("Falarica.Render.Canvas.Renderer");
goog.require("Falarica.Render.Canvas.UISprite");
goog.require("Falarica.Render.Canvas.PlayerTiles");
goog.require("Falarica.Utils");

goog.provide("Falarica.Application");
goog.provide("Falarica.Application.RenderType");

Falarica.Application = function()
{
	this.renderer = null;
	/** @type {Falarica.Render.Canvas.SpriteManager} */
	this.spriteManager = Falarica.Render.Canvas.SpriteManager.getInstance();

	this.viewWidth = 0;
	this.viewHeight = 0;

	this.drawDelegate = goog.bind(this.draw, this);
};
goog.addSingletonGetter(Falarica.Application);

Falarica.Application.prototype.resourcesLoaded_ = function()
{
	this.showMainMenu();
//	this.showGameScreen();
	this.draw(0);
};

Falarica.Application.prototype.loadResources_ = function()
{
	this.spriteManager.onLoadComplete = goog.bind(this.resourcesLoaded_, this);
	this.spriteManager.load(Falarica.Render.Canvas.UISprite);
	this.spriteManager.load(Falarica.Render.Canvas.TilesetDescription);
	this.spriteManager.load(Falarica.Render.Canvas.TilesetDescription2);
	this.spriteManager.load(Falarica.Render.Canvas.BackgroundLava);
	this.spriteManager.load(Falarica.Render.Canvas.AnimatedBlood);
	Falarica.Render.Canvas.PlayerTiles.loadPlayerTiles(this);
	//TODO this.showLoadingScreen();
};

Falarica.Application.prototype.setRenderOutput = function(domElement)
{
	if (domElement.tagName !== goog.dom.TagName.CANVAS)
		throw new Error("Unsupported render element!");

	this.viewWidth = domElement.offsetWidth;
	this.viewHeight = domElement.offsetHeight;
	this.renderer = new Falarica.Render.Canvas.Renderer(domElement);
};

Falarica.Application.prototype.showMainMenu = function()
{
	this.renderer.setScreen(new Falarica.Render.Canvas.UI.MenuScreen(this.viewWidth, this.viewHeight));
};

Falarica.Application.prototype.showOptions = function()
{
	this.renderer.setScreen(new Falarica.Render.Canvas.UI.OptionsScreen(this.viewWidth, this.viewHeight));
};

Falarica.Application.prototype.showGameScreen = function()
{
	this.renderer.setScreen(new Falarica.Render.Canvas.UI.GameScreen(this.viewWidth, this.viewHeight));
};

Falarica.Application.prototype.draw = function(timeStamp)
{
	this.renderer.draw(timeStamp);
	requestAnimationFrame(this.drawDelegate);
};

Falarica.Application.prototype.start = function(timeStamp)
{
	this.loadResources_();
};
