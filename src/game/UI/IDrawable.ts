import {Rect} from 'game/Util/Rect';

export interface IDrawable
{
    draw(ctx: CanvasRenderingContext2D, timeStamp: number, x: number, y: number, width: number, height: number): void;
}
