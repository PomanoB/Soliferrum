import {App} from 'game/App';
import {spriteManager} from 'game/SpriteManager';
import {Actor} from 'game/UI/Actor';
import {Group} from 'game/UI/Group';

export class Screen extends Group
{
    protected app: App;

    constructor(app: App)
    {
        super();

        this.app = app;
    }
}
