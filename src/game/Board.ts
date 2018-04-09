import {Hexagon, HexagonType} from 'game/Hexagon';

const kNeighborsDi = [0, 1, 1, 0, -1, -1];
const kNeighborsDj = [
    [-1, -1, 0, 1, 0, -1],
    [-1, 0, 1, 1, 1, 0]
];

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
}

export enum Direction
{
    None,
    Top,
    TopRight,
    BottomRight,
    Bottom,
    BottomLeft,
    TopLeft
}
