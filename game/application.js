
var spriteManager = require("./render/spritemanager");

var MenuScreen = require("./render/ui/sreen/menuscreen");
var OptionsScreen = require("./render/ui/sreen/optionsscreen");
var GameScreen = require("./render/ui/sreen/gamescreen");

var Application = function()
{
	this.renderer = null;
	/** @type {SpriteManager} */
	this.spriteManager = spriteManager;

	this.viewWidth = 0;
	this.viewHeight = 0;

	this.drawDelegate = this.draw.bind(this);
};

Application.prototype.resourcesLoaded_ = function()
{
//	this.showMainMenu();
//	this.draw(0);
	this.showOptions();
	this.draw(0);
};

Application.prototype.loadResources_ = function()
{
	this.spriteManager.on("imagesLoaded", this.resourcesLoaded_.bind(this));

	var spritesDescr = require("./render/spritesdescr");
	spritesDescr.loadSprites(this.spriteManager);
	var playerTiles = require("./render/playertiles");
	playerTiles.loadSprites(this.spriteManager);

	//TODO this.showLoadingScreen();
};

Application.prototype.setRenderOutput = function(domElement)
{
	if (domElement.tagName !== "CANVAS")
		throw new Error("Unsupported render element!");

	this.viewWidth = domElement.offsetWidth;
	this.viewHeight = domElement.offsetHeight;
	var CanvasRenderer = require("./render/canvas");
	this.renderer = new CanvasRenderer(domElement);
};

Application.prototype.showMainMenu = function()
{
	this.renderer.setScreen(new MenuScreen(this.viewWidth, this.viewHeight));
};

Application.prototype.showOptions = function()
{
	this.renderer.setScreen(new OptionsScreen(this.viewWidth, this.viewHeight));
};

Application.prototype.showGameScreen = function()
{
	this.renderer.setScreen(new GameScreen(this.viewWidth, this.viewHeight));
};

Application.prototype.draw = function(timeStamp)
{
	this.renderer.draw(timeStamp);
	requestAnimationFrame(this.drawDelegate);
};

Application.prototype.start = function(timeStamp)
{
	this.loadResources_();
};

module.exports = new Application();