
goog.provide("Falarica.Board.Hexagon");
goog.provide("Falarica.Board.Hexagon.Type");

Falarica.Board.Hexagon = function(type, contents)
{
	/** @type {Falarica.Board.Hexagon.Type} */
	this.type = type || Falarica.Board.Hexagon.Type.Grass;
	/** @type {Falarica.Board.Hexagon.Contents} */
	this.contents = contents || Falarica.Board.Hexagon.Contents.Empty;

	switch(this.type)
	{
		case Falarica.Board.Hexagon.Type.Lava:
		case Falarica.Board.Hexagon.Type.Empty:
			this.contents = Falarica.Board.Hexagon.Contents.Empty;
			break;
		case Falarica.Board.Hexagon.Type.Stone:
			this.contents = Falarica.Board.Hexagon.Contents.Ground;
			break;
	}
};

/** @enum {string} */
Falarica.Board.Hexagon.Type = {
	Grass: "grass",
	Stone: "stone",
	Water: "water",
	Lava: "lava"
};

/** @enum {number} */
Falarica.Board.Hexagon.Contents = {
	Empty: 0,
	Solid: 1,
	Lava: 2,
	Ground: 3
};