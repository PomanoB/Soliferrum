
goog.require("goog.array");

goog.require("Falarica.Render.Canvas.UI.Group");
goog.require("Falarica.Render.Canvas.UI.TextBox");
goog.require("Falarica.Render.Canvas.UI.Button");

goog.provide("Falarica.Render.Canvas.UI.Scroller");

Falarica.Render.Canvas.UI.Scroller = function(width, height)
{
	Falarica.Render.Canvas.UI.Group.call(this, width, height);

	var manager = Falarica.Render.Canvas.SpriteManager.getInstance();

	var spriteLeftNormal = manager.getSprite("hDecoScrollbarLeftNormal");
	this.scrollLeft = new Falarica.Render.Canvas.UI.Button(spriteLeftNormal.width, spriteLeftNormal.height);
	this.scrollLeft.setNormalTexture(spriteLeftNormal);
	this.scrollLeft.setHoverTexture(manager.getSprite("hDecoScrollbarLeftHover"));

	var spriteRightNormal = manager.getSprite("hDecoScrollbarRightNormal");
	this.scrollRight = new Falarica.Render.Canvas.UI.Button(spriteRightNormal.width, spriteRightNormal.height);
	this.scrollRight.setNormalTexture(spriteRightNormal);
	this.scrollRight.setHoverTexture(manager.getSprite("hDecoScrollbarRightHover"));

	/** @type {Falarica.Render.Canvas.UI.TextBox} */
	this.text = new Falarica.Render.Canvas.UI.TextBox(
		Math.max(width - spriteLeftNormal.width - spriteRightNormal.width, 0), height);
	this.text.textAlign = Falarica.Render.Canvas.UI.TextBox.TextAlign.Center;

	this.scrollRight.rect.left = width - spriteRightNormal.width;
	this.text.rect.left = spriteLeftNormal.width;

	this.addChild(this.scrollLeft);
	this.addChild(this.scrollRight);
	this.addChild(this.text);

	this.chooseList = [];
	this.selectedIndex = -1;

	this.cycleScroll = false;

	this.onChange = goog.nullFunction;

	this.scrollRight.onActivate = goog.bind(this.onScrollRight, this);
	this.scrollLeft.onActivate = goog.bind(this.onScrollLeft, this);
};
goog.inherits(Falarica.Render.Canvas.UI.Scroller, Falarica.Render.Canvas.UI.Group);

Falarica.Render.Canvas.UI.Scroller.prototype.setChooseList = function(list)
{
	this.chooseList = list;
	if (list.length)
		this.setSelectedIndex(0);
	else
		this.selectedIndex = -1;
};

Falarica.Render.Canvas.UI.Scroller.prototype.setSelectedIndex = function(index)
{
	if (index >= this.chooseList.length || index < 0)
		return false;
	this.selectedIndex = index;
	this.text.setText(this.chooseList[index].toString());
};

Falarica.Render.Canvas.UI.Scroller.prototype.onScrollRight = function()
{
	var newIndex = this.selectedIndex + 1;
	if (newIndex >= this.chooseList.length)
	{
		if (!this.cycleScroll)
			return;
		newIndex = 0;
	}
	this.callOnChange_(newIndex);
};

Falarica.Render.Canvas.UI.Scroller.prototype.onScrollLeft = function()
{
	var newIndex = this.selectedIndex - 1;
	if (newIndex < 0)
	{
		if (!this.cycleScroll)
			return;
		newIndex = this.chooseList.length - 1;
	}
	this.callOnChange_(newIndex);
};

Falarica.Render.Canvas.UI.Scroller.prototype.callOnChange_ = function(newIndex)
{
	if (!this.onChange(this.chooseList[newIndex], this.chooseList[this.selectedIndex], newIndex, this.selectedIndex))
		this.setSelectedIndex(newIndex);
};