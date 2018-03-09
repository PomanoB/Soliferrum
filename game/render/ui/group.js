
var inherits = require("inherits");

var Actor = require("./actor");
var mathUtils = require("../../util/math");
var Coordinate = mathUtils.Coordinate;

var Group = function(width, height)
{
	Actor.call(this, width, height);

	/** @type {Actor} */
	this.children = [];
};
inherits(Group, Actor);

Group.prototype.draw = function(ctx, timeStamp)
{
	Group.super_.prototype.draw.call(this, ctx, timeStamp);

	this.children.forEach(function(child){
		ctx.save();
		ctx.translate(child.rect.left, child.rect.top);
		child.draw(ctx, timeStamp);
		ctx.restore();
	}, this);
};

Group.prototype.addChild = function(child)
{
	this.children.push(child);
};

Group.prototype.setFont = function(fontStr, lineHeight)
{
	Group.super_.prototype.setFont.call(this);
	this.children.forEach(function(child){
		child.setFont(fontStr, lineHeight);
	}, this);
};

Group.prototype.onMouseOut = function()
{
	Group.super_.prototype.onMouseOut.call(this);
	var i = 0;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		if (!this.children[i].isMouseHover)
			continue;
		this.children[i].onMouseOut();
	}
};

Group.prototype.onMouseMove = function(coord)
{
	Group.super_.prototype.onMouseMove.call(this, coord);
	var i = 0;
	var moveCatched = false;
	var rect;
	var newCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
		{
			if (this.children[i].isMouseHover)
				this.children[i].onMouseOut();
			continue;
		}
		if (!moveCatched)
		{
			newCoord = new Coordinate(coord.x - rect.left, coord.y - rect.top);
			if (!this.children[i].isMouseHover)
				this.children[i].onMouseOver(newCoord);
			this.children[i].onMouseMove(newCoord);
			moveCatched = true;
			continue;
		}
		if (this.children[i].isMouseHover)
			this.children[i].onMouseOut();
	}
};

Group.prototype.onMouseDown = function(coord)
{
	Group.super_.prototype.onMouseDown.call(this, coord);

	var i = 0;
	var rect;
	var childCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
			continue;
		childCoord = new Coordinate(coord.x - rect.left, coord.y - rect.top);
		if (this.children[i].onMouseDown(childCoord))
			return true;
	}
};

Group.prototype.onMouseUp = function(coord)
{
	Group.super_.prototype.onMouseUp.call(this, coord);

	var i = 0;
	var rect;
	var childCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
			continue;
		childCoord = new Coordinate(coord.x - rect.left, coord.y - rect.top);
		if (this.children[i].onMouseUp(childCoord))
			return true;
	}
};

module.exports = Group;
