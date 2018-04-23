import {IllegalArgumentException} from 'Error/IllegalArgumentException';
import {Hexagon, HexagonType} from 'game/Hexagon';
import {ICord} from 'game/Util/ICord';

const kNeighborsDi = [0, 1, 1, 0, -1, -1];
const kNeighborsDj = [
    [-1, -1, 0, 1, 0, -1],
    [-1, 0, 1, 1, 1, 0],
];

interface IFindPathHex
{
    cost: number;
    approximateCost: number;
    parent: string|null;
    origin: ICord;
}

interface IFindPathList
{
    [key: string]: IFindPathHex;
}

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
        for (i = this.diagonalHexCount - 1; i >= 0; i--)
        {
            this.board.push(this.buildColumn(i));
            if (i !== this.diagonalHexCount - 1)
                this.board.unshift(this.buildColumn(i));
        }
    }

    private buildColumn(column: number): Hexagon[]
    {
        const result = [];
        let i = 0;
        const hexCount = this.getColumnHexCount(column);
        const totalHexCount = this.getColumnHexCount(this.diagonalHexCount - 1);

        const emptyCount = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalHexCount % 2) * (column % 2);
        const oddColumn = (column % 2) && (this.diagonalHexCount % 2);

        for (i = 0; i < emptyCount; i++)
            result.push(new Hexagon(HexagonType.Lava));

        for (i = 0; i < hexCount; i++)
        {
            // if (Math.random() < 0.1)
            //     result.push(new Hexagon(HexagonType.Lava));
            // else
            result.push(new Hexagon(HexagonType.Stone));
        }

        for (i = 0; i < (oddColumn ? emptyCount + 1 : emptyCount); i++)
            result.push(new Hexagon(HexagonType.Lava));

        return result;
    }

    private getColumnHexCount(column: number): number
    {
        if (column >= this.diagonalHexCount)
            column = this.diagonalHexCount - (column - this.diagonalHexCount) - 2;

        return this.verticalHexCount + column;
    }

    private getColumnInfo(column: number): [number, number]
    {
        const totalHexCount = this.getColumnHexCount(this.diagonalHexCount - 1);
        const hexCount = this.getColumnHexCount(column);
        const startHex = Math.ceil((totalHexCount - hexCount) / 2) - (this.diagonalHexCount % 2) * (column % 2);

        return [startHex, startHex + hexCount];
    }

    private hexInBoard(cord: ICord): boolean
    {
        if (cord.x < 0 || cord.y < 0)
            return false;
        if (cord.x >= this.width || cord.y >= this.height)
            return false;

        const info = this.getColumnInfo(cord.x);

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
        if (!this.hexInBoard(from) || !this.hexInBoard(to))
            return null;

        const targetKey = to.toString();
        const open: IFindPathList = {};
        const closed: IFindPathList = {};
        open[`${from.x},${from.y}`] = {
            cost: 0,
            approximateCost: this.getApproximateCost(from, to),
            parent: null,
            origin: from,
        };
        let current: string|null;
        let neighbors: ICord[];
        let currentCost = 0;
        let pathFinded = false;

        while (true)
        {
            current = this.getBestCost(open);
            if (current === null)
                return null;

            closed[current] = open[current];
            delete open[current];

            currentCost = closed[current].cost;

            neighbors = this.getNeighbors(closed[current].origin);
            neighbors.forEach((coord) =>
            {
                const hex = this.getHex(coord);
                if (hex.getType() !== HexagonType.Stone)
                    return;

                const listKey = coord.toString();
                if (closed[listKey] !== undefined)
                    return;
                const inOpen = open[listKey];
                const thisCost = currentCost + 1;
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
                            origin: coord,
                        };
                    }
                    else
                        pathFinded = true;
                }
            });
            if (pathFinded)
                return this.buildPath(closed, current, to);
        }
    }

    private buildPath(closedList: IFindPathList, current: string, to: ICord): ICord[]
    {
        const path = [to];

        while (closedList[current].parent !== null)
        {
            path.unshift(closedList[current].origin);
            current = closedList[current].parent as string;
        }

        return path;
    }

    private getBestCost(openList: IFindPathList): string|null
    {
        let point;
        let minCost = Infinity;
        let minPoint = null;
        for (point in openList)
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
    }

    private getNeighbors(coord: ICord): ICord[]
    {
        if (!this.hexInBoard(coord))
            return [];

        const result = [];
        let neighbor: ICord;
        for (let n = 0; n < 6; n++)
        {
            neighbor = {
                x: coord.x + kNeighborsDi[n],
                y: coord.y + kNeighborsDj[coord.x % 2][n],
            };

            if (this.hexInBoard(neighbor))
                result.push(neighbor);
        }

        return result;
    }
}
