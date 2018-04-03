import {cursorService, CursorState} from 'game/cursorService';
import {NinePathSprites} from 'game/ISpriteManager';
import {spriteManager} from 'game/SpriteManager';
import {Actor} from 'game/UI/Actor';
import {IDrawable} from 'game/UI/IDrawable';
import {NinePath} from 'game/UI/NinePath';
import {Text} from 'game/UI/Text';
import {Rect} from 'game/Util/Rect';

import * as ui from 'images/ui.png';

const kTextPadding = [13, 35, 13, 35];
const kDefaultButtonHeight = 46;

export class Button extends Actor
{
    protected texture: IDrawable;

    private text: Text;
    private hoverTexture: IDrawable;

    constructor(title: string, x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        super();

        this.setRect(new Rect(x, y, width, height || kDefaultButtonHeight));

        this.text = new Text(title.toUpperCase());
        this.texture = spriteManager.getNinePath(NinePathSprites.ButtonNormal);
        this.hoverTexture = spriteManager.getNinePath(NinePathSprites.ButtonHover);
    }

    public draw(ctx: CanvasRenderingContext2D, timeStamp: number): void
    {
        if (this.isOnMouse)
            this.hoverTexture.draw(ctx, timeStamp, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        else
            this.texture.draw(ctx, timeStamp, this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        this.text.draw(ctx, timeStamp,
            this.rect.x + kTextPadding[3], this.rect.y + kTextPadding[0],
            this.rect.width - kTextPadding[1] - kTextPadding[3], this.rect.height - kTextPadding[0] - kTextPadding[2]);
    }

    public onMouseEnter(x: number, y: number): void
    {
        super.onMouseEnter(x, y);

        cursorService.setState(CursorState.Hover);
    }

    public onMouseLeave(): void
    {
        super.onMouseLeave();

        cursorService.setState(CursorState.Normal);
    }

    public onMouseClick(x: number, y: number): void
    {
        this.emit('click');
    }
}
