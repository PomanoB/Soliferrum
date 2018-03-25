import {EventEmitter} from 'events';
import {IDrawable} from 'game/UI/IDrawable';
import {Rect} from 'game/Util/Rect';

export class Actor extends EventEmitter
{
    protected rect: Rect;
    protected texture: IDrawable|null;
    protected isOnMouse: boolean = false;

    constructor(rect: Rect = new Rect(), drawable: IDrawable|null = null)
    {
        super();

        this.rect = rect;
        this.texture = drawable;
    }

    public draw(ctx: CanvasRenderingContext2D, timeStamp: number): void
    {
        if (this.texture) {
            this.texture.draw(ctx, timeStamp, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        }
    }

    public setTexture(texture: IDrawable|null)
    {
        this.texture = texture;
    }

    public setRect(rect: Rect)
    {
        this.rect = rect;
    }

    public getRect(): Rect
    {
        return this.rect;
    }

    public hit(x: number, y: number): Actor|null
    {
        if (this.rect.contains(x, y)) {
            return this;
        }

        return null;
    }

    public onMouseClick(x: number, y: number): void
    {
        // onMouseMove
    }

    public onMouseMove(x: number, y: number): void
    {
        // onMouseMove
    }

    public onMouseEnter(x: number, y: number): void
    {
        this.isOnMouse = true;
    }

    public onMouseLeave(): void
    {
        this.isOnMouse = false;
    }
}
