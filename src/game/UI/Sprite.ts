import {IDrawable} from 'game/UI/IDrawable';
import {Rect} from 'game/Util/Rect';

export class Sprite implements IDrawable
{
    private img: HTMLImageElement;
    private rect: Rect;

    constructor(
        img: HTMLImageElement,
        x: number = 0, y: number = 0,
        width: number = img.width, height: number = img.height)
    {
        this.img = img;

        this.rect = new Rect(x, y, width, height);
    }

    public draw(ctx: CanvasRenderingContext2D, timeStamp: number, rect: Rect): void
    {
        ctx.drawImage(this.img,
            this.rect.x, this.rect.y,
            this.rect.width, this.rect.height,
            rect.x, rect.y, rect.width, rect.height);
    }

    public getRect(): Rect
    {
        return this.rect;
    }
}
