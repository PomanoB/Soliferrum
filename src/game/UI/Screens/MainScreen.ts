import {spriteManager} from 'game/SpriteManager';
import {Screen} from 'game/UI/Screen';

import * as forestBg from 'images/environment_forest_alt1.png';

export class MainScreen extends Screen
{
    constructor()
    {
        super();

        const sprite = spriteManager.getSprite(forestBg);
        this.setTexture(sprite);
        this.setRect(sprite.getRect());
    }
}
