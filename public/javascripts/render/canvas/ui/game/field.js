
goog.require("goog.math.Coordinate");
goog.require("goog.math.Rect");

goog.require("Falarica.Render.Canvas.UI.Actor");
goog.require("Falarica.Render.Canvas.SpriteManager");
goog.require("Falarica.Render.Canvas.UI.Game.EntityRender");
goog.require("Falarica.Render.Canvas.Drawable.JumpFilter");
goog.require("Falarica.Render.Canvas.Drawable.FilterQueue");

goog.provide("Falarica.Render.Canvas.UI.Game.Field");

Falarica.Render.Canvas.UI.Game.Field = function(width, height)
{
	Falarica.Render.Canvas.UI.Actor.call(this, width, height);

	this.player = new Falarica.Render.Canvas.Drawable.Player();
	Falarica.Render.Canvas.Utils.Drawing.MoveTransition(this.player, 300);
	Falarica.Render.Canvas.Utils.Drawing.Offset(this.player, new goog.math.Coordinate(13, 9));

	/** @type {Falarica.Game} */
	this.game = null;

	this.hexSize = Falarica.Render.Canvas.UI.Game.Field.HexagonSize;

	this.spriteManager = Falarica.Render.Canvas.SpriteManager.getInstance();

	this.lavaSprite = this.spriteManager.getSprite("lavaBackground");
	this.lightOverlay = this.spriteManager.getSprite("lightHexOverlay");
	this.darkOverlay = this.spriteManager.getSprite("darkHexOverlay");

	this.mousePos = null;
	this.lastPathToMouse = null;

	this.entRender = new Falarica.Render.Canvas.UI.Game.EntityRender(this);

	/**
	 * @type {goog.math.Rect}
	 * @private
	 */
	this.currDrawingRect_ = new goog.math.Rect(0, 0, 0, 0);
};
goog.inherits(Falarica.Render.Canvas.UI.Game.Field, Falarica.Render.Canvas.UI.Actor);

Falarica.Render.Canvas.UI.Game.Field.prototype.draw = function(ctx, timeStamp)
{
	if (this.game === null)
		return;

	this.lavaSprite.draw(ctx, timeStamp, 0, 0, this.width, this.height);

	this.game.board.board.forEach(function(column, i){
		column.forEach(function(hex, j){
			var coord = this.hexToScreen(i, j);
			if (hex.contents !== Falarica.Board.Hexagon.Contents.Empty)
			{
				var hexSprite = this.spriteManager.getSprite(hex.type);
				this.currDrawingRect_.left = coord.x;
				this.currDrawingRect_.top = coord.y;
				this.currDrawingRect_.width = hexSprite.width;
				this.currDrawingRect_.height = coord.height;
				hexSprite.draw(ctx, timeStamp, this.currDrawingRect_);
			}
		}, this);
	}, this);

	this.game.entities.forEach(function(entity){
		this.entRender.drawEntity(entity, ctx, timeStamp);
	}, this);

	this.drawOverlayPath_(ctx, timeStamp);
};

Falarica.Render.Canvas.UI.Game.Field.prototype.drawOverlayPath_ = function(ctx, timeStamp)
{
	if (this.lastPathToMouse === null || this.lastPathToMouse.length <= 0)
		return;

	ctx.globalCompositeOperation = "multiply";
	var coord;
	for(var i = 0; i < this.lastPathToMouse.length; i++)
	{
		coord = this.hexToScreen(this.lastPathToMouse[i]);
		this.currDrawingRect_.left = coord.x;
		this.currDrawingRect_.top = coord.y;
		if (i !== this.lastPathToMouse.length - 1)
			this.lightOverlay.draw(ctx, timeStamp, this.currDrawingRect_);
		else
			this.darkOverlay.draw(ctx, timeStamp, this.currDrawingRect_);
	}
	ctx.globalCompositeOperation = "source-over";
};

Falarica.Render.Canvas.UI.Game.Field.prototype.hexToScreen = function(i, j)
{
	if (j === undefined)
	{
		j = i.y;
		i = i.x;
	}
	var coord = new goog.math.Coordinate();
	coord.x = i * this.hexSize * 3 / 2 | 0;

	var height = Math.sqrt(3) * this.hexSize;
	coord.y = j * height;
	if (i % 2)
		coord.y += height/2;
	coord.y = coord.y | 0;
	return coord;
};

Falarica.Render.Canvas.UI.Game.Field.prototype.getHexByCoordinate = function(coord)
{
	var S = this.hexSize * 3 / 2;
	var H = Math.sqrt(3) * this.hexSize;
	var it = Math.floor(coord.x / S);
	var yts = coord.y - (it % 2) * H / 2;
	var jt = Math.floor(yts / H);
	var xt = coord.x - it * S;
	var yt = yts - jt * H;

	var i = it;
	if (xt <= this.hexSize * Math.abs(1/2 - yt/H))
		i--;
	var dj = yt > H/2 ? 1 : 0;
	var j = jt;
	if (xt <= this.hexSize * Math.abs(1/2 - yt/H))
		j = j - i % 2 + dj;

	return new goog.math.Coordinate(i, j);
};


Falarica.Render.Canvas.UI.Game.Field.prototype.onMouseOut = function()
{
	Falarica.Render.Canvas.UI.Game.Field.superClass_.onMouseOut.call(this);

	this.mousePos = null;
};

Falarica.Render.Canvas.UI.Game.Field.prototype.onMouseMove = function(coord)
{
	Falarica.Render.Canvas.UI.Game.Field.superClass_.onMouseOver.call(this, coord);

	var currMousePos = this.getHexByCoordinate(coord);
	if (currMousePos !== null)
	{
		if (this.mousePos === null || (this.mousePos.x !== currMousePos.x || this.mousePos.y !== currMousePos.y))
		{
			this.lastPathToMouse = this.game.board.findPath(this.game.player.origin, currMousePos);
			this.mousePos = currMousePos;
		}
	}
	else
	{
		this.mousePos = null;
		this.lastPathToMouse = null;
	}
};

Falarica.Render.Canvas.UI.Game.Field.prototype.onMouseUp = function(coord)
{
	if (!this.isMousePressed)
		return true;

	Falarica.Render.Canvas.UI.Button.superClass_.onMouseUp.call(this, coord);

	var hex = this.getHexByCoordinate(coord);
	if (!this.game.rules.playerCanMoveToCoord(hex))
		return true;

	var path = this.game.board.findPath(this.game.player.origin, hex);
	if (path === null || !path.length)
		return true;

	if (!this.game.rules.requestMove(this.game.player.origin, path[0]))
		return true;

	var filters = new Falarica.Render.Canvas.Drawable.FilterQueue();
	var i = 0;
	while(i < path.length)
	{
		filters.addFilter(
			new Falarica.Render.Canvas.Drawable.JumpFilter(
				this.hexToScreen(i === 0 ? this.game.player.origin : path[i - 1]),
				this.hexToScreen(path[i]),
				Falarica.GameRules.kPlayerActionDelay * 2));
		i++;
	}

	this.game.player.model.addFilter(filters, true);

	this.game.player.setOrigin(path[0]);
	this.game.setThinkToMonsters(this.game.gameTime);

	return true;
};

Falarica.Render.Canvas.UI.Game.Field.HexagonSize = 30;