
import {IRenderer} from 'game/UI/IRenderer';

export class CanvasRenderer implements IRenderer
{
    private canvas: HTMLCanvasElement;

    private width: number;
    private height: number;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;

        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    public draw(timeStamp: number)
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillText(timeStamp.toFixed(2), 0, 0);
    }
}