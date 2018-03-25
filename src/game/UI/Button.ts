import {spriteManager} from 'game/SpriteManager';
import {Actor} from 'game/UI/Actor';
import {NinePatch} from 'game/UI/NinePatch';
import {Text} from 'game/UI/Text';
import {Rect} from 'game/Util/Rect';

import * as ui from 'images/ui.png';

const kTextPadding = [13, 35, 13, 35];

export class Button extends Actor
{
    private text: Text;

    constructor(title: string)
    {
        super();

        this.text = new Text(title.toUpperCase());
        this.texture = new NinePatch(spriteManager.getSprite({
            image: ui,
            x: 1,
            y: 97,
            width: 71,
            height: 46,
        }), 23, 34, 22, 34);

        this.setRect(new Rect(10, 10, 200, 46));
    }

    public draw(ctx: CanvasRenderingContext2D, timeStamp: number): void
    {
        super.draw(ctx, timeStamp);

        this.text.draw(ctx, timeStamp,
            this.rect.x + kTextPadding[3], this.rect.y + kTextPadding[0],
            this.rect.width - kTextPadding[1] - kTextPadding[3], this.rect.height - kTextPadding[0] - kTextPadding[2]);
    }
}
