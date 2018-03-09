
var mathUtils = require("../../../util/math");
var Rectangle = mathUtils.Rectangle;
var Coordinate = mathUtils.Coordinate;

var OffsetFilter = require("../../drawable/offsetfilter");
var PlayerModel = require("../../drawable/player");

var Player = require("../../../entity/player");
var Guard = require("../../../entity/gurad");

var EntityRender = function(field)
{
	/** @type {GameField} */
	this.field = field;

	/**
	 * @type {Rectangle}
	 * @private
	 */
	this.currDrawingRect_ = new Rectangle(0, 0, 0, 0);

	this.spriteManager = require("../../spritemanager");
};

EntityRender.prototype.drawEntity = function(ent, ctx, timeStamp)
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

EntityRender.prototype.setEntityModel_ = function(ent)
{
	if (ent instanceof Player)
	{
		ent.model = new PlayerModel();

		var offsetFilter = new OffsetFilter(EntityRender.kQuadHexOffset);
		ent.model.addFilter(offsetFilter);
	}
	else
	if (ent instanceof Guard)
	{
		ent.model = this.spriteManager.getSprite("vampireF");
		var offsetFilter = new OffsetFilter(EntityRender.kQuadHexOffset);
		ent.model.addFilter(offsetFilter);
	}
};

EntityRender.kRenderMoveSpeed = 300;
EntityRender.kQuadHexOffset = new Coordinate(13, 9);

module.exports = EntityRender;