import {App} from 'game/App';
import {Button} from 'game/UI/Button';
import {Screen} from 'game/UI/Screen';
import {OptionsScreen} from 'game/UI/Screens/OptionsScreen';
import {TextBox} from 'game/UI/TextBox';
import {Rect} from 'game/Util/Rect';

export class MainScreen extends Screen
{
    constructor(app: App)
    {
        super(app);

        this.addChild(new Button('New Game', 20, 20, 200));

        const optButton = new Button('Options', 20, 80, 200);
        optButton.on('click', () =>
        {
            this.app.setScreen(new OptionsScreen(this.app));
        });
        this.addChild(optButton);

        this.addChild(new TextBox('This is Text', new Rect(20, 200, 300, 300)));
    }
}
