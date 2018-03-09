
goog.require("goog.math.Rect");

goog.require("Falarica.Render.Canvas.Utils.Drawing");
goog.require("Falarica.Render.Canvas.Drawable.OffsetFilter");

goog.provide("Falarica.Render.Canvas.UI.Game.EntityRender");

Falarica.Render.Canvas.UI.Game.EntityRender = function(field)
{
	/** @type {Falarica.Render.Canvas.UI.Game.Field} */
	this.field = field;

	/**
	 * @type {goog.math.Rect}
	 * @private
	 */
	this.currDrawingRect_ = new goog.math.Rect(0, 0, 0, 0);
};

/**
 * @param {Falarica.Entity.Entity} ent
 * @param ctx
 * @param timeStamp
 */
Falarica.Render.Canvas.UI.Game.EntityRender.prototype.drawEntity = function(ent, ctx, timeStamp)
{
	if (!ent.visible)
		return;
	if (ent.model === null)
		this.setEntityModel_(ent);
	var coord = this.field.hexToScreen(ent.origin);

	this.currDrawingRect_.left = coord.x;
	this.currDrawingRect_.top = coord.y;
	this.currDrawingRect_.width = ent.model.width;
	this.currDrawingRect_.height = ent.model.height;

	ent.model.draw(ctx, timeStamp, this.currDrawingRect_);
};

/**
 * @param {Falarica.Entity.Entity} ent
 */
Falarica.Render.Canvas.UI.Game.EntityRender.prototype.setEntityModel_ = function(ent)
{
	var manager = Falarica.Render.Canvas.SpriteManager.getInstance();

	if (ent instanceof Falarica.Entity.Player)
	{
		ent.model = new Falarica.Render.Canvas.Drawable.Player();

		var offsetFilter = new Falarica.Render.Canvas.Drawable.OffsetFilter(
			Falarica.Render.Canvas.UI.Game.EntityRender.kQuadHexOffset);
		ent.model.addFilter(offsetFilter);
//		Falarica.Render.Canvas.Utils.Drawing.MoveTransition(ent.model, Falarica.Render.Canvas.UI.Game.EntityRender.kRenderMoveSpeed);
//		Falarica.Render.Canvas.Utils.Drawing.Offset(ent.model, Falarica.Render.Canvas.UI.Game.EntityRender.kQuadHexOffset);
	}
	else
	if (ent instanceof Falarica.Entity.Guard)
	{
		ent.model = manager.getSprite("vampireF");
		var offsetFilter = new Falarica.Render.Canvas.Drawable.OffsetFilter(
			Falarica.Render.Canvas.UI.Game.EntityRender.kQuadHexOffset);
		ent.model.addFilter(offsetFilter);
//		Falarica.Render.Canvas.Utils.Drawing.MoveTransition(ent.model, Falarica.Render.Canvas.UI.Game.EntityRender.kRenderMoveSpeed);
//		Falarica.Render.Canvas.Utils.Drawing.Offset(ent.model, Falarica.Render.Canvas.UI.Game.EntityRender.kQuadHexOffset);
	}
};

Falarica.Render.Canvas.UI.Game.EntityRender.kRenderMoveSpeed = 300
Falarica.Render.Canvas.UI.Game.EntityRender.kQuadHexOffset = new goog.math.Coordinate(13, 9);
