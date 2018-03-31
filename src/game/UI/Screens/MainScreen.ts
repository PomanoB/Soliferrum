import {Button} from 'game/UI/Button';
import {Screen} from 'game/UI/Screen';

export class MainScreen extends Screen
{
    constructor()
    {
        super();

        this.addChild(new Button('New GameNew GameNew GameNew GameNew GameNew Game'));
    }
}
