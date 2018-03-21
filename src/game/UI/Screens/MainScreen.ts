import {spriteManager} from 'game/SpriteManager';
import {NinePatch} from 'game/UI/NinePatch';
import {Screen} from 'game/UI/Screen';
import {Sprite} from 'game/UI/Sprite';
import {SpritePattern} from 'game/UI/SpritePattern';

import * as forestBg from 'images/environment_forest_alt1.png';
import * as ui from 'images/ui.png';

export class MainScreen extends Screen
{
    constructor()
    {
        super();

        const texture = new NinePatch(spriteManager.getSprite({
            image: ui,
            x: 0,
            y: 491,
            width: 21,
            height: 21,
        }), 9, 9, 9, 9);
        this.setTexture(texture);
    }
}
