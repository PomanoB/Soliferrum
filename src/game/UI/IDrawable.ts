import {Rect} from 'game/Util/Rect';

export interface IDrawable
{
    draw(ctx: CanvasRenderingContext2D, timeStamp: number, rect: Rect): void;
}
