

var Hexagon = function(type, contents)
{
	/** @type {Hexagon.Type} */
	this.type = type || Hexagon.Type.Grass;
	/** @type {Hexagon.Contents} */
	this.contents = contents || Hexagon.Contents.Empty;

	switch(this.type)
	{
		case Hexagon.Type.Lava:
		case Hexagon.Type.Empty:
			this.contents = Hexagon.Contents.Empty;
			break;
		case Hexagon.Type.Stone:
			this.contents = Hexagon.Contents.Ground;
			break;
	}
};

/** @enum {string} */
Hexagon.Type = {
	Grass: "grass",
	Stone: "stone",
	Water: "water",
	Lava: "lava"
};

/** @enum {number} */
Hexagon.Contents = {
	Empty: 0,
	Solid: 1,
	Lava: 2,
	Ground: 3
};

module.exports = Hexagon;
