
import {IRenderer} from 'game/UI/IRenderer';
import {Game} from 'game/Game';

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