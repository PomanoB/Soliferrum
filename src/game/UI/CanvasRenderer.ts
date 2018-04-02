
import {IRenderer} from 'game/UI/IRenderer';
import {Screen} from 'game/UI/Screen';

const kScreenChangeTime = 1000;

export class CanvasRenderer implements IRenderer
{
    private canvas: HTMLCanvasElement;

    private width: number;
    private height: number;
    private ctx: CanvasRenderingContext2D;

    private screenChangeTime: number = 0;
    private prevScreen: Screen|null = null;

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;

        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public draw(timeStamp: number, screen: Screen)
    {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const screenChanged = this.prevScreen !== screen;
        const isChanging = this.screenChangeTime !== 0 && this.screenChangeTime > timeStamp;
        let offset = 0;
        if (screenChanged)
        {
            if (isChanging)
            {
                offset = (this.screenChangeTime - timeStamp) / kScreenChangeTime;
            }
            else
            {
                if (this.screenChangeTime === 0 && this.prevScreen)
                {
                    this.screenChangeTime = timeStamp + kScreenChangeTime;
                }
                else
                {
                    this.prevScreen = screen;
                    this.screenChangeTime = 0;
                }
            }
        }

        if (offset !== 0 && this.prevScreen)
        {
            this.ctx.save();
            this.ctx.translate(offset * this.width, 0);
            this.prevScreen.draw(this.ctx, timeStamp);
            this.ctx.restore();
            this.ctx.save();
            this.ctx.translate(-(1 - offset) * this.width, 0);
            screen.draw(this.ctx, timeStamp);
            this.ctx.restore();
        }
        else
        {
            screen.draw(this.ctx, timeStamp);
        }
    }
}
