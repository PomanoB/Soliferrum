
export enum HexagonType
{
    Grass,
    Stone,
    Water,
    Lava,
}

export enum HexagonContents
{
    Empty,
    Solid,
    Lava,
    Ground,
}

export class Hexagon
{
    private type: HexagonType;

    constructor(type: HexagonType)
    {
        this.type = type;
    }

    public getType(): HexagonType
    {
        return this.type;
    }
}
