
goog.require("Falarica.Render.Canvas.UI.Actor");

goog.provide("Falarica.Render.Canvas.UI.TextBox");

Falarica.Render.Canvas.UI.TextBox = function(width, height)
{
	Falarica.Render.Canvas.UI.Actor.call(this, width, height);

	this.text = "";

	/** @type {goog.math.Box} */
	this.paddingBox = new goog.math.Box(0, 0, 0, 0);
	this.scrollTop = 0;
	/** @type {Falarica.Render.Canvas.UI.TextBox.TextAlign} */
	this.textAlign = Falarica.Render.Canvas.UI.TextBox.TextAlign.Left;

	/** {Array.<{text: string, width: number}>} */
	this.lines_ = null;
};
goog.inherits(Falarica.Render.Canvas.UI.TextBox, Falarica.Render.Canvas.UI.Actor);

Falarica.Render.Canvas.UI.TextBox.prototype.setText = function(text)
{
	this.text = text;
	this.lines_ = null;
};

Falarica.Render.Canvas.UI.TextBox.prototype.draw = function(ctx, timeStamp)
{
	Falarica.Render.Canvas.UI.TextBox.superClass_.draw.call(this, ctx, timeStamp);

	if (this.font)
		ctx.font = this.font;
	ctx.textBaseline = "hanging";

	if (this.lines_ === null)
		this.calcLines_(ctx);
	var currHeight = this.paddingBox.top;
	var skipLines = this.scrollTop / this.lineHeight | 0;
	var scrollOffset = this.scrollTop - this.lineHeight * skipLines;
	var i = 0;
	ctx.rect(
		this.paddingBox.left,
		this.paddingBox.top,
		this.width - this.paddingBox.left - this.paddingBox.right,
		this.height - this.paddingBox.top - this.paddingBox.bottom);
	ctx.clip();
	var leftPosition;
	for(i = 0; i < this.lines_.length; i++)
	{
		if (i < skipLines)
			continue;
		if (currHeight >= this.height)
			break;
		leftPosition = this.getTextLineLeftCoordinate_(this.lines_[i]);
		ctx.fillText(this.lines_[i].text, leftPosition, currHeight - scrollOffset);
		currHeight += this.lineHeight;
	}
};

/**
 * @param {{text: string, width: number}} line
 * @return {number}
 * @private
 */
Falarica.Render.Canvas.UI.TextBox.prototype.getTextLineLeftCoordinate_ = function(line)
{
	var left = 0;
	switch (this.textAlign)
	{
		case Falarica.Render.Canvas.UI.TextBox.TextAlign.Left:
			left = this.paddingBox.left;
			break;
		case Falarica.Render.Canvas.UI.TextBox.TextAlign.Center:
			left = (this.width - line.width - this.paddingBox.left - this.paddingBox.right) / 2 | 0;
			break;
		case Falarica.Render.Canvas.UI.TextBox.TextAlign.Right:
			left = this.width - line.width - this.paddingBox.right;
			break;
	}
	return Math.max(this.paddingBox.left, left);
};

Falarica.Render.Canvas.UI.TextBox.prototype.calcLines_ = function(ctx)
{
	var words = this.text.split(/\s+/g);
	var availableWidth = this.width - this.paddingBox.left - this.paddingBox.right;

	this.lines_ = [];
	while(words.length)
	{
		this.lines_.push(this.calcOneLine_(ctx, words, availableWidth));
	}
};

Falarica.Render.Canvas.UI.TextBox.prototype.calcOneLine_ = function(ctx, words, maxWidth)
{
	var currLine = "";
	var currWordIndex = 0;
	var lineSize;
	var lastSize = 0;
	while(currWordIndex < words.length)
	{
		lineSize = ctx.measureText(currLine ? currLine + " " + words[currWordIndex] : words[currWordIndex]);
		if (lineSize.width > maxWidth)
			break;
		currLine += currLine ? (" " + words[currWordIndex]) : words[currWordIndex];
		lastSize = lineSize.width;
		currWordIndex++;
	}
	words.splice(0, currWordIndex);
	return {
		text: currLine,
		width: lastSize || lineSize.width
	};
};

/** @enum {number} */
Falarica.Render.Canvas.UI.TextBox.TextAlign = {
	Left: 0,
	Right: 1,
	Center: 2
};