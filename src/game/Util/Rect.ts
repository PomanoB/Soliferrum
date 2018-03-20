
export class Rect
{
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public contains(x: number, y: number): boolean
    {
        return this.x <= x && this.y <= y && this.x + this.width >= x && this.y + this.height >= y;
    }
}
