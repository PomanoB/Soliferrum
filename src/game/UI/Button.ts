import {cursorService, CursorState} from 'game/cursorService';
import {NinePathSprites} from 'game/ISpriteManager';
import {spriteManager} from 'game/SpriteManager';
import {Actor} from 'game/UI/Actor';
import {IDrawable} from 'game/UI/IDrawable';
import {NinePath} from 'game/UI/NinePath';
import {Text} from 'game/UI/Text';
import {Rect} from 'game/Util/Rect';

import * as ui from 'images/ui.png';

const kDefaultButtonHeight = 46;

export class Button extends Actor
{
    protected texture: IDrawable;

    private text: Text;
    private hoverTexture: IDrawable;
    private paddings: [number, number, number, number];

    constructor(title: string, x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        super();

        this.setRect(new Rect(x, y, width, height || kDefaultButtonHeight));

        this.text = new Text(title.toUpperCase());
        const texture = spriteManager.getNinePath(NinePathSprites.ButtonNormal);
        this.paddings = texture.getContentPaddings();
        this.texture = texture;
        this.hoverTexture = spriteManager.getNinePath(NinePathSprites.ButtonHover);
    }

    public draw(ctx: CanvasRenderingContext2D, timeStamp: number): void
    {
        if (this.isOnMouse)
            this.hoverTexture.draw(ctx, timeStamp, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        else
            this.texture.draw(ctx, timeStamp, this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        this.text.draw(ctx, timeStamp,
            this.rect.x + this.paddings[3],
            this.rect.y + this.paddings[0],
            this.rect.width - this.paddings[1] - this.paddings[3],
            this.rect.height - this.paddings[0] - this.paddings[2]);
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
