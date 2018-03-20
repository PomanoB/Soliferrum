import {spriteManager} from 'game/SpriteManager';
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

        const pattern = new SpritePattern(spriteManager.getSprite({
            image: ui,
            x: 296,
            y: 382,
            width: 12,
            height: 20,
        }));
        this.setTexture(pattern);
    }
}
