
goog.require("goog.array");

goog.require("Falarica.Render.Canvas.UI.Actor");

goog.provide("Falarica.Render.Canvas.UI.Group");

Falarica.Render.Canvas.UI.Group = function(width, height)
{
	Falarica.Render.Canvas.UI.Actor.call(this, width, height);

	/** @type {Falarica.Render.Canvas.UI.Actor} */
	this.children = [];
};
goog.inherits(Falarica.Render.Canvas.UI.Group, Falarica.Render.Canvas.UI.Actor);

Falarica.Render.Canvas.UI.Group.prototype.draw = function(ctx, timeStamp)
{
	Falarica.Render.Canvas.UI.Group.superClass_.draw.call(this, ctx, timeStamp);

	goog.array.forEach(this.children, function(child){
		ctx.save();
		ctx.translate(child.rect.left, child.rect.top);
		child.draw(ctx, timeStamp);
		ctx.restore();
	}, this);
};

Falarica.Render.Canvas.UI.Group.prototype.addChild = function(child)
{
	this.children.push(child);
};

Falarica.Render.Canvas.UI.Group.prototype.setFont = function(fontStr, lineHeight)
{
	Falarica.Render.Canvas.UI.Group.superClass_.setFont.call(this);
	goog.array.forEach(this.children, function(child){
		child.setFont(fontStr, lineHeight);
	}, this);
};

Falarica.Render.Canvas.UI.Group.prototype.onMouseOut = function()
{
	Falarica.Render.Canvas.UI.Group.superClass_.onMouseOut.call(this);
	var i = 0;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		if (!this.children[i].isMouseHover)
			continue;
		this.children[i].onMouseOut();
	}
};

Falarica.Render.Canvas.UI.Group.prototype.onMouseMove = function(coord)
{
	Falarica.Render.Canvas.UI.Group.superClass_.onMouseMove.call(this, coord);
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
			newCoord = new goog.math.Coordinate(coord.x - rect.left, coord.y - rect.top);
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

Falarica.Render.Canvas.UI.Group.prototype.onMouseDown = function(coord)
{
	Falarica.Render.Canvas.UI.Group.superClass_.onMouseDown.call(this, coord);

	var i = 0;
	var rect;
	var childCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
			continue;
		childCoord = new goog.math.Coordinate(coord.x - rect.left, coord.y - rect.top);
		if (this.children[i].onMouseDown(childCoord))
			return true;
	}
};

Falarica.Render.Canvas.UI.Group.prototype.onMouseUp = function(coord)
{
	Falarica.Render.Canvas.UI.Group.superClass_.onMouseUp.call(this, coord);

	var i = 0;
	var rect;
	var childCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
			continue;
		childCoord = new goog.math.Coordinate(coord.x - rect.left, coord.y - rect.top);
		if (this.children[i].onMouseUp(childCoord))
			return true;
	}
};
