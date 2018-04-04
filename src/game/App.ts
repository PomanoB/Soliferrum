import {IllegalStateException} from 'Error/IllegalStateException';
import {loadResources} from 'game/resources';
import {IRenderer} from 'game/UI/IRenderer';
import {Screen} from 'game/UI/Screen';
import {MainScreen} from 'game/UI/Screens/MainScreen';
import {Rect} from 'game/Util/Rect';

export class App
{
    private renderer: IRenderer;
    private screen: Screen|null = null;
    private rect: Rect;

    constructor(renderer: IRenderer, width: number, height: number)
    {
        this.renderer = renderer;
        this.rect = new Rect(0, 0, width, height);
    }

    public start()
    {
        loadResources().then(() =>
        {
            this.setScreen(new MainScreen(this));
            requestAnimationFrame(this.draw);
        });
    }

    public onMouseMove(x: number, y: number): void
    {
        this.getScreen().onMouseMove(x, y);
    }

    public onMouseEnter(x: number, y: number): void
    {
        this.getScreen().onMouseEnter(x, y);
    }

    public onMouseLeave(x: number, y: number): void
    {
        this.getScreen().onMouseLeave();
    }

    public onMouseClick(x: number, y: number): void
    {
        this.getScreen().onMouseClick(x, y);
    }

    public isLoaded(): boolean
    {
        return this.screen !== null;
    }

    public setScreen(screen: Screen): void
    {
        this.screen = screen;
        this.screen.setRect(this.rect);
    }

    public getScreen(): Screen
    {
        if (!this.screen)
            throw new IllegalStateException('U need to set Screen before!');

        return this.screen;
    }

    private draw = (timeStamp: number) =>
    {
        if (this.screen)
            this.renderer.draw(timeStamp, this.screen);

        requestAnimationFrame(this.draw);
    }
}
