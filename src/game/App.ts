
import {Game} from 'game/Game';
import {spriteManager} from 'game/SpriteManager';
import {IRenderer} from 'game/UI/IRenderer';
import {Screen} from 'game/UI/Screen';
import {MainScreen} from 'game/UI/Screens/MainScreen';
import {Rect} from 'game/Util/Rect';

import * as forestBg from 'images/environment_forest_alt1.png';
import * as font from 'images/font.png';
import * as ui from 'images/ui.png';

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
        spriteManager.load({
            image: forestBg,
        }, {
            image: ui,
        }, {
            image: font,
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
        this.screen.setRect(this.rect);
    }
}
