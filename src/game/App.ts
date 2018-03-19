
import {Game} from 'game/Game';
import {spriteManager} from 'game/SpriteManager';
import {IRenderer} from 'game/UI/IRenderer';
import {Screen} from 'game/UI/Screen';
import {MainScreen} from 'game/UI/Screens/MainScreen';

import * as forestBg from 'images/environment_forest_alt1.png';

export class App
{
    private renderer: IRenderer;
    private screen: Screen|null = null;
    private width: number;
    private height: number;

    constructor(renderer: IRenderer, width: number, height: number)
    {
        this.renderer = renderer;
        this.width = width;
        this.height = height;
    }

    public start()
    {
        spriteManager.load({
            image: forestBg,
        }).then(() =>
        {
            this.setScreen(new MainScreen());
            requestAnimationFrame(this.draw);
        });
    }

    private draw = (timeStamp: number) =>
    {
        if (this.screen)
        {
            this.renderer.draw(timeStamp, this.screen);
            requestAnimationFrame(this.draw);
        }
    }

    private setScreen(screen: Screen): void
    {
        this.screen = screen;
    }
}
