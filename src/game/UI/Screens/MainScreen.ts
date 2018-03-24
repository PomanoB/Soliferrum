import {spriteManager} from 'game/SpriteManager';
import {Button} from 'game/UI/Button';
import {NinePatch} from 'game/UI/NinePatch';
import {Screen} from 'game/UI/Screen';
import {Sprite} from 'game/UI/Sprite';
import {SpritePattern} from 'game/UI/SpritePattern';
import {Text} from 'game/UI/Text';

import * as forestBg from 'images/environment_forest_alt1.png';
import * as ui from 'images/ui.png';

export class MainScreen extends Screen
{
    constructor()
    {
        super();

        this.addChild(new Button('New Game'));
    }
}
