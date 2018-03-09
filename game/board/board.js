
var Hexagon = require("./hexagon");

var mathUtils = require("../util/math");
var Range = mathUtils.Range;
var Coordinate = mathUtils.Coordinate;
var Vector = mathUtils.Vector;

var Board = function(diagonalSideHexCount, verticalSideHexCount)
{
	this.board = [];

	this.verticalSideHexCount = verticalSideHexCount;
	this.diagonalSideHexCount = diagonalSideHexCount;

	this.width = diagonalSideHexCount * 2 - 1;
	this.height = verticalSideHexCount * 2 - 1 + verticalSideHexCount;

	this.initBoard();
};

Board.prototype.initBoard = function()
{
	var i = 0;
	for(i = this.diagonalSideHexCount - 1; i >= 0; i--)
	{
		this.board.push(this.buildColumn(i));
		if (i !== this.diagonalSideHexCount - 1)
			this.board.unshift(this.buildColumn(i));
	}
};

Board.prototype.buildColumn = function(column)
{
	var result = [];
	var i = 0, hexCount = this.getColumnHexCount(column);
	var totalHexCount = this.getColumnHexCount(this.diagonalSideHexCount - 1);

	var oddColumn = (column % 2) && (this.diagonalSideHexCount % 2);
	var emptyCount = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalSideHexCount % 2) * (column % 2);

	for(i = 0; i < emptyCount; i++)
		result.push(new Hexagon(Hexagon.Type.Lava));

	for(i = 0; i < hexCount; i++)
	{
		if (Math.random() < 0.1 && false)
			result.push(new Hexagon(Hexagon.Type.Lava));
		else
			result.push(new Hexagon(Hexagon.Type.Stone));
	}
	for(i = 0; i < (oddColumn ? emptyCount + 1 : emptyCount); i++)
		result.push(new Hexagon(Hexagon.Type.Lava));

	return result;
};

/**
 * @param {number} column
 * @return {Range}
 */
Board.prototype.getColumnInfo = function(column)
{
	var totalHexCount = this.getColumnHexCount(this.diagonalSideHexCount - 1);
	var hexCount = this.getColumnHexCount(column);
	var startHex = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalSideHexCount % 2) * (column % 2);
	return new Range(startHex, startHex + hexCount);
};

Board.prototype.getColumnStartHex = function(column)
{
	var totalHexCount = this.getColumnHexCount(this.diagonalSideHexCount - 1);
	var hexCount = this.getColumnHexCount(column);
	return Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalSideHexCount % 2) * (column % 2);
};

Board.prototype.getColumnHexCount = function(column)
{
	if (column >= this.diagonalSideHexCount)
		column = this.diagonalSideHexCount - (column - this.diagonalSideHexCount) - 2;
	return this.verticalSideHexCount + column;
};

Board.prototype.getNeighbors = function(coord)
{
	if (!this.hexInBoard(coord))
		return [];

	var result = [];
	var n = 0;
	var neighbor;
	for(n = 0; n < 6; n++)
	{
		neighbor = new Coordinate(
				coord.x + Board.neighborsDi_[n],
				coord.y + Board.neighborsDj_[coord.x % 2][n]);
		if (this.hexInBoard(neighbor))
			result.push(neighbor);
	}
	return result;
};

Board.prototype.hexInBoard = function(coord)
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
 * @return {Hexagon}
 */
Board.prototype.getHex = function(coord)
{
	if (this.hexInBoard(coord))
		return this.board[coord.x][coord.y];
	return null;
};

/**
 *
 * @param {Coordinate} from
 * @param {Coordinate} to
 * @return {!Array.<Coordinate>}
 */
Board.prototype.findPath = function(from, to)
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
			if (hex.contents !== Hexagon.Contents.Ground)
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

Board.prototype.buildPath_ = function(closedList, current, to)
{
	var path = [to.clone()];
	while(closedList[current].parent !== null)
	{
		path.unshift(closedList[current].origin);
		current = closedList[current].parent;
	}
	return path;
};

Board.prototype.getBestCost = function(openList)
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

Board.prototype.getApproximateCost = function(from, to)
{
	return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
};

Board.prototype.getDirection = function(from, to)
{
	if (from.x === to.x && from.y === to.y)
		return Board.Direction.None;

	var left = to.x < from.x;
	var right = to.x > from.x;
	if (!left && !right)
		return to.y < from.y ? Board.Direction.Top : Board.Direction.Bottom;
	var top = (to.y < from.y) || (to.y === from.y && (to.x % 2 === 0));
	if (top)
		return left ? Board.Direction.TopLeft : Board.Direction.TopRight;
	return left ? Board.Direction.BottomLeft : Board.Direction.BottomRight;
};

Board.prototype.getHexInDirection = function(origin, direction, dontCheckBoard)
{
	var hex = null;
	var x = origin.x;
	var y = origin.y;
	switch (direction)
	{
		case Board.Direction.Top:
			hex = new Coordinate(origin.x, origin.y - 1);
			break;
		case Board.Direction.Bottom:
			hex = new Coordinate(origin.x, origin.y + 1);
			break;
		case Board.Direction.TopLeft:
		case Board.Direction.TopRight:
			if (origin.x % 2 === 0)
				y--;
			if (direction === Board.Direction.TopLeft)
				x--;
			else
				x++;
			hex = new Coordinate(x, y);
			break;
		case Board.Direction.BottomLeft:
		case Board.Direction.BottomRight:
			if (origin.x % 2 !== 0)
				y++;
			if (direction === Board.Direction.BottomLeft)
				x--;
			else
				x++;
			hex = new Coordinate(x, y);
			break;
	}

	if (dontCheckBoard)
		return hex;
	if (this.hexInBoard(hex))
		return hex;
	return null;
};

Board.prototype.update = function(timeStamp)
{
};

Board.getDirectionVec = function(direction)
{
	var vec = new Vector(0, -1);
	switch(direction)
	{
		case Board.Direction.Top:
			break;
		case Board.Direction.Bottom:
			vec.y = 1;
			break;
		case Board.Direction.TopRight:
			vec.rotate(Math.PI / 6);
			break;
		case Board.Direction.BottomRight:
			vec.rotate(Math.PI / 3 * 2);
			break;
		case Board.Direction.TopLeft:
			vec.rotate(-Math.PI / 6);
			break;
		case Board.Direction.BottomLeft:
			vec.rotate(-Math.PI / 3 * 2);
			break;
	}
	return vec;
};

Board.neighborsDi_ = [0, 1, 1, 0, -1, -1];
Board.neighborsDj_ = [
	[-1, -1, 0, 1, 0, -1],
	[-1, 0, 1, 1, 1, 0]
];

Board.Direction = {
	None: 0,
	Top: 1,
	TopRight: 2,
	BottomRight: 3,
	Bottom: 4,
	BottomLeft: 5,
	TopLeft: 6
};

Board.Turn = {
	Left: 0,
	Right: 1
};

module.exports = Board;