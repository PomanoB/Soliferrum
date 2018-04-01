import {App} from 'game/App';
import {Button} from 'game/UI/Button';
import {Screen} from 'game/UI/Screen';
import {MainScreen} from 'game/UI/Screens/MainScreen';

export class OptionsScreen extends Screen
{
    constructor(app: App)
    {
        super(app);

        this.addChild(new Button('OPTIONS', 20, 20, 200));

        const btnBack = new Button('BACK', 20, 80, 200);
        btnBack.on('click', () =>
        {
            this.app.setScreen(new MainScreen(this.app));
        });
        this.addChild(btnBack);
    }
}
