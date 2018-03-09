

var inherits = require("inherits");

var Rectangle = function(x, y, w, h)
{
	/** @type {number} */
	this.left = x;
	/** @type {number} */
	this.top = y;
	/** @type {number} */
	this.width = w;
	/** @type {number} */
	this.height = h;
};

/**
 * @param {Coordinate} coord
 * @rturn {boolean}
 */
Rectangle.prototype.contains = function(coord)
{
	return  coord.x >= this.left &&
			coord.x <= this.left + this.width &&
			coord.y >= this.top &&
			coord.y <= this.top + this.height;
};

var Coordinate = function(opt_x, opt_y)
{
	/** @type {number} */
	this.x = opt_x !== undefined ? opt_x : 0;
	/** @type {number} */
	this.y = opt_y !== undefined ? opt_y : 0;
};
Coordinate.prototype.toString = function()
{
	return "" + this.x + "," + this.y;
};
Coordinate.prototype.clone = function()
{
	return new Coordinate(this.x, this.y);
};

var Vector = function(opt_x, opt_y)
{
	Coordinate.call(this, opt_x, opt_y)
};
inherits(Vector, Coordinate);

Vector.prototype.magnitude = function()
{
	return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector.prototype.normalize = function() {
	return this.mul(1 / this.magnitude());
};
Vector.prototype.mul = function(multipler) {
	this.x *= multipler;
	this.y *= multipler;
	return this;
};
Vector.prototype.rotate = function(angle) {

	var cos = Math.cos(angle);
	var sin = Math.sin(angle);

	var x = this.x * cos - this.y * sin;
	var y = this.y * cos + this.x * sin;

	this.x = x;
	this.y = y;

	return this;
};

var Range = function(sart, end)
{
	this.start = sart < end ? sart : end;
	this.end = sart < end ? end : sart;
};

var RandomGenerator = function(seed)
{
	this.lastRnd = seed;
};

RandomGenerator.prototype.next_ = function()
{
	var rnd = (RandomGenerator.kA * this.lastRnd + RandomGenerator.kB) % RandomGenerator.kM;
	this.lastRnd = rnd;
	return rnd;
};

RandomGenerator.prototype.nextBool = function()
{
	return this.next_() > RandomGenerator.kM / 2;
};

RandomGenerator.prototype.nextFloat = function()
{
	return this.next_() / RandomGenerator.kM;
};

RandomGenerator.prototype.next = function(min, max)
{
	if (min === undefined || max === undefined)
		return this.next_();
	return (this.next_() / RandomGenerator.kM * (max - min) | 0) + min;
};

RandomGenerator.kA = 7141;
RandomGenerator.kB = 54773;
RandomGenerator.kM = 259200;

module.exports.Rectangle = Rectangle;
module.exports.Coordinate = Coordinate;
module.exports.Vector = Vector;
module.exports.Range = Range;
module.exports.RandomGenerator = RandomGenerator;