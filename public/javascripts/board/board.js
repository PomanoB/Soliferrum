
goog.require("goog.math.Coordinate");
goog.require('goog.math.Range');
goog.require('goog.math.Vec2');

goog.require("Falarica.Board.Hexagon");

goog.provide("Falarica.Board.Board");
goog.provide("Falarica.Board.Board.Direction");

Falarica.Board.Board = function(diagonalSideHexCount, verticalSideHexCount)
{
	this.board = [];

	this.verticalSideHexCount = verticalSideHexCount;
	this.diagonalSideHexCount = diagonalSideHexCount;

	this.width = diagonalSideHexCount * 2 - 1;
	this.height = verticalSideHexCount * 2 - 1 + verticalSideHexCount;

	this.initBoard();

	console.log(this);
};

Falarica.Board.Board.prototype.initBoard = function()
{
	var i = 0;
	for(i = this.diagonalSideHexCount - 1; i >= 0; i--)
	{
		this.board.push(this.buildColumn(i));
		if (i !== this.diagonalSideHexCount - 1)
			this.board.unshift(this.buildColumn(i));
	}
};

Falarica.Board.Board.prototype.buildColumn = function(column)
{
	var result = [];
	var i = 0, hexCount = this.getColumnHexCount(column);
	var totalHexCount = this.getColumnHexCount(this.diagonalSideHexCount - 1);

	var oddColumn = (column % 2) && (this.diagonalSideHexCount % 2);
	var emptyCount = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalSideHexCount % 2) * (column % 2);

	for(i = 0; i < emptyCount; i++)
		result.push(new Falarica.Board.Hexagon(Falarica.Board.Hexagon.Type.Lava));

	for(i = 0; i < hexCount; i++)
	{
		if (Math.random() < 0.1 && false)
			result.push(new Falarica.Board.Hexagon(Falarica.Board.Hexagon.Type.Lava));
		else
			result.push(new Falarica.Board.Hexagon(Falarica.Board.Hexagon.Type.Stone));
	}
	for(i = 0; i < (oddColumn ? emptyCount + 1 : emptyCount); i++)
		result.push(new Falarica.Board.Hexagon(Falarica.Board.Hexagon.Type.Lava));

	return result;
};

/**
 * @param {number} column
 * @return {goog.math.Range}
 */
Falarica.Board.Board.prototype.getColumnInfo = function(column)
{
	var totalHexCount = this.getColumnHexCount(this.diagonalSideHexCount - 1);
	var hexCount = this.getColumnHexCount(column);
	var startHex = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalSideHexCount % 2) * (column % 2);
	return new goog.math.Range(startHex, startHex + hexCount);
};

Falarica.Board.Board.prototype.getColumnStartHex = function(column)
{
	var totalHexCount = this.getColumnHexCount(this.diagonalSideHexCount - 1);
	var hexCount = this.getColumnHexCount(column);
	return Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalSideHexCount % 2) * (column % 2);
};

Falarica.Board.Board.prototype.getColumnHexCount = function(column)
{
	if (column >= this.diagonalSideHexCount)
		column = this.diagonalSideHexCount - (column - this.diagonalSideHexCount) - 2;
	return this.verticalSideHexCount + column;
};

Falarica.Board.Board.prototype.getNeighbors = function(coord)
{
	if (!this.hexInBoard(coord))
		return [];

	var result = [];
	var n = 0;
	var neighbor;
	for(n = 0; n < 6; n++)
	{
		neighbor = new goog.math.Coordinate(
				coord.x + Falarica.Board.Board.neighborsDi_[n],
				coord.y + Falarica.Board.Board.neighborsDj_[coord.x % 2][n]);
		if (this.hexInBoard(neighbor))
			result.push(neighbor);
	}
	return result;
};

Falarica.Board.Board.prototype.hexInBoard = function(coord)
{
	if (coord === null)
		return false;
	if (coord.x < 0 || coord.y < 0)
		return false;
	if (coord.x >= this.width || coord.y >= this.height)
		return false;
	var info = this.getColumnInfo(coord.x);
	if (coord.y < info.start || coord.y >= info.end)
		return false;
	return true;
};

/**
 * @param coord
 * @return {Falarica.Board.Hexagon}
 */
Falarica.Board.Board.prototype.getHex = function(coord)
{
	if (this.hexInBoard(coord))
		return this.board[coord.x][coord.y];
	return null;
};

/**
 *
 * @param {goog.math.Coordinate} from
 * @param {goog.math.Coordinate} to
 * @return {!Array.<goog.math.Coordinate>}
 */
Falarica.Board.Board.prototype.findPath = function(from, to)
{
	if (!this.hexInBoard(from) || !this.hexInBoard(to))
		return null;

	var targetKey = to.toString();
	var open = {};
	var closed = {};
	open[from.toString()] = {
		cost: 0,
		approximateCost: this.getApproximateCost(from, to),
		parent: null,
		origin: from
	};
	var current;
	var neighbors = [];
	var currentCost = 0;
	var pathFinded = false;
	while(true)
	{
		current = this.getBestCost(open);
		if (current === null)
			return null;
		closed[current] = open[current];
		delete open[current];

		currentCost = closed[current].cost;

		neighbors = this.getNeighbors(closed[current].origin);
		neighbors.forEach(function(coord){
			var hex = this.getHex(coord);
			if (hex.contents !== Falarica.Board.Hexagon.Contents.Ground)
				return;

			var listKey = coord.toString();
			if (closed[listKey] !== undefined)
				return;
			var inOpen = open[listKey];
			var thisCost = currentCost + 1;
			if (inOpen !== undefined)
			{
				if (thisCost < inOpen.cost)
				{
					inOpen.cost = thisCost;
					inOpen.parent = current;
				}
			}
			else
			{
				if (targetKey !== listKey)
				{
					open[listKey] = {
						cost: thisCost,
						approximateCost: this.getApproximateCost(coord, to),
						parent: current,
						origin: coord
					};
				}
				else
					pathFinded = true;
			}
		}, this);
		if (pathFinded)
			return this.buildPath_(closed, current, to);
	}
};

Falarica.Board.Board.prototype.buildPath_ = function(closedList, current, to)
{
	var path = [to.clone()];
	while(closedList[current].parent !== null)
	{
		path.unshift(closedList[current].origin);
		current = closedList[current].parent;
	}
	return path;
};

Falarica.Board.Board.prototype.getBestCost = function(openList)
{
	var point;
	var minCost = Infinity, minPoint = null;
	for(point in openList)
	{
		if (openList[point].cost + openList[point].approximateCost < minCost)
		{
			minCost = openList[point].cost;
			minPoint = point;
		}
	}
	return minPoint;
};

Falarica.Board.Board.prototype.getApproximateCost = function(from, to)
{
	return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
};

Falarica.Board.Board.prototype.getDirection = function(from, to)
{
	if (from.x === to.x && from.y === to.y)
		return Falarica.Board.Board.Direction.None;

	var left = to.x < from.x;
	var right = to.x > from.x;
	if (!left && !right)
		return to.y < from.y ? Falarica.Board.Board.Direction.Top : Falarica.Board.Board.Direction.Bottom;
	var top = (to.y < from.y) || (to.y === from.y && (to.x % 2 === 0));
	if (top)
		return left ? Falarica.Board.Board.Direction.TopLeft : Falarica.Board.Board.Direction.TopRight;
	return left ? Falarica.Board.Board.Direction.BottomLeft : Falarica.Board.Board.Direction.BottomRight;
};

Falarica.Board.Board.prototype.getHexInDirection = function(origin, direction, dontCheckBoard)
{
	var hex = null;
	var x = origin.x;
	var y = origin.y;
	switch (direction)
	{
		case Falarica.Board.Board.Direction.Top:
			hex = new goog.math.Coordinate(origin.x, origin.y - 1);
			break;
		case Falarica.Board.Board.Direction.Bottom:
			hex = new goog.math.Coordinate(origin.x, origin.y + 1);
			break;
		case Falarica.Board.Board.Direction.TopLeft:
		case Falarica.Board.Board.Direction.TopRight:
			if (origin.x % 2 === 0)
				y--;
			if (direction === Falarica.Board.Board.Direction.TopLeft)
				x--;
			else
				x++;
			hex = new goog.math.Coordinate(x, y);
			break;
		case Falarica.Board.Board.Direction.BottomLeft:
		case Falarica.Board.Board.Direction.BottomRight:
			if (origin.x % 2 !== 0)
				y++;
			if (direction === Falarica.Board.Board.Direction.BottomLeft)
				x--;
			else
				x++;
			hex = new goog.math.Coordinate(x, y);
			break;
	}

	if (dontCheckBoard)
		return hex;
	if (this.hexInBoard(hex))
		return hex;
	return null;
};

Falarica.Board.Board.prototype.update = function(timeStamp)
{
};

Falarica.Board.Board.getDirectionVec = function(direction)
{
	var vec = new goog.math.Vec2(0, -1);
	switch(direction)
	{
		case Falarica.Board.Board.Direction.Top:
			break;
		case Falarica.Board.Board.Direction.Bottom:
			vec.y = 1;
			break;
		case Falarica.Board.Board.Direction.TopRight:
			vec.rotate(Math.PI / 6);
			break;
		case Falarica.Board.Board.Direction.BottomRight:
			vec.rotate(Math.PI / 3 * 2);
			break;
		case Falarica.Board.Board.Direction.TopLeft:
			vec.rotate(-Math.PI / 6);
			break;
		case Falarica.Board.Board.Direction.BottomLeft:
			vec.rotate(-Math.PI / 3 * 2);
			break;
	}
	return vec;
};

Falarica.Board.Board.neighborsDi_ = [0, 1, 1, 0, -1, -1];
Falarica.Board.Board.neighborsDj_ = [
	[-1, -1, 0, 1, 0, -1],
	[-1, 0, 1, 1, 1, 0]
];

Falarica.Board.Board.Direction = {
	None: 0,
	Top: 1,
	TopRight: 2,
	BottomRight: 3,
	Bottom: 4,
	BottomLeft: 5,
	TopLeft: 6
};

Falarica.Board.Board.Turn = {
	Left: 0,
	Right: 1
};