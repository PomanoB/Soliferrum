
var inherits = require("inherits");
var Group = require("../group");
var NinePatch = require("../../drawable/ninepatch");

/**
 * @param {number} width
 * @param {number} height
 * @constructor
 */
var UIScreen = function(width, height)
{
	Group.call(this, width, height);

	var text = new NinePatch("activeWindow", width, height);
	this.setTexture(text);
};
inherits(UIScreen, Group);

UIScreen.prototype.show = function()
{
};

UIScreen.prototype.hide = function()
{
};

UIScreen.prototype.update = function(timeStamp)
{
};

module.exports = UIScreen;