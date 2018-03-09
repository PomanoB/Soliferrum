
var events = require("events");

var inherits = require("inherits");

var Sprite = require("./drawable/sprite");
var AnimatedSprite = require("./drawable/animatedsprite");
var StaticPattern = require("./drawable/staticpattern");

/**
 * @extends {EventEmitter}
 * @constructor
 */
var SpriteManager = function()
{
	events.EventEmitter.call(this);

	this.images = {};
	this.spritesDesc = {};
	this.sprites = {};

	this.loadComplete = false;
	this.totalImages = 0;
	this.loadedImages = 0;

	this.imageLoadedDelegate = this.imageLoaded.bind(this);
};
inherits(SpriteManager, events.EventEmitter);

SpriteManager.prototype.load = function(descr)
{
	var image = descr.image;
	var sprites = descr.sprites;
	if (this.images[image] === undefined)
	{
		this.totalImages++;

		var img = new Image();
		img.onload = this.imageLoadedDelegate;
		img.src = image;
		this.images[image] = img;
	}
	var spriteName;
	for(spriteName in sprites)
	{
		if (!sprites.hasOwnProperty(spriteName))
			continue;
		this.spritesDesc[spriteName] = sprites[spriteName];
		this.spritesDesc[spriteName].img = this.images[image];
	}
};

SpriteManager.prototype.imageLoaded = function()
{
	this.loadedImages++;
	if (this.totalImages === this.loadedImages)
	{
		this.loadComplete = true;
		this.emit("imagesLoaded");
	}
};

SpriteManager.prototype.getSprite = function(name)
{
	var desc = this.spritesDesc[name];
	if (desc === undefined)
		return null;
	var sprite = this.sprites[name];
	if (sprite === undefined)
	{
		if (desc.anim !== undefined)
			sprite = new AnimatedSprite(desc);
		else
			sprite = new Sprite(desc);
		this.sprites[name] = sprite;
	}

	return sprite;
};

SpriteManager.prototype.getSpriteDescr = function(name) {
	var desc = this.spritesDesc[name];
	if (desc === undefined)
		return null;
	return desc;
};

SpriteManager.prototype.getPattern = function(name)
{
	var desc = this.spritesDesc[name];
	if (desc === undefined)
		return null;
	var sprite = this.sprites[name + "_pattern"];
	if (sprite === undefined)
	{
		sprite = new StaticPattern(name);
		this.sprites[name + "_pattern"] = sprite;
	}

	return sprite;
};

module.exports = new SpriteManager();
