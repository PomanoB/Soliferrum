import {NinePathSprites} from 'game/ISpriteManager';
import {spriteManager} from 'game/SpriteManager';
import {Actor} from 'game/UI/Actor';
import {Text} from 'game/UI/Text';
import {Rect} from 'game/Util/Rect';

export class TextBox extends Actor
{
    private text: string;
    private textSprite: Text;
    private paddings: [number, number, number, number];

    constructor(text: string, rect: Rect)
    {
        super();

        this.text = text;
        this.textSprite = new Text(text);

        const texture = spriteManager.getNinePath(NinePathSprites.TextBox);
        this.paddings = texture.getContentPaddings();

        this.setRect(rect);
        this.setTexture(texture);
    }

    public draw(ctx: CanvasRenderingContext2D, timeStamp: number): void
    {
        this.texture!.draw(ctx, timeStamp, this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        this.textSprite.draw(ctx, timeStamp,
            this.rect.x + this.paddings[3],
            this.rect.y + this.paddings[0],
            this.rect.width - this.paddings[1] - this.paddings[3],
            this.rect.height - this.paddings[0] - this.paddings[2]);
    }
}
