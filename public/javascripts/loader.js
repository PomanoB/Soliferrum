(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var spriteManager = require("./render/spritemanager");

var MenuScreen = require("./render/ui/sreen/menuscreen");
//var OptionsScreen = require("./render/ui/sreen/optionsscreen");
var GameScreen = require("./render/ui/sreen/gamescreen");

var Application = function()
{
	this.renderer = null;
	/** @type {SpriteManager} */
	this.spriteManager = spriteManager;

	this.viewWidth = 0;
	this.viewHeight = 0;

	this.drawDelegate = this.draw.bind(this);
};

Application.prototype.resourcesLoaded_ = function()
{
	this.showMainMenu();
	this.draw(0);
//	this.showGameScreen();
	this.draw(0);
};

Application.prototype.loadResources_ = function()
{
	this.spriteManager.on("imagesLoaded", this.resourcesLoaded_.bind(this));

	var spritesDescr = require("./render/spritesdescr");
	spritesDescr.loadSprites(this.spriteManager);
	var playerTiles = require("./render/playertiles");
	playerTiles.loadSprites(this.spriteManager);

	//TODO this.showLoadingScreen();
};

Application.prototype.setRenderOutput = function(domElement)
{
	if (domElement.tagName !== "CANVAS")
		throw new Error("Unsupported render element!");

	this.viewWidth = domElement.offsetWidth;
	this.viewHeight = domElement.offsetHeight;
	var CanvasRenderer = require("./render/canvas");
	this.renderer = new CanvasRenderer(domElement);
};

Application.prototype.showMainMenu = function()
{
	this.renderer.setScreen(new MenuScreen(this.viewWidth, this.viewHeight));
};

Application.prototype.showOptions = function()
{
	this.renderer.setScreen(new OptionsScreen(this.viewWidth, this.viewHeight));
};

Application.prototype.showGameScreen = function()
{
	this.renderer.setScreen(new GameScreen(this.viewWidth, this.viewHeight));
};

Application.prototype.draw = function(timeStamp)
{
	this.renderer.draw(timeStamp);
	requestAnimationFrame(this.drawDelegate);
};

Application.prototype.start = function(timeStamp)
{
	this.loadResources_();
};

module.exports = new Application();
},{"./render/canvas":11,"./render/playertiles":22,"./render/spritemanager":23,"./render/spritesdescr":24,"./render/ui/sreen/gamescreen":30,"./render/ui/sreen/menuscreen":31}],2:[function(require,module,exports){

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
},{"../util/math":33,"./hexagon":3}],3:[function(require,module,exports){


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

},{}],4:[function(require,module,exports){

var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;

var Entity = function()
{
	this.health = 1;
	this.origin = new Coordinate();
	this.solid = Entity.Solid.Solid;

	this.nextThink = 0;
	this.visible = true;
	this.model = null;
};

Entity.prototype.classify = function()
{
	return Entity.Class.Interior;
};

/**
 * @param {Game} game
 * @param {number} timeStamp
 */
Entity.prototype.think = function(game, timeStamp)
{
};

Entity.prototype.setOrigin = function(coord)
{
	this.origin.x = coord.x;
	this.origin.y = coord.y;
};

Entity.prototype.takeDamage = function(attacker, damage)
{
	this.health = Math.max(0, this.health - damage);
	if (this.health === 0)
		return this.killed(attacker);
	return false;
};

Entity.prototype.killed = function(damager)
{
	return true;
};

Entity.prototype.isDead = function()
{
	return this.health <= 0;
};

Entity.Class = {
	Interior: 0,
	Item: 1,
	Monster: 2,
	Player: 3
};

Entity.Solid = {
	Solid: 0,
	Noclip: 1
};

module.exports = Entity;
},{"../util/math":33}],5:[function(require,module,exports){

var inherits = require("inherits");

var Monster = require("./monster");
var Entity = require("./entity");

var Guard = function()
{
	Monster.call(this);
};
inherits(Guard, Monster);

Guard.prototype.classify = function()
{
	return Entity.Class.Monster;
};

Guard.prototype.think = function(game, timeStamp)
{
	Guard.super_.prototype.think.call(this, game, timeStamp);

	var pathToPlayer = game.board.findPath(this.origin, game.player.origin);
	if (pathToPlayer !== null && pathToPlayer.length)
		this.setTargetOrigin(pathToPlayer[0]);
};

module.exports = Guard;

},{"./entity":4,"./monster":6,"inherits":35}],6:[function(require,module,exports){

var inherits = require("inherits");

var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;
var Entity = require("./entity");

var Monster = function()
{
	Entity.call(this);

	this.targetOrigin = new Coordinate(0, 0);
	this.speed = 300.0;
	this.lastMoving = 0;
};
inherits(Monster, Entity);

Monster.prototype.classify = function()
{
	return Entity.Class.Monster;
};

Monster.prototype.setTargetOrigin = function(x, y)
{
	if (y === undefined)
	{
		y = x.y;
		x = x.x;
	}
	this.targetOrigin.x = x;
	this.targetOrigin.y = y;
};

Monster.prototype.moveThink = function(timeStamp, game)
{
	if (this.lastMoving + this.speed <= timeStamp && !this.isMovingDone())
	{
		var path = game.board.findPath(this.origin, this.targetOrigin);
		if (path !== null && path.length)
		{
			this.origin.x = path[0].x;
			this.origin.y = path[0].y;
		}
		this.lastMoving = timeStamp;
	}
};

Monster.prototype.isMovingDone = function()
{
	return this.origin.x === this.targetOrigin.x &&
		this.origin.y === this.targetOrigin.y;
};

Monster.prototype.setOrigin = function(coord)
{
	Monster.super_.prototype.setOrigin.call(this, coord);
	this.targetOrigin.x = coord.x;
	this.targetOrigin.y = coord.y;
};

module.exports = Monster;

},{"../util/math":33,"./entity":4,"inherits":35}],7:[function(require,module,exports){

var inherits = require("inherits");

var Monster = require("./monster");
var Entity = require("./entity");

var Player = function()
{
	Monster.call(this);

	this.health = 3;
};
inherits(Player, Monster);

Player.prototype.classify = function()
{
	return Entity.Class.Player;
};

module.exports = Player;

},{"./entity":4,"./monster":6,"inherits":35}],8:[function(require,module,exports){

var app = require("./application");
app.setRenderOutput(document.getElementById("game"));
app.start();

},{"./application":1}],9:[function(require,module,exports){

var Board = require("../board/board");
var GameRules = require("./gamerules");
var Player = require("../entity/player");
var Entity = require("../entity/entity");

var Game = function()
{
	/** @type {Board} */
	this.board = new Board(GameRules.kDiagonalHexCount, GameRules.kVerticalHexCount);
	/** @type {Player} */
	this.player = new Player();

	this.entities = [
		this.player
	];

	this.player.nextThink = 1;

	/** @type {GameRules} */
	this.rules = new GameRules(this);

	this.rules.loadLevel(0);

	this.gameTime = 0;
};

Game.prototype.update = function(timeStamp)
{
	this.gameTime = timeStamp;
	this.entities.forEach(function(ent){
		ent.moveThink(timeStamp, this);
		if (ent.nextThink > 0 && ent.nextThink <= timeStamp)
		{
			ent.nextThink = 0;
			ent.think(this, timeStamp);
		}
	}, this);
};

Game.prototype.setThinkToMonsters = function(timeStamp)
{
	this.entities.forEach(function(ent){
		if (ent.classify() === Entity.Class.Monster)
			ent.nextThink = timeStamp + 200.0;
	}, this);
};

Game.prototype.createEntity = function(entClass)
{
	var ent = new entClass();
	this.entities.push(ent);
	return ent;
};

Game.prototype.getEntitiesInHex = function(coord, opt_classFiler)
{
	var result = [];
	if (coord === null)
		return result;
	this.entities.forEach(function(ent){
		if (ent.origin.x !== coord.x || ent.origin.y !== coord.y)
			return;
		if (opt_classFiler !== undefined && ent.classify() !== opt_classFiler)
			return;
		result.push(ent);
	}, this);
	return result;
};

Game.prototype.onBeforeActivateHex = function(hex)
{

};

Game.prototype.onActivateHex = function(hex)
{
	if (!this.board.hexInBoard(hex))
		return;
	if (this.rules.playerCanMoveToCoord(hex))
	{
		this.player.moveToPosition(hex);
	}
};

module.exports = Game;

},{"../board/board":2,"../entity/entity":4,"../entity/player":7,"./gamerules":10}],10:[function(require,module,exports){

var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;

var Guard = require("../entity/gurad");
var Entity = require("../entity/entity");
var Hexagon = require("../board/hexagon");

var GameRules = function(game)
{
	/** @type {Game} */
	this.game = game;

	this.randomSeed = Math.random() * 123456 | 0;
	this.rnd = new mathUtils.RandomGenerator(this.randomSeed);

	this.lastPlayerAction = 0;
};

GameRules.prototype.loadLevel = function(levelNumber)
{
	this.placePlayer();
	this.placeLavaLake();
	this.placeMonsters();
};

GameRules.prototype.placeMonsters = function()
{
	var guard = this.game.createEntity(Guard);
	guard.setOrigin(new Coordinate(3, 3));
};

GameRules.prototype.placePlayer = function()
{
	this.game.player.setOrigin(GameRules.kPlayerStartOrigin);
};

GameRules.prototype.placeLavaLake = function()
{
	var startHex = new Coordinate(0, 0);
	startHex.x = this.rnd.next(0, this.game.board.width);
	var columnInfo = this.game.board.getColumnInfo(startHex.x);
	startHex.y = this.rnd.next(columnInfo.start, columnInfo.end);

	this.game.board.board[startHex.x][startHex.y] = new Hexagon(Hexagon.Type.Lava);

	var neiggtbors = [
		{
			hex: startHex,
			chance: 0.5
		}
	];

	while(neiggtbors.length)
	{
		var curHex = neiggtbors.shift();
		var currChance = curHex.chance - 0.2;

		if (currChance <= 0)
			break;

		neiggtbors.push.apply(
			neiggtbors,
			this.game.board.getNeighbors(curHex.hex).map(function(hex){
					if (this.rnd.nextFloat() <= currChance)
						this.game.board.board[hex.x][hex.y] = new Hexagon(Hexagon.Type.Lava);
					return {
						hex: hex.clone(),
						chance: currChance
					};
				},
				this)
			)
	}
};

GameRules.prototype.playerCanMoveToCoord = function(hexCoord)
{
	if (!hexCoord)
		return false;
	var hex = this.game.board.getHex(hexCoord);
	return hex && hex.contents === Hexagon.Contents.Ground;
};

GameRules.prototype.requestMove = function(oldOrigin, newOrigin)
{
	if (this.lastPlayerAction + GameRules.kPlayerActionDelay > this.game.gameTime)
		return false;
	this.lastPlayerAction = this.game.gameTime;

	this.performPlayerMoveAndHit(oldOrigin, newOrigin);
	return true;
};

GameRules.prototype.performPlayerMoveAndHit = function(oldOrigin, newOrigin)
{
	var moveDirection = this.game.board.getDirection(oldOrigin, newOrigin);
	var nextHex = this.game.board.getHexInDirection(newOrigin, moveDirection);
	var entToHit = this.game.getEntitiesInHex(nextHex, Entity.Class.Monster);
	for(var i = 0; i < entToHit.length; i++)
		entToHit[i].takeDamage(this.game.player, GameRules.kPlayerDamage);
};

GameRules.kPlayerActionDelay = 400;
GameRules.kPlayerDamage = 1;

GameRules.kDiagonalHexCount = 5;
GameRules.kVerticalHexCount = 7;

GameRules.kPlayerStartOrigin = new Coordinate(
	GameRules.kDiagonalHexCount - 1,
	GameRules.kVerticalHexCount + GameRules.kDiagonalHexCount - 3
);

module.exports = GameRules;

},{"../board/hexagon":3,"../entity/entity":4,"../entity/gurad":5,"../util/math":33}],11:[function(require,module,exports){

var mathUtils = require("../util/math");
var Coordinate = mathUtils.Coordinate;

var CanvasRenderer = function(canvasElement)
{
	this.canvas = canvasElement;
	this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
	this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
	this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));

	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.offsetWidth;
	this.height = this.canvas.offsetHeight;

	this.framesCount = 0;
	this.lastFPS = 0;

	/** @type {SpriteManager} */
	this.spriteManager = require("./spritemanager");
	/** @type {UIScreen} */
	this.screen = null;
};

CanvasRenderer.prototype.setScreen = function(screen)
{
	if (this.screen !== null)
		this.screen.hide();
	this.screen = screen;
	this.screen.show();
};

CanvasRenderer.prototype.draw = function(timeStamp)
{
	if (timeStamp >= this.lastFPS + 1000)
	{
//		console.log("FPS: %d", this.framesCount);
		this.framesCount = 0;
		this.lastFPS = timeStamp;
	}
	this.framesCount++;

	this.ctx.clearRect(0, 0, this.width, this.height);

	if (this.screen !== null)
	{
		this.screen.update(timeStamp);
		this.screen.draw(this.ctx, timeStamp);
	}
};

/**
 * @param {Event} event
 */
CanvasRenderer.prototype.handleMouseMove = function(event)
{
	if (this.screen === null)
		return;
//	this.hexOnMouse = this.getHexByCoordinate(event.offsetX, event.offsetY);
	this.screen.onMouseMove(new Coordinate(event.offsetX, event.offsetY));
};

/**
 * @param {Event} event
 */
CanvasRenderer.prototype.handleMouseDown = function(event)
{
	if (event.button !== 0 || this.screen === null)
		return;
	this.screen.onMouseDown(new Coordinate(event.offsetX, event.offsetY));
};

/**
 * @param {goog.events.BrowserEvent} event
 */
CanvasRenderer.prototype.handleMouseUp = function(event)
{
	if (event.button !== 0 || this.screen === null)
		return;
	this.screen.onMouseUp(new Coordinate(event.offsetX, event.offsetY));
};

module.exports = CanvasRenderer;

},{"../util/math":33,"./spritemanager":23}],12:[function(require,module,exports){

var inherits = require("inherits");
var events = require("events");

var AnimatedSprite = function(descr)
{
	events.EventEmitter.call(this);

	this.img = descr.img;

	this.x = descr.x;
	this.y = descr.y;
	this.width = descr.width;
	this.height = descr.height;
	this.anim = descr.anim;

	this.currentFrame = {
		number: 0,
		x: this.x,
		y: this.y
	};
	this.lastFrameTime = 0;
};
inherits(AnimatedSprite, events.EventEmitter);

AnimatedSprite.prototype.draw = function(ctx, timeStamp, x, y)
{
	if (this.lastFrameTime !== 0)
	{
		if (this.lastFrameTime + this.anim.frameTime <= timeStamp)
		{
			this.nextFrame_();
			this.lastFrameTime = timeStamp;
		}
	}
	else
		this.lastFrameTime = timeStamp;

	ctx.drawImage(this.img, this.currentFrame.x, this.currentFrame.y, this.width, this.height, x | 0, y | 0, this.width, this.height);
};

AnimatedSprite.prototype.nextFrame_ = function()
{
	if (this.currentFrame.number + 1 >= this.anim.frameCount)
	{
		if (this.anim.cycle)
			this.currentFrame.number = 0;

		this.emit("animationEnd");
	}
	else
		this.currentFrame.number++;
	this.currentFrame.x = this.x + this.currentFrame.number * this.width;
};

module.exports = AnimatedSprite;
},{"events":34,"inherits":35}],13:[function(require,module,exports){

var BaseDrawable = function()
{
	this.filters = [];
};

BaseDrawable.prototype.addFilter = function(filter, unshift)
{
	if (unshift)
		this.filters.unshift(filter);
	else
		this.filters.push(filter);
};

BaseDrawable.prototype.draw = function(ctx, timeStamp, rect)
{
	this.applyFilters_(ctx, timeStamp, rect);
	this.drawInt_(ctx, timeStamp, rect);
};

/** @protected */
BaseDrawable.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
};

/** @protected */
BaseDrawable.prototype.applyFilters_ = function(ctx, timeStamp, rect)
{
	var i = 0;
	var filter;
	for(; i < this.filters.length; i++)
	{
		filter = this.filters[i];
		if (filter.updateAndCheckEnd(timeStamp))
		{
			this.filters.splice(i, 1);
			i--;
			continue;
		}
		filter.applyFilter(timeStamp, rect);
	}
};

module.exports = BaseDrawable;
},{}],14:[function(require,module,exports){

var inherits = require("inherits");
var events = require("events");

var Filter = function()
{
	events.EventEmitter.call(this);

	this.once = false;
	this.duration = 0;
	this.startTime = 0;
};
inherits(Filter, events.EventEmitter);

Filter.prototype.applyFilter = function(timeStamp, rect)
{
	if (this.duration <= 0)
	{
		this.applyFilterInt_(timeStamp, 0, rect);
		return;
	}
	if (this.startTime === 0)
		this.startTime = timeStamp;

	var step = (timeStamp - this.startTime) / this.duration;
	step = Math.max(0, Math.min(step, 1));
	this.applyFilterInt_(timeStamp, step, rect);
};

/** @protected */
Filter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
};

Filter.prototype.reset = function()
{
	this.startTime = 0;
};

Filter.prototype.updateAndCheckEnd = function(timeStamp)
{
	if (this.startTime === 0)
	{
		this.startTime = timeStamp;
		return false;
	}
	if (this.startTime + this.duration > timeStamp)
		return false;

	this.emit("filterEnd");

	if (this.once)
		return true;
	this.startTime = timeStamp;
	return false;
};

Filter.cube = function(progress)
{
	return Math.pow(progress, 3)
};
Filter.easeOut = function(deltaFunc)
{
	return function(progress) {
		return 1 - deltaFunc(1 - progress);
	}
};
Filter.easeInOut = function(deltaFunc)
{
	return function(progress) {
		if (progress <= 0.5)
			return deltaFunc(2 * progress) / 2;

		return (2 - deltaFunc(2 * (1 - progress))) / 2;
	}
};

module.exports = Filter;

},{"events":34,"inherits":35}],15:[function(require,module,exports){

var inherits = require("inherits");
var Filter = require("./filter");

/**
 * @constructor
 */
var FilterQueue = function()
{
	Filter.call(this);

	this.once = true;

	/**
	 * @type {Array.<Filter>}
	 * @private
	 */
	 this.filters_ = [];
};
inherits(FilterQueue, Filter);

FilterQueue.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	var i = 0;
	var queuedDuration = 0;
	var filter;
	for(; i < this.filters_.length; i++)
	{
		filter = this.filters_[i];
		queuedDuration += filter.duration;
		if (timeStamp > this.startTime + queuedDuration)
			continue;
		filter.applyFilter(timeStamp, rect);
		break;
	}
};

FilterQueue.prototype.addFilter = function(filter)
{
	if (!filter.once)
		return;
	this.filters_.push(filter);
	this.duration += filter.duration;
};

module.exports = FilterQueue;

},{"./filter":14,"inherits":35}],16:[function(require,module,exports){

var inherits = require("inherits");
var Filter = require("./filter");
var mathUtils = require("../../util/math");
var Vector = mathUtils.Vector;

/**
 * @param {Coordinate} from
 * @param {Coordinate} to
 * @param {number} duration
 * @constructor
 */
var JumpFilter = function(from, to, duration)
{
	Filter.call(this);

	this.once = true;
	this.duration = duration;

	this.stepFunc = Filter.easeInOut(Filter.cube);

	this.directionVector_ = new Vector(to.x - from.x, to.y - from.y);
	this.distance = this.directionVector_.magnitude();
	this.directionVector_.normalize();
	this.startPoint_ = from;
};
inherits(JumpFilter, Filter);

JumpFilter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	var needDist = this.distance * this.stepFunc(step);
	rect.left = this.startPoint_.x + this.directionVector_.x * needDist;
	rect.top = this.startPoint_.y + this.directionVector_.y * needDist;
};

module.exports = JumpFilter;

},{"../../util/math":33,"./filter":14,"inherits":35}],17:[function(require,module,exports){

var mathUtils = require("../../util/math");
var Rectangle = mathUtils.Rectangle;

var NinePatch = function(sprite, width, height)
{
	/** @type {SpriteManager} */
	var manager = require("../spritemanager");

	this.left = manager.getPattern(sprite + "L");
	this.right = manager.getPattern(sprite + "R");
	this.top = manager.getPattern(sprite + "T");
	this.bottom = manager.getPattern(sprite + "B");

	this.topLeft = manager.getSprite(sprite + "TL");
	this.topRight = manager.getSprite(sprite + "TR");
	this.bottomLeft = manager.getSprite(sprite + "BL");
	this.bottomRight = manager.getSprite(sprite + "BR");

	this.bg = manager.getPattern(sprite + "Bg");

	this.width = width;
	this.height = height;

	this.bgRect_ = null;
	this.leftRect_ = null;
	this.rightRect_ = null;
	this.topRect_ = null;
	this.bottomRect_ = null;
	this.topLeftRect_ = null;
	this.topRightRect_ = null;
	this.bottomLeftRect_ = null;
	this.bottomRightRect_ = null;

	this.calcRects_();
};

NinePatch.prototype.calcRects_ = function()
{
	var middleWidth = this.width - this.left.width - this.right.width;
	var middleHeight = this.height - this.top.height - this.bottom.height;

	this.bgRect_ = new Rectangle(this.left.width, this.top.height, middleWidth, middleHeight);
	this.leftRect_ = new Rectangle(0, this.top.height, this.left.width, middleHeight);
	this.rightRect_ = new Rectangle(this.width - this.right.width, this.top.height, this.right.width, middleHeight);
	this.topRect_ = new Rectangle(this.left.width, 0, middleWidth, this.top.height);
	this.bottomRect_ = new Rectangle(this.left.width, this.height - this.top.height, middleWidth, this.bottom.height);
	this.topLeftRect_ = new Rectangle(0, 0, 0, 0);
	this.topRightRect_ = new Rectangle(this.width - this.topRight.width, 0, 0, 0);
	this.bottomLeftRect_ = new Rectangle(0, this.height - this.bottomLeft.height, 0, 0);
	this.bottomRightRect_ = new Rectangle(this.width - this.bottomRight.width, this.height - this.bottomRight.height, 0, 0);
};

NinePatch.prototype.draw = function(ctx, timeSpan)
{
	var middleWidth = this.width - this.left.width - this.right.width;
	var middleHeight = this.height - this.top.height - this.bottom.height;

	if (this.bg !== null)
		this.bg.draw(ctx, timeSpan, this.bgRect_);

	this.left.draw(ctx, timeSpan, this.leftRect_);
	this.right.draw(ctx, timeSpan, this.rightRect_);
	this.top.draw(ctx, timeSpan, this.topRect_);
	this.bottom.draw(ctx, timeSpan, this.bottomRect_);

	this.topLeft.draw(ctx, timeSpan, this.topLeftRect_);
	this.topRight.draw(ctx, timeSpan, this.topRightRect_);
	this.bottomLeft.draw(ctx, timeSpan, this.bottomLeftRect_);
	this.bottomRight.draw(ctx, timeSpan, this.bottomRightRect_);
};

module.exports = NinePatch;
},{"../../util/math":33,"../spritemanager":23}],18:[function(require,module,exports){

var inherits = require("inherits");

var Filter = require("./filter");

/**
 * @param {Coordinate} offset
 * @constructor
 */
var OffsetFilter = function(offset)
{
	Filter.call(this);

	this.offset = offset;
};
inherits(OffsetFilter, Filter);

OffsetFilter.prototype.applyFilterInt_ = function(timeStamp, step, rect)
{
	rect.left += this.offset.x;
	rect.top += this.offset.y;
};

module.exports = OffsetFilter;

},{"./filter":14,"inherits":35}],19:[function(require,module,exports){

var inherits = require("inherits");

var BaseDrawable = require("./basedrawable");

var PlayerModel = function()
{
	BaseDrawable.call(this);

	var manager = require("../spritemanager");

	this.baseSprite = manager.getSprite(PlayerModel.DefaultSprites.Base);
	this.bodySprite = manager.getSprite(PlayerModel.DefaultSprites.Body);
	this.legsSprite = manager.getSprite(PlayerModel.DefaultSprites.Legs);
	this.hairSprite = manager.getSprite(PlayerModel.DefaultSprites.Hair);
};
inherits(PlayerModel, BaseDrawable);

PlayerModel.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
	this.baseSprite.draw(ctx, timeStamp, rect);
	this.hairSprite.draw(ctx, timeStamp, rect);
	this.legsSprite.draw(ctx, timeStamp, rect);
	this.bodySprite.draw(ctx, timeStamp, rect);
};

PlayerModel.DefaultSprites = {
	Base: "humanM",
	Body: "leatherArmour",
	Legs: "legArmor01",
	Hair: "aragorn"
};

module.exports = PlayerModel;

},{"../spritemanager":23,"./basedrawable":13,"inherits":35}],20:[function(require,module,exports){

var inherits = require("inherits");

var BaseDrawable = require("./basedrawable");

var Sprite = function(descr)
{
	BaseDrawable.call(this);

	this.img = descr.img;

	this.x = descr.x;
	this.y = descr.y;
	this.width = descr.width;
	this.height = descr.height;
};
inherits(Sprite, BaseDrawable);

Sprite.prototype.drawInt_ = function(ctx, timeStamp, rect)
{
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height, rect.left | 0, rect.top | 0, this.width, this.height);
};

module.exports = Sprite;
},{"./basedrawable":13,"inherits":35}],21:[function(require,module,exports){

var StaticPattern = function(name)
{
	/** @type {SpriteManager} */
	var manager = require("../spritemanager");

	var sprite = manager.getSprite(name);

	var patternCanvas = document.createElement("CANVAS");
	patternCanvas.width = sprite.width;
	patternCanvas.height = sprite.height;
	var pctx = patternCanvas.getContext('2d');
	sprite.draw(pctx, 0, 0, 0);

	this.pattern = pctx.createPattern(patternCanvas, "repeat");

	this.sprite = sprite;
	this.width = sprite.width;
	this.height = sprite.height;
};

StaticPattern.prototype.draw = function(ctx, timeStamp, rect)
{
	ctx.save();
	ctx.fillStyle = this.pattern;
	ctx.fillRect(rect.left, rect.top, rect.width || this.width, rect.height || this.height);
	ctx.restore();
};

module.exports = StaticPattern;
},{"../spritemanager":23}],22:[function(require,module,exports){

/*
a.map(function(name, index){
	return name.replace(/_(\w)/g, function(catched, character) {
		return character.toUpperCase();
	}) + ": { x: " + (index * 32) + ", y: 0, width: 32, height: 32 }";
}).join(",\n");
*/


var kBase = {
	image: "/images/player/base.png",
	sprites: {
		centaurBrownF: { x: 0, y: 0, width: 32, height: 32 },
		centaurBrownM: { x: 32, y: 0, width: 32, height: 32 },
		centaurDarkbrownF: { x: 64, y: 0, width: 32, height: 32 },
		centaurDarkbrownM: { x: 96, y: 0, width: 32, height: 32 },
		centaurDarkgreyF: { x: 128, y: 0, width: 32, height: 32 },
		centaurDarkgreyM: { x: 160, y: 0, width: 32, height: 32 },
		centaurLightbrownF: { x: 192, y: 0, width: 32, height: 32 },
		centaurLightbrownM: { x: 224, y: 0, width: 32, height: 32 },
		centaurLightgreyF: { x: 256, y: 0, width: 32, height: 32 },
		centaurLightgreyM: { x: 288, y: 0, width: 32, height: 32 },
		deepDwarfF: { x: 320, y: 0, width: 32, height: 32 },
		deepDwarfM: { x: 352, y: 0, width: 32, height: 32 },
		deepElfF: { x: 384, y: 0, width: 32, height: 32 },
		deepElfM: { x: 416, y: 0, width: 32, height: 32 },
		demigodF: { x: 448, y: 0, width: 32, height: 32 },
		demigodM: { x: 480, y: 0, width: 32, height: 32 },
		demonspawnBlackF: { x: 512, y: 0, width: 32, height: 32 },
		demonspawnBlackM: { x: 544, y: 0, width: 32, height: 32 },
		demonspawnPink: { x: 576, y: 0, width: 32, height: 32 },
		demonspawnRedF: { x: 608, y: 0, width: 32, height: 32 },
		demonspawnRedM: { x: 640, y: 0, width: 32, height: 32 },
		draconianBlackF: { x: 672, y: 0, width: 32, height: 32 },
		draconianBlackM: { x: 704, y: 0, width: 32, height: 32 },
		draconianF: { x: 736, y: 0, width: 32, height: 32 },
		draconianGoldF: { x: 768, y: 0, width: 32, height: 32 },
		draconianGoldM: { x: 800, y: 0, width: 32, height: 32 },
		draconianGrayF: { x: 832, y: 0, width: 32, height: 32 },
		draconianGrayM: { x: 864, y: 0, width: 32, height: 32 },
		draconianGreenF: { x: 896, y: 0, width: 32, height: 32 },
		draconianGreenM: { x: 928, y: 0, width: 32, height: 32 },
		draconianM: { x: 960, y: 0, width: 32, height: 32 },
		draconianMottledF: { x: 992, y: 0, width: 32, height: 32 },
		draconianMottledM: { x: 1024, y: 0, width: 32, height: 32 },
		draconianPaleF: { x: 1056, y: 0, width: 32, height: 32 },
		draconianPaleM: { x: 1088, y: 0, width: 32, height: 32 },
		draconianPurpleF: { x: 1120, y: 0, width: 32, height: 32 },
		draconianPurpleM: { x: 1152, y: 0, width: 32, height: 32 },
		draconianRedF: { x: 1184, y: 0, width: 32, height: 32 },
		draconianRedM: { x: 1216, y: 0, width: 32, height: 32 },
		draconianWhiteF: { x: 1248, y: 0, width: 32, height: 32 },
		draconianWhiteM: { x: 1280, y: 0, width: 32, height: 32 },
		dwarfF: { x: 1312, y: 0, width: 32, height: 32 },
		dwarfM: { x: 1344, y: 0, width: 32, height: 32 },
		elfF: { x: 1376, y: 0, width: 32, height: 32 },
		elfM: { x: 1408, y: 0, width: 32, height: 32 },
		ghoul: { x: 1440, y: 0, width: 32, height: 32 },
		gnomeF: { x: 1472, y: 0, width: 32, height: 32 },
		gnomeM: { x: 1504, y: 0, width: 32, height: 32 },
		halflingF: { x: 1536, y: 0, width: 32, height: 32 },
		halflingM: { x: 1568, y: 0, width: 32, height: 32 },
		humanF: { x: 1600, y: 0, width: 32, height: 32 },
		humanM: { x: 1632, y: 0, width: 32, height: 32 },
		kenkuWingedF: { x: 1664, y: 0, width: 32, height: 32 },
		kenkuWingedM: { x: 1696, y: 0, width: 32, height: 32 },
		kenkuWinglessF: { x: 1728, y: 0, width: 32, height: 32 },
		kenkuWinglessM: { x: 1760, y: 0, width: 32, height: 32 },
		koboldF: { x: 1792, y: 0, width: 32, height: 32 },
		koboldM: { x: 1824, y: 0, width: 32, height: 32 },
		merfolkF: { x: 1856, y: 0, width: 32, height: 32 },
		merfolkM: { x: 1888, y: 0, width: 32, height: 32 },
		merfolkWaterF: { x: 1920, y: 0, width: 32, height: 32 },
		merfolkWaterM: { x: 1952, y: 0, width: 32, height: 32 },
		minotaurBrown1M: { x: 1984, y: 0, width: 32, height: 32 },
		minotaurBrown2M: { x: 2016, y: 0, width: 32, height: 32 },
		minotaurF: { x: 2048, y: 0, width: 32, height: 32 },
		minotaurM: { x: 2080, y: 0, width: 32, height: 32 },
		mummyF: { x: 2112, y: 0, width: 32, height: 32 },
		mummyM: { x: 2144, y: 0, width: 32, height: 32 },
		nagaDarkgreenF: { x: 2176, y: 0, width: 32, height: 32 },
		nagaDarkgreenM: { x: 2208, y: 0, width: 32, height: 32 },
		nagaF: { x: 2240, y: 0, width: 32, height: 32 },
		nagaLightgreenF: { x: 2272, y: 0, width: 32, height: 32 },
		nagaLightgreenM: { x: 2304, y: 0, width: 32, height: 32 },
		nagaM: { x: 2336, y: 0, width: 32, height: 32 },
		ogreF: { x: 2368, y: 0, width: 32, height: 32 },
		ogreM: { x: 2400, y: 0, width: 32, height: 32 },
		orcF: { x: 2432, y: 0, width: 32, height: 32 },
		orcM: { x: 2464, y: 0, width: 32, height: 32 },
		shadow: { x: 2496, y: 0, width: 32, height: 32 },
		sprigganF: { x: 2528, y: 0, width: 32, height: 32 },
		sprigganM: { x: 2560, y: 0, width: 32, height: 32 },
		trollF: { x: 2592, y: 0, width: 32, height: 32 },
		trollM: { x: 2624, y: 0, width: 32, height: 32 },
		vampireF: { x: 2656, y: 0, width: 32, height: 32 },
		vampireM: { x: 2688, y: 0, width: 32, height: 32 }
	}
};

var kBody = {
	image: "/images/player/body.png",
	sprites: {
		animalSkin: { x: 0, y: 0, width: 32, height: 32 },
		aragorn: { x: 32, y: 0, width: 32, height: 32 },
		aragorn2: { x: 64, y: 0, width: 32, height: 32 },
		armorBlueGold: { x: 96, y: 0, width: 32, height: 32 },
		armorMummy: { x: 128, y: 0, width: 32, height: 32 },
		arwen: { x: 160, y: 0, width: 32, height: 32 },
		banded: { x: 192, y: 0, width: 32, height: 32 },
		banded2: { x: 224, y: 0, width: 32, height: 32 },
		belt1: { x: 256, y: 0, width: 32, height: 32 },
		belt2: { x: 288, y: 0, width: 32, height: 32 },
		bikiniRed: { x: 320, y: 0, width: 32, height: 32 },
		bloody: { x: 352, y: 0, width: 32, height: 32 },
		boromir: { x: 384, y: 0, width: 32, height: 32 },
		bplateGreen: { x: 416, y: 0, width: 32, height: 32 },
		bplateMetal1: { x: 448, y: 0, width: 32, height: 32 },
		breastBlack: { x: 480, y: 0, width: 32, height: 32 },
		chainmail: { x: 512, y: 0, width: 32, height: 32 },
		chainmail3: { x: 544, y: 0, width: 32, height: 32 },
		chinaRed: { x: 576, y: 0, width: 32, height: 32 },
		chinaRed2: { x: 608, y: 0, width: 32, height: 32 },
		chunli: { x: 640, y: 0, width: 32, height: 32 },
		coatBlack: { x: 672, y: 0, width: 32, height: 32 },
		coatRed: { x: 704, y: 0, width: 32, height: 32 },
		crystalPlate: { x: 736, y: 0, width: 32, height: 32 },
		dragonarmBlue: { x: 768, y: 0, width: 32, height: 32 },
		dragonarmBrown: { x: 800, y: 0, width: 32, height: 32 },
		dragonarmCyan: { x: 832, y: 0, width: 32, height: 32 },
		dragonarmGold: { x: 864, y: 0, width: 32, height: 32 },
		dragonarmGreen: { x: 896, y: 0, width: 32, height: 32 },
		dragonarmMagenta: { x: 928, y: 0, width: 32, height: 32 },
		dragonarmWhite: { x: 960, y: 0, width: 32, height: 32 },
		dragonscBlue: { x: 992, y: 0, width: 32, height: 32 },
		dragonscBrown: { x: 1024, y: 0, width: 32, height: 32 },
		dragonscCyan: { x: 1056, y: 0, width: 32, height: 32 },
		dragonscGold: { x: 1088, y: 0, width: 32, height: 32 },
		dragonscGreen: { x: 1120, y: 0, width: 32, height: 32 },
		dragonscMagenta: { x: 1152, y: 0, width: 32, height: 32 },
		dragonscWhite: { x: 1184, y: 0, width: 32, height: 32 },
		dressGreen: { x: 1216, y: 0, width: 32, height: 32 },
		dressWhite: { x: 1248, y: 0, width: 32, height: 32 },
		faerieDragonArmour: { x: 1280, y: 0, width: 32, height: 32 },
		frodo: { x: 1312, y: 0, width: 32, height: 32 },
		gandalfG: { x: 1344, y: 0, width: 32, height: 32 },
		gilGalad: { x: 1376, y: 0, width: 32, height: 32 },
		gimli: { x: 1408, y: 0, width: 32, height: 32 },
		greenChain: { x: 1440, y: 0, width: 32, height: 32 },
		greenSusp: { x: 1472, y: 0, width: 32, height: 32 },
		halfPlate: { x: 1504, y: 0, width: 32, height: 32 },
		halfPlate2: { x: 1536, y: 0, width: 32, height: 32 },
		halfPlate3: { x: 1568, y: 0, width: 32, height: 32 },
		isildur: { x: 1600, y: 0, width: 32, height: 32 },
		jacket2: { x: 1632, y: 0, width: 32, height: 32 },
		jacket3: { x: 1664, y: 0, width: 32, height: 32 },
		jacketStud: { x: 1696, y: 0, width: 32, height: 32 },
		jessica: { x: 1728, y: 0, width: 32, height: 32 },
		karate: { x: 1760, y: 0, width: 32, height: 32 },
		karate2: { x: 1792, y: 0, width: 32, height: 32 },
		learsChainMail: { x: 1824, y: 0, width: 32, height: 32 },
		leather2: { x: 1856, y: 0, width: 32, height: 32 },
		leatherArmour: { x: 1888, y: 0, width: 32, height: 32 },
		leatherArmour2: { x: 1920, y: 0, width: 32, height: 32 },
		leatherArmour3: { x: 1952, y: 0, width: 32, height: 32 },
		leatherGreen: { x: 1984, y: 0, width: 32, height: 32 },
		leatherHeavy: { x: 2016, y: 0, width: 32, height: 32 },
		leatherJacket: { x: 2048, y: 0, width: 32, height: 32 },
		leatherMetal: { x: 2080, y: 0, width: 32, height: 32 },
		leatherRed: { x: 2112, y: 0, width: 32, height: 32 },
		leatherShort: { x: 2144, y: 0, width: 32, height: 32 },
		leatherStud: { x: 2176, y: 0, width: 32, height: 32 },
		legolas: { x: 2208, y: 0, width: 32, height: 32 },
		maxwell: { x: 2240, y: 0, width: 32, height: 32 },
		merry: { x: 2272, y: 0, width: 32, height: 32 },
		meshBlack: { x: 2304, y: 0, width: 32, height: 32 },
		meshRed: { x: 2336, y: 0, width: 32, height: 32 },
		metalBlue: { x: 2368, y: 0, width: 32, height: 32 },
		monkBlack: { x: 2400, y: 0, width: 32, height: 32 },
		monkBlue: { x: 2432, y: 0, width: 32, height: 32 },
		neck: { x: 2464, y: 0, width: 32, height: 32 },
		pipin: { x: 2496, y: 0, width: 32, height: 32 },
		pj: { x: 2528, y: 0, width: 32, height: 32 },
		plate: { x: 2560, y: 0, width: 32, height: 32 },
		plate2: { x: 2592, y: 0, width: 32, height: 32 },
		plateAndCloth: { x: 2624, y: 0, width: 32, height: 32 },
		plateAndCloth2: { x: 2656, y: 0, width: 32, height: 32 },
		plateBlack: { x: 2688, y: 0, width: 32, height: 32 },
		ringmail: { x: 2720, y: 0, width: 32, height: 32 },
		robeBlack: { x: 2752, y: 0, width: 32, height: 32 },
		robeBlackGold: { x: 2784, y: 0, width: 32, height: 32 },
		robeBlackHood: { x: 2816, y: 0, width: 32, height: 32 },
		robeBlackRed: { x: 2848, y: 0, width: 32, height: 32 },
		robeBlue: { x: 2880, y: 0, width: 32, height: 32 },
		robeBlueGreen: { x: 2912, y: 0, width: 32, height: 32 },
		robeBlueWhite: { x: 2944, y: 0, width: 32, height: 32 },
		robeBrown: { x: 2976, y: 0, width: 32, height: 32 },
		robeBrown2: { x: 3008, y: 0, width: 32, height: 32 },
		robeBrown3: { x: 3040, y: 0, width: 32, height: 32 },
		robeClouds: { x: 3072, y: 0, width: 32, height: 32 },
		robeCyan: { x: 3104, y: 0, width: 32, height: 32 },
		robeGray2: { x: 3136, y: 0, width: 32, height: 32 },
		robeGreen: { x: 3168, y: 0, width: 32, height: 32 },
		robeGreenGold: { x: 3200, y: 0, width: 32, height: 32 },
		robeMisfortune: { x: 3232, y: 0, width: 32, height: 32 },
		robeOfNight: { x: 3264, y: 0, width: 32, height: 32 },
		robePurple: { x: 3296, y: 0, width: 32, height: 32 },
		robeRainbow: { x: 3328, y: 0, width: 32, height: 32 },
		robeRed: { x: 3360, y: 0, width: 32, height: 32 },
		robeRed2: { x: 3392, y: 0, width: 32, height: 32 },
		robeRed3: { x: 3424, y: 0, width: 32, height: 32 },
		robeRedGold: { x: 3456, y: 0, width: 32, height: 32 },
		robeWhite: { x: 3488, y: 0, width: 32, height: 32 },
		robeWhite2: { x: 3520, y: 0, width: 32, height: 32 },
		robeWhiteBlue: { x: 3552, y: 0, width: 32, height: 32 },
		robeWhiteGreen: { x: 3584, y: 0, width: 32, height: 32 },
		robeWhiteRed: { x: 3616, y: 0, width: 32, height: 32 },
		robeYellow: { x: 3648, y: 0, width: 32, height: 32 },
		sam: { x: 3680, y: 0, width: 32, height: 32 },
		saruman: { x: 3712, y: 0, width: 32, height: 32 },
		scalemail: { x: 3744, y: 0, width: 32, height: 32 },
		scalemail2: { x: 3776, y: 0, width: 32, height: 32 },
		shirtBlack: { x: 3808, y: 0, width: 32, height: 32 },
		shirtBlack3: { x: 3840, y: 0, width: 32, height: 32 },
		shirtBlackAndCloth: { x: 3872, y: 0, width: 32, height: 32 },
		shirtBlue: { x: 3904, y: 0, width: 32, height: 32 },
		shirtCheck: { x: 3936, y: 0, width: 32, height: 32 },
		shirtHawaii: { x: 3968, y: 0, width: 32, height: 32 },
		shirtVest: { x: 4000, y: 0, width: 32, height: 32 },
		shirtWhite1: { x: 4032, y: 0, width: 32, height: 32 },
		shirtWhite2: { x: 4064, y: 0, width: 32, height: 32 },
		shirtWhite3: { x: 4096, y: 0, width: 32, height: 32 },
		shirtWhiteYellow: { x: 4128, y: 0, width: 32, height: 32 },
		shoulderPad: { x: 4160, y: 0, width: 32, height: 32 },
		skirtOnepGrey: { x: 4192, y: 0, width: 32, height: 32 },
		slitBlack: { x: 4224, y: 0, width: 32, height: 32 },
		suspBlack: { x: 4256, y: 0, width: 32, height: 32 },
		trollHide: { x: 4288, y: 0, width: 32, height: 32 },
		vanhel1: { x: 4320, y: 0, width: 32, height: 32 },
		vestRed: { x: 4352, y: 0, width: 32, height: 32 },
		vestRed2: { x: 4384, y: 0, width: 32, height: 32 },
		zhor: { x: 4416, y: 0, width: 32, height: 32 }
	}
};

var kHair = {
	image: "/images/player/hair.png",
	sprites: {
		aragorn: { x: 0, y: 0, width: 32, height: 32 },
		arwen: { x: 32, y: 0, width: 32, height: 32 },
		boromir: { x: 64, y: 0, width: 32, height: 32 },
		brown1: { x: 96, y: 0, width: 32, height: 32 },
		brown2: { x: 128, y: 0, width: 32, height: 32 },
		elfBlack: { x: 160, y: 0, width: 32, height: 32 },
		elfRed: { x: 192, y: 0, width: 32, height: 32 },
		elfWhite: { x: 224, y: 0, width: 32, height: 32 },
		elfYellow: { x: 256, y: 0, width: 32, height: 32 },
		femBlack: { x: 288, y: 0, width: 32, height: 32 },
		femRed: { x: 320, y: 0, width: 32, height: 32 },
		femWhite: { x: 352, y: 0, width: 32, height: 32 },
		femYellow: { x: 384, y: 0, width: 32, height: 32 },
		frodo: { x: 416, y: 0, width: 32, height: 32 },
		green: { x: 448, y: 0, width: 32, height: 32 },
		knotRed: { x: 480, y: 0, width: 32, height: 32 },
		legolas: { x: 512, y: 0, width: 32, height: 32 },
		longBlack: { x: 544, y: 0, width: 32, height: 32 },
		longRed: { x: 576, y: 0, width: 32, height: 32 },
		longWhite: { x: 608, y: 0, width: 32, height: 32 },
		longYellow: { x: 640, y: 0, width: 32, height: 32 },
		merry: { x: 672, y: 0, width: 32, height: 32 },
		pigtailsBrown: { x: 704, y: 0, width: 32, height: 32 },
		pigtailsYellow: { x: 736, y: 0, width: 32, height: 32 },
		pigtailRed: { x: 768, y: 0, width: 32, height: 32 },
		pj: { x: 800, y: 0, width: 32, height: 32 },
		ponytailYellow: { x: 832, y: 0, width: 32, height: 32 },
		sam: { x: 864, y: 0, width: 32, height: 32 },
		shortBlack: { x: 896, y: 0, width: 32, height: 32 },
		shortRed: { x: 928, y: 0, width: 32, height: 32 },
		shortWhite: { x: 960, y: 0, width: 32, height: 32 },
		shortYellow: { x: 992, y: 0, width: 32, height: 32 }
	}
};

var kLegs = {
	image: "/images/player/legs.png",
	sprites: {
		beltGray: { x: 0, y: 0, width: 32, height: 32 },
		beltRedbrown: { x: 32, y: 0, width: 32, height: 32 },
		bikiniRed: { x: 64, y: 0, width: 32, height: 32 },
		chunli: { x: 96, y: 0, width: 32, height: 32 },
		garter: { x: 128, y: 0, width: 32, height: 32 },
		legArmor00: { x: 160, y: 0, width: 32, height: 32 },
		legArmor01: { x: 192, y: 0, width: 32, height: 32 },
		legArmor02: { x: 224, y: 0, width: 32, height: 32 },
		legArmor03: { x: 256, y: 0, width: 32, height: 32 },
		legArmor04: { x: 288, y: 0, width: 32, height: 32 },
		legArmor05: { x: 320, y: 0, width: 32, height: 32 },
		loinclothRed: { x: 352, y: 0, width: 32, height: 32 },
		longRed: { x: 384, y: 0, width: 32, height: 32 },
		metalGray: { x: 416, y: 0, width: 32, height: 32 },
		metalGreen: { x: 448, y: 0, width: 32, height: 32 },
		pants16: { x: 480, y: 0, width: 32, height: 32 },
		pantsBlack: { x: 512, y: 0, width: 32, height: 32 },
		pantsBlue: { x: 544, y: 0, width: 32, height: 32 },
		pantsBrown: { x: 576, y: 0, width: 32, height: 32 },
		pantsDarkgreen: { x: 608, y: 0, width: 32, height: 32 },
		pantsLWhite: { x: 640, y: 0, width: 32, height: 32 },
		pantsOrange: { x: 672, y: 0, width: 32, height: 32 },
		pantsRed: { x: 704, y: 0, width: 32, height: 32 },
		pantsShortBrown: { x: 736, y: 0, width: 32, height: 32 },
		pantsShortBrown3: { x: 768, y: 0, width: 32, height: 32 },
		pantsShortDarkbrown: { x: 800, y: 0, width: 32, height: 32 },
		pantsShortGray: { x: 832, y: 0, width: 32, height: 32 },
		pj: { x: 864, y: 0, width: 32, height: 32 },
		skirtBlue: { x: 896, y: 0, width: 32, height: 32 },
		skirtGreen: { x: 928, y: 0, width: 32, height: 32 },
		skirtRed: { x: 960, y: 0, width: 32, height: 32 },
		skirtWhite: { x: 992, y: 0, width: 32, height: 32 },
		skirtWhite2: { x: 1024, y: 0, width: 32, height: 32 },
		trouserGreen: { x: 1056, y: 0, width: 32, height: 32 }
	}
};

/**
 * @param {SpriteManager} manager
 */
module.exports.loadSprites = function(manager)
{
	manager.load(kBase);
	manager.load(kBody);
	manager.load(kHair);
	manager.load(kLegs);
};
},{}],23:[function(require,module,exports){

var events = require("events");

var inherits = require("inherits");

var Sprite = require("./drawable/sprite");
var AnimatedSprite = require("./drawable/animatedsprite");
var StaticPattern = require("./drawable/staticpattern");

/**
 * @extends {EventEmitter}
 * @constructor
 */
var SpriteManager = function()
{
	events.EventEmitter.call(this);

	this.images = {};
	this.spritesDesc = {};
	this.sprites = {};

	this.loadComplete = false;
	this.totalImages = 0;
	this.loadedImages = 0;

	this.imageLoadedDelegate = this.imageLoaded.bind(this);
};
inherits(SpriteManager, events.EventEmitter);

SpriteManager.prototype.load = function(descr)
{
	var image = descr.image;
	var sprites = descr.sprites;
	if (this.images[image] === undefined)
	{
		this.totalImages++;

		var img = new Image();
		img.onload = this.imageLoadedDelegate;
		img.src = image;
		this.images[image] = img;
	}
	var spriteName;
	for(spriteName in sprites)
	{
		if (!sprites.hasOwnProperty(spriteName))
			continue;
		this.spritesDesc[spriteName] = sprites[spriteName];
		this.spritesDesc[spriteName].img = this.images[image];
	}
};

SpriteManager.prototype.imageLoaded = function()
{
	this.loadedImages++;
	if (this.totalImages === this.loadedImages)
	{
		this.loadComplete = true;
		this.emit("imagesLoaded");
	}
};

SpriteManager.prototype.getSprite = function(name)
{
	var desc = this.spritesDesc[name];
	if (desc === undefined)
		return null;
	var sprite = this.sprites[name];
	if (sprite === undefined)
	{
		if (desc.anim !== undefined)
			sprite = new AnimatedSprite(desc);
		else
			sprite = new Sprite(desc);
		this.sprites[name] = sprite;
	}

	return sprite;
};

SpriteManager.prototype.getSpriteDescr = function(name) {
	var desc = this.spritesDesc[name];
	if (desc === undefined)
		return null;
	return desc;
};

SpriteManager.prototype.getPattern = function(name)
{
	var desc = this.spritesDesc[name];
	if (desc === undefined)
		return null;
	var sprite = this.sprites[name + "_pattern"];
	if (sprite === undefined)
	{
		sprite = new StaticPattern(name);
		this.sprites[name + "_pattern"] = sprite;
	}

	return sprite;
};

module.exports = new SpriteManager();

},{"./drawable/animatedsprite":12,"./drawable/sprite":20,"./drawable/staticpattern":21,"events":34,"inherits":35}],24:[function(require,module,exports){

var kTilesetDescription = {
	image: '/images/tiles.png',
	sprites: {
		stoneOld: {
			x: 0,
			y: 0,
			width: 60,
			height: 52
		},
		water: {
			x: 60,
			y: 0,
			width: 60,
			height: 52
		},
		grass: {
			x: 120,
			y: 0,
			width: 60,
			height: 52
		}
	}
};
var kTilesetDescription2 = {
	image: '/images/hexagon.png',
	sprites: {
		stone: {
			x: 0,
			y: 0,
			width: 60,
			height: 52
		},
		lightHexOverlay: {
			x: 60,
			y: 0,
			width: 60,
			height: 52
		},
		darkHexOverlay: {
			x: 120,
			y: 0,
			width: 60,
			height: 52
		}
	}
};
var kBackgroundLava = {
	image: '/images/lava2.png',
	sprites: {
		lavaBackground: {
			x: 0,
			y: 0,
			width: 420,
			height: 571
		}
	}
};

var kAnimatedBlood = {
	image: '/images/blood.png',
	sprites: {
		animatedBlood: {
			x: 0,
			y: 0,
			width: 32,
			height: 32,
			anim: {
				frameCount: 16,
				frameTime: 60,
				cycle: true
			}
		}
	}
};

var kUISprite = {
	image: '/images/ui.png',
	sprites: {
		activeWindowBg: {x: 74, y: 82, width: 128, height: 128},
		activeWindowL: {x: 73, y: 44, width: 6, height: 1},
		activeWindowR: {x: 185, y: 44, width: 6, height: 1},
		activeWindowT: {x: 100, y: 27, width: 1, height: 6},
		activeWindowB: {x: 85, y: 51, width: 1, height: 6},
		activeWindowTL: {x: 88, y: 47, width: 10, height: 10},
		activeWindowTR: {x: 99, y: 47, width: 10, height: 10},
		activeWindowBL: {x: 73, y: 47, width: 10, height: 10},
		activeWindowBR: {x: 181, y: 47, width: 10, height: 10},

		decoButtonNormalTL: {x: 0, y: 491, width: 9, height: 9},
		decoButtonNormalT: {x: 10, y: 491, width: 1, height: 3},
		decoButtonNormalTR: {x: 12, y: 491, width: 9, height: 9},
		decoButtonNormalR: {x: 18, y: 501, width: 3, height: 1},
		decoButtonNormalBR: {x: 12, y: 503, width: 9, height: 9},
		decoButtonNormalB: {x: 10, y: 509, width: 1, height: 3},
		decoButtonNormalBL: {x: 0, y: 503, width: 9, height: 9},
		decoButtonNormalL: {x: 0, y: 501, width: 3, height: 1},
		decoButtonNormalBg: {x: 205, y: 82, width: 128, height: 128},

		decoButtonHoverTL: {x: 25, y: 491, width: 9, height: 9},
		decoButtonHoverT: {x: 35, y: 491, width: 1, height: 7},
		decoButtonHoverTR: {x: 37, y: 491, width: 9, height: 9},
		decoButtonHoverR: {x: 39, y: 501, width: 7, height: 1},
		decoButtonHoverBR: {x: 37, y: 503, width: 9, height: 9},
		decoButtonHoverB: {x: 35, y: 505, width: 1, height: 7},
		decoButtonHoverBL: {x: 25, y: 503, width: 9, height: 9},
		decoButtonHoverL: {x: 25, y: 501, width: 7, height: 1},
		decoButtonHoverBg: {x: 205, y: 82, width: 128, height: 128},

		hDecoScrollbarLeftNormal: {x: 82, y: 354, width: 15, height: 14},
		hDecoScrollbarLeftHover: {x: 82, y: 369, width: 15, height: 14},
		hDecoScrollbarRightNormal: {x: 64, y: 354, width: 15, height: 14},
		hDecoScrollbarRightHover: {x: 64, y: 369, width: 15, height: 14}
	}
};

/**
 * @param {SpriteManager} manager
 */
module.exports.loadSprites = function(manager)
{
	manager.load(kUISprite);
	manager.load(kTilesetDescription);
	manager.load(kTilesetDescription2);
	manager.load(kBackgroundLava);
	manager.load(kAnimatedBlood);
};

},{}],25:[function(require,module,exports){

var inherits = require("inherits");
var events = require("events");

var mathUtils = require("../../util/math");
var Rectangle = mathUtils.Rectangle;

var Actor = function(width, height)
{
	events.EventEmitter.call(this);

	/** @type {goog.math.Rect} */
	this.rect = new Rectangle(0, 0, width || 0, height || 0);

	this.font = "";
	this.lineHeight = Actor.kDefaultFontSize * 1.2;

	/** @type {Sprite} */
	this.texture = null;

	this.isMouseHover = false;
	this.isMousePressed = false;
};
inherits(Actor, events.EventEmitter);

Actor.prototype.setFont = function(fontStr, lineHeight)
{
	this.font = fontStr;
	this.lineHeight = lineHeight;
};

Actor.prototype.draw = function(ctx, timeStamp)
{
	if (this.texture === null)
		return;

	this.texture.draw(ctx, timeStamp);
};

Actor.prototype.setTexture = function(txt)
{
	this.texture = txt;
};

Actor.prototype.onMouseOut = function()
{
	this.isMouseHover = false;
};

Actor.prototype.onMouseOver = function()
{
	this.isMouseHover = true;
};

Actor.prototype.onMouseMove = function(coord)
{
};

Actor.prototype.onMouseDown = function(coord)
{
	this.isMousePressed = true;
	return false;
};

Actor.prototype.onMouseUp = function(coord)
{
	this.isMousePressed = false;
	return false;
};

Actor.kDefaultFontSize = 10;

module.exports = Actor;
},{"../../util/math":33,"events":34,"inherits":35}],26:[function(require,module,exports){

var inherits = require("inherits");

var Actor = require("./actor");
var NinePatch = require("../drawable/ninepatch");

var Button = function(width, height)
{
	Actor.call(this, width, height);

	this.text = "";

	this.normalTexture = new NinePatch("decoButtonNormal", width, height);
	this.hoverTexture = new NinePatch("decoButtonHover", width, height);

	this.setTexture(this.normalTexture);
};
inherits(Button, Actor);

Button.prototype.setText = function(text)
{
	this.text = text;
	this.textPosition = null;
};

Button.prototype.setNormalTexture = function(texture)
{
	this.normalTexture = texture;
	this.setTexture(this.normalTexture);
};

Button.prototype.setHoverTexture = function(texture)
{
	this.hoverTexture = texture;
};

Button.prototype.draw = function(ctx, timeStamp)
{
	Button.super_.prototype.draw.call(this, ctx, timeStamp);

	if (!this.text)
		return;
	if (this.font)
		ctx.font = this.font;
	ctx.textBaseline = "top";

	if (this.textPosition === null)
		this.calcTextPosition_(ctx);

	ctx.fillText(this.text, this.textPosition.x, this.textPosition.y);
};

Button.prototype.calcTextPosition_ = function(ctx)
{
	var size = ctx.measureText(this.text);
	this.textPosition = {
		x: (this.rect.width/2 - size.width/2) | 0,
		y: (this.rect.height/2 - this.lineHeight/2) | 0
	};
};

Button.prototype.onMouseOut = function()
{
	Button.super_.prototype.onMouseOut.call(this);
	this.setTexture(this.normalTexture);
};

Button.prototype.onMouseOver = function()
{
	Button.super_.prototype.onMouseOver.call(this);
	this.setTexture(this.hoverTexture);
};

Button.prototype.onMouseUp = function(coord)
{
	if (this.isMousePressed)
		this.emit("activate");

	Button.super_.prototype.onMouseUp.call(this, coord);

	return true;
};

Button.prototype.onMouseDown = function(coord)
{
	Button.super_.prototype.onMouseDown.call(this, coord);
	return true;
};

module.exports = Button;
},{"../drawable/ninepatch":17,"./actor":25,"inherits":35}],27:[function(require,module,exports){

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
},{"../../../entity/gurad":5,"../../../entity/player":7,"../../../util/math":33,"../../drawable/offsetfilter":18,"../../drawable/player":19,"../../spritemanager":23}],28:[function(require,module,exports){

var inherits = require("inherits");

var Actor = require("../actor");
var PlayerModel = require("../../drawable/player");
var EntityRender = require("./entityrender");
var mathUtils = require("../../../util/math");
var Rectangle = mathUtils.Rectangle;
var Coordinate = mathUtils.Coordinate;
var Hexagon = require("../../../board/hexagon");
var FilterQueue = require("../../drawable/filterqueue");
var JumpFilter = require("../../drawable/jumpfilter");
var GameRules = require("../../../game/gamerules");

var GameField = function(width, height)
{
	Actor.call(this, width, height);

	this.player = new PlayerModel();

	/** @type {Game} */
	this.game = null;

	this.hexSize = GameField.kHexagonSize;

	this.spriteManager = require("../../spritemanager");

	this.lavaSprite = this.spriteManager.getSprite("lavaBackground");
	this.lightOverlay = this.spriteManager.getSprite("lightHexOverlay");
	this.darkOverlay = this.spriteManager.getSprite("darkHexOverlay");

	this.mousePos = null;
	this.lastPathToMouse = null;

	this.entRender = new EntityRender(this);

	/**
	 * @type {Rectangle}
	 * @private
	 */
	this.currDrawingRect_ = new Rectangle(0, 0, 0, 0);
};
inherits(GameField, Actor);

GameField.prototype.draw = function(ctx, timeStamp)
{
	if (this.game === null)
		return;

	this.lavaSprite.draw(ctx, timeStamp, 0, 0, this.width, this.height);

	this.game.board.board.forEach(function(column, i){
		column.forEach(function(hex, j){
			var coord = this.hexToScreen(i, j);
			if (hex.contents !== Hexagon.Contents.Empty)
			{
				var hexSprite = this.spriteManager.getSprite(hex.type);
				this.currDrawingRect_.left = coord.x;
				this.currDrawingRect_.top = coord.y;
				this.currDrawingRect_.width = hexSprite.width;
				this.currDrawingRect_.height = coord.height;
				hexSprite.draw(ctx, timeStamp, this.currDrawingRect_);
			}
		}, this);
	}, this);

	this.game.entities.forEach(function(entity){
		this.entRender.drawEntity(entity, ctx, timeStamp);
	}, this);

	this.drawOverlayPath_(ctx, timeStamp);
};

GameField.prototype.drawOverlayPath_ = function(ctx, timeStamp)
{
	if (this.lastPathToMouse === null || this.lastPathToMouse.length <= 0)
		return;

	ctx.globalCompositeOperation = "multiply";
	var coord;
	for(var i = 0; i < this.lastPathToMouse.length; i++)
	{
		coord = this.hexToScreen(this.lastPathToMouse[i]);
		this.currDrawingRect_.left = coord.x;
		this.currDrawingRect_.top = coord.y;
		if (i !== this.lastPathToMouse.length - 1)
			this.lightOverlay.draw(ctx, timeStamp, this.currDrawingRect_);
		else
			this.darkOverlay.draw(ctx, timeStamp, this.currDrawingRect_);
	}
	ctx.globalCompositeOperation = "source-over";
};

GameField.prototype.hexToScreen = function(i, j)
{
	if (j === undefined)
	{
		j = i.y;
		i = i.x;
	}
	var coord = new Coordinate();
	coord.x = i * this.hexSize * 3 / 2 | 0;

	var height = Math.sqrt(3) * this.hexSize;
	coord.y = j * height;
	if (i % 2)
		coord.y += height/2;
	coord.y = coord.y | 0;
	return coord;
};

GameField.prototype.getHexByCoordinate = function(coord)
{
	var S = this.hexSize * 3 / 2;
	var H = Math.sqrt(3) * this.hexSize;
	var it = Math.floor(coord.x / S);
	var yts = coord.y - (it % 2) * H / 2;
	var jt = Math.floor(yts / H);
	var xt = coord.x - it * S;
	var yt = yts - jt * H;

	var i = it;
	if (xt <= this.hexSize * Math.abs(1/2 - yt/H))
		i--;
	var dj = yt > H/2 ? 1 : 0;
	var j = jt;
	if (xt <= this.hexSize * Math.abs(1/2 - yt/H))
		j = j - i % 2 + dj;

	return new Coordinate(i, j);
};


GameField.prototype.onMouseOut = function()
{
	GameField.super_.prototype.onMouseOut.call(this);

	this.mousePos = null;
};

GameField.prototype.onMouseMove = function(coord)
{
	GameField.super_.prototype.onMouseOver.call(this, coord);

	var currMousePos = this.getHexByCoordinate(coord);
	if (currMousePos !== null)
	{
		if (this.mousePos === null || (this.mousePos.x !== currMousePos.x || this.mousePos.y !== currMousePos.y))
		{
			this.lastPathToMouse = this.game.board.findPath(this.game.player.origin, currMousePos);
			this.mousePos = currMousePos;
		}
	}
	else
	{
		this.mousePos = null;
		this.lastPathToMouse = null;
	}
};

GameField.prototype.onMouseUp = function(coord)
{
	if (!this.isMousePressed)
		return true;

	GameField.super_.prototype.onMouseUp.call(this, coord);

	var hex = this.getHexByCoordinate(coord);
	if (!this.game.rules.playerCanMoveToCoord(hex))
		return true;

	var path = this.game.board.findPath(this.game.player.origin, hex);
	if (path === null || !path.length)
		return true;

	if (!this.game.rules.requestMove(this.game.player.origin, path[0]))
		return true;

	var filters = new FilterQueue();
	var i = 0;
	while(i < path.length)
	{
		filters.addFilter(
			new JumpFilter(
				this.hexToScreen(i === 0 ? this.game.player.origin : path[i - 1]),
				this.hexToScreen(path[i]),
				GameRules.kPlayerActionDelay * 2));
		i++;
	}
	this.game.player.model.addFilter(filters, true);

	this.game.player.setOrigin(path[0]);
	this.game.setThinkToMonsters(this.game.gameTime);

	return true;
};

GameField.kHexagonSize = 30;

module.exports = GameField;
},{"../../../board/hexagon":3,"../../../game/gamerules":10,"../../../util/math":33,"../../drawable/filterqueue":15,"../../drawable/jumpfilter":16,"../../drawable/player":19,"../../spritemanager":23,"../actor":25,"./entityrender":27,"inherits":35}],29:[function(require,module,exports){

var inherits = require("inherits");

var Actor = require("./actor");
var mathUtils = require("../../util/math");
var Coordinate = mathUtils.Coordinate;

var Group = function(width, height)
{
	Actor.call(this, width, height);

	/** @type {Actor} */
	this.children = [];
};
inherits(Group, Actor);

Group.prototype.draw = function(ctx, timeStamp)
{
	Group.super_.prototype.draw.call(this, ctx, timeStamp);

	this.children.forEach(function(child){
		ctx.save();
		ctx.translate(child.rect.left, child.rect.top);
		child.draw(ctx, timeStamp);
		ctx.restore();
	}, this);
};

Group.prototype.addChild = function(child)
{
	this.children.push(child);
};

Group.prototype.setFont = function(fontStr, lineHeight)
{
	Group.super_.prototype.setFont.call(this);
	this.children.forEach(function(child){
		child.setFont(fontStr, lineHeight);
	}, this);
};

Group.prototype.onMouseOut = function()
{
	Group.super_.prototype.onMouseOut.call(this);
	var i = 0;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		if (!this.children[i].isMouseHover)
			continue;
		this.children[i].onMouseOut();
	}
};

Group.prototype.onMouseMove = function(coord)
{
	Group.super_.prototype.onMouseMove.call(this, coord);
	var i = 0;
	var moveCatched = false;
	var rect;
	var newCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
		{
			if (this.children[i].isMouseHover)
				this.children[i].onMouseOut();
			continue;
		}
		if (!moveCatched)
		{
			newCoord = new Coordinate(coord.x - rect.left, coord.y - rect.top);
			if (!this.children[i].isMouseHover)
				this.children[i].onMouseOver(newCoord);
			this.children[i].onMouseMove(newCoord);
			moveCatched = true;
			continue;
		}
		if (this.children[i].isMouseHover)
			this.children[i].onMouseOut();
	}
};

Group.prototype.onMouseDown = function(coord)
{
	Group.super_.prototype.onMouseDown.call(this, coord);

	var i = 0;
	var rect;
	var childCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
			continue;
		childCoord = new Coordinate(coord.x - rect.left, coord.y - rect.top);
		if (this.children[i].onMouseDown(childCoord))
			return true;
	}
};

Group.prototype.onMouseUp = function(coord)
{
	Group.super_.prototype.onMouseUp.call(this, coord);

	var i = 0;
	var rect;
	var childCoord;
	for(i = this.children.length - 1; i >= 0; --i)
	{
		rect = this.children[i].rect;
		if (!rect.contains(coord))
			continue;
		childCoord = new Coordinate(coord.x - rect.left, coord.y - rect.top);
		if (this.children[i].onMouseUp(childCoord))
			return true;
	}
};

module.exports = Group;

},{"../../util/math":33,"./actor":25,"inherits":35}],30:[function(require,module,exports){

var inherits = require("inherits");
var UIScreen = require("./screen");

var GameField = require("../game/gamefield");
var Game = require("../../../game/game");
var GameRules = require("../../../game/gamerules");

var GameScreen = function(width, height)
{
	UIScreen.call(this, width, height);

	this.setFont("small-caps bold 14px arial", 14 * 1.2);

	this.game = new Game();

	this.field = new GameField(kFieldWidth, kFieldHeight);
	this.field.rect.top = 10;
	this.field.rect.left = 10;
	this.addChild(this.field);

	this.field.game = this.game;
};
inherits(GameScreen, UIScreen);

GameScreen.prototype.draw = function(ctx, timeStamp)
{
	this.game.update(timeStamp);

	GameScreen.super_.prototype.draw.call(this, ctx, timeStamp);
};

var kFieldWidth =
	GameField.kHexagonSize * 3/2 * (GameRules.kDiagonalHexCount * 2 - 1) + (1/2) * GameField.kHexagonSize;
var kFieldHeight = Math.sqrt(3) * GameField.kHexagonSize *
	(GameRules.kDiagonalHexCount + GameRules.kVerticalHexCount - 0.5 * (GameRules.kDiagonalHexCount % 2 + 1)) | 0 ;

module.exports = GameScreen;
},{"../../../game/game":9,"../../../game/gamerules":10,"../game/gamefield":28,"./screen":32,"inherits":35}],31:[function(require,module,exports){

var inherits = require("inherits");
var UIScreen = require("./screen");
var Button = require("../button");

var MenuScreen = function(width, height)
{
	UIScreen.call(this, width, height);

	var button = new Button(100, 50);
	button.rect.left = 20;
	button.rect.top = 20;
	button.setText("New Game");
	button.setFont("small-caps bold 18px arial", 18 * 1.2);
	this.addChild(button);

	button = new Button(100, 50);
	button.rect.left = 20;
	button.rect.top = 90;
	button.setText("Options");
	button.setFont("small-caps bold 18px arial", 18 * 1.2);

//	button.onActivate = function() {
//		var app = Falarica.Application.getInstance();
//		app.showGameScreen();
//	};
	this.addChild(button);
};
inherits(MenuScreen, UIScreen);

MenuScreen.prototype.show = function()
{

};

MenuScreen.prototype.hide = function()
{
};

MenuScreen.prototype.update = function(timeStamp)
{
};

module.exports = MenuScreen;

},{"../button":26,"./screen":32,"inherits":35}],32:[function(require,module,exports){

var inherits = require("inherits");
var Group = require("../group");
var NinePatch = require("../../drawable/ninepatch");

/**
 * @param {number} width
 * @param {number} height
 * @constructor
 */
var UIScreen = function(width, height)
{
	Group.call(this, width, height);

	var text = new NinePatch("activeWindow", width, height);
	this.setTexture(text);
};
inherits(UIScreen, Group);

UIScreen.prototype.show = function()
{
};

UIScreen.prototype.hide = function()
{
};

UIScreen.prototype.update = function(timeStamp)
{
};

module.exports = UIScreen;
},{"../../drawable/ninepatch":17,"../group":29,"inherits":35}],33:[function(require,module,exports){


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
},{"inherits":35}],34:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],35:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}]},{},[8])