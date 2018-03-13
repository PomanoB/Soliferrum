
import {IRenderer} from 'game/UI/IRenderer';

export class App
{
    private renderer: IRenderer;

    constructor(renderer: IRenderer)
    {
        this.renderer = renderer;
    }

    public start()
    {
        requestAnimationFrame(this.draw);
    }

    private draw = (timeStamp: number) =>
    {
        this.renderer.draw(timeStamp);

        requestAnimationFrame(this.draw);
    }
}