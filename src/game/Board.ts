import {IllegalArgumentException} from 'Error/IllegalArgumentException';
import {Hexagon, HexagonType} from 'game/Hexagon';
import {ICord} from 'game/Util/ICord';

const kNeighborsDi = [0, 1, 1, 0, -1, -1];
const kNeighborsDj = [
    [-1, -1, 0, 1, 0, -1],
    [-1, 0, 1, 1, 1, 0]
];

interface IFindPathHex
{
    cost: number;
    approximateCost: number;
    parent: string|null;
    origin: ICord;
}

type FindPathList = {[key: string]: IFindPathHex};

export class Board
{
    private diagonalHexCount: number;
    private verticalHexCount: number;
    private width: number;
    private height: number;
    private board: Hexagon[][] = [];

    constructor(diagonalHexCount: number, verticalHexCount: number)
    {
        this.diagonalHexCount = diagonalHexCount;
        this.verticalHexCount = verticalHexCount;

        this.width = diagonalHexCount * 2 - 1;
        this.height = verticalHexCount * 2 - 1 + verticalHexCount;

        this.initBoard();
    }

    private initBoard(): void
    {
        let i = 0;
        for(i = this.diagonalHexCount - 1; i >= 0; i--)
        {
            this.board.push(this.buildColumn(i));
            if (i !== this.diagonalHexCount - 1)
                this.board.unshift(this.buildColumn(i));
        }
    }

    private buildColumn(column: number): Hexagon[]
    {
        let result = [];
        let i = 0, hexCount = this.getColumnHexCount(column);
        let totalHexCount = this.getColumnHexCount(this.diagonalHexCount - 1);

        let emptyCount = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalHexCount % 2) * (column % 2);
        let oddColumn = (column % 2) && (this.diagonalHexCount % 2);

        for(i = 0; i < emptyCount; i++)
            result.push(new Hexagon(HexagonType.Lava));

        for(i = 0; i < hexCount; i++)
        {
            // if (Math.random() < 0.1)
            //     result.push(new Hexagon(HexagonType.Lava));
            // else
            result.push(new Hexagon(HexagonType.Stone));
        }

        for(i = 0; i < (oddColumn ? emptyCount + 1 : emptyCount); i++)
            result.push(new Hexagon(HexagonType.Lava));

        return result;
    }

    private getColumnHexCount(column: number): number
    {
        if (column >= this.diagonalHexCount)
            column = this.diagonalHexCount - (column - this.diagonalHexCount) - 2;

        return this.verticalHexCount + column;
    };

    private getColumnInfo(column: number): [number, number]
    {
        let totalHexCount = this.getColumnHexCount(this.diagonalHexCount - 1);
        let hexCount = this.getColumnHexCount(column);
        let startHex = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalHexCount % 2) * (column % 2);

        return [startHex, startHex + hexCount];
    };

    private hexInBoard(cord: ICord): boolean
    {
        if (cord.x < 0 || cord.y < 0)
            return false;
        if (cord.x >= this.width || cord.y >= this.height)
            return false;

        let info = this.getColumnInfo(cord.x);

        return cord.y >= info[0] && cord.y < info[1];
    }

    private getHex(cord: ICord): Hexagon
    {
        if (!this.hexInBoard(cord))
            throw new IllegalArgumentException();

        return this.board[cord.x][cord.y];
    }

    private findPath(from: ICord, to: ICord): ICord[]|null
    {
        // if (!this.hexInBoard(from) || !this.hexInBoard(to))
        //     return null;
        //
        // let targetKey = to.toString();
        // let open: FindPathList = {};
        // let closed: FindPathList = {};
        // open[`${from.x},${from.y}`] = {
        //     cost: 0,
        //     approximateCost: this.getApproximateCost(from, to),
        //     parent: null,
        //     origin: from
        // };
        // let current: string|null;
        // let neighbors = [];
        // let currentCost = 0;
        // let pathFinded = false;
        // while(true)
        // {
        //     current = this.getBestCost(open);
        //     if (current === null)
        //         return null;
        //
        //     closed[current] = open[current];
        //     delete open[current];
        //
        //     currentCost = closed[current].cost;
        //
        //     neighbors = this.getNeighbors(closed[current].origin);
        //     neighbors.forEach(function(coord){
        //         var hex = this.getHex(coord);
        //         if (hex.getType() !== HexagonType.Stone)
        //             return;
        //
        //         var listKey = coord.toString();
        //         if (closed[listKey] !== undefined)
        //             return;
        //         var inOpen = open[listKey];
        //         var thisCost = currentCost + 1;
        //         if (inOpen !== undefined)
        //         {
        //             if (thisCost < inOpen.cost)
        //             {
        //                 inOpen.cost = thisCost;
        //                 inOpen.parent = current;
        //             }
        //         }
        //         else
        //         {
        //             if (targetKey !== listKey)
        //             {
        //                 open[listKey] = {
        //                     cost: thisCost,
        //                     approximateCost: this.getApproximateCost(coord, to),
        //                     parent: current,
        //                     origin: coord
        //                 };
        //             }
        //             else
        //                 pathFinded = true;
        //         }
        //     }, this);
        //     if (pathFinded)
        //         return this.buildPath_(closed, current, to);

        return null;
    }

    private buildPath(closedList: FindPathList, current: string, to: ICord): ICord[]
    {
        let path = [to];

        while(closedList[current].parent !== null)
        {
            path.unshift(closedList[current].origin);
            current = closedList[current].parent as string;
        }

        return path;
    }

    private getBestCost(openList: FindPathList): string|null
    {
        let point;
        let minCost = Infinity, minPoint = null;
        for(point in openList)
        {
            if (openList[point].cost + openList[point].approximateCost < minCost)
            {
                minCost = openList[point].cost;
                minPoint = point;
            }
        }

        return minPoint;
    }

    private getApproximateCost(from: ICord, to: ICord): number
    {
        return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    };
}
