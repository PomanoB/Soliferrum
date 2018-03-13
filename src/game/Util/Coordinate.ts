
import {IEquatable} from 'game/Util/IEquatable';

export class Coordinate implements IEquatable
{
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;
    }

    public isEqual(other: object|null): boolean
    {
        return (other instanceof Coordinate) && this.x === other.x && this.y === other.y;
    }
}