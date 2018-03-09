
goog.provide("Falarica.Utils");

Falarica.Utils.RandomGenerator = function(seed)
{
	this.lastRnd = seed;
};

Falarica.Utils.RandomGenerator.prototype.next_ = function()
{
	var rnd = (Falarica.Utils.RandomGenerator.kA * this.lastRnd + Falarica.Utils.RandomGenerator.kB) % Falarica.Utils.RandomGenerator.kM;
	this.lastRnd = rnd;
	return rnd;
};

Falarica.Utils.RandomGenerator.prototype.nextBool = function()
{
	return this.next_() > Falarica.Utils.RandomGenerator.kM / 2;
};

Falarica.Utils.RandomGenerator.prototype.nextFloat = function()
{
	return this.next_() / Falarica.Utils.RandomGenerator.kM;
};

Falarica.Utils.RandomGenerator.prototype.next = function(min, max)
{
	if (min === undefined || max === undefined)
		return this.next_();
	return (this.next_() / Falarica.Utils.RandomGenerator.kM * (max - min) | 0) + min;
};

Falarica.Utils.RandomGenerator.kA = 7141;
Falarica.Utils.RandomGenerator.kB = 54773;
Falarica.Utils.RandomGenerator.kM = 259200;
