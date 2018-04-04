import {Sprite} from 'game/UI/Sprite';
import {SpritePattern} from 'game/UI/SpritePattern';
import {Rect} from 'game/Util/Rect';

/**
 * По-факту, пока он не "Nine" :(
 */
export class NinePath extends Sprite
{
    private topLeft: Sprite;
    private topCenter: SpritePattern;
    private topRight: Sprite;

    private middleLeft: SpritePattern;
    private middleCenter: SpritePattern;
    private middleRight: SpritePattern;

    private bottomLeft: Sprite;
    private bottomCenter: SpritePattern;
    private bottomRight: Sprite;

    private top: number;
    private right: number;
    private bottom: number;
    private left: number;

    private contentTop: number;
    private contentRight: number;
    private contentBottom: number;
    private contentLeft: number;

    constructor(
        sprite: Sprite,
        top: number, right: number, bottom: number, left: number,
        contentTop: number = top, contentRight: number = right,
        contentBottom: number = bottom, contentLeft: number = left)
    {
        const spriteRect = sprite.getRect();
        const spriteImg = sprite.getImage();
        super(sprite.getImage(), spriteRect.x, spriteRect.y, spriteRect.width, spriteRect.height);

        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;

        this.contentTop = contentTop;
        this.contentRight = contentRight;
        this.contentBottom = contentBottom;
        this.contentLeft = contentLeft;

        const leftPos = spriteRect.x + left;
        const rightPos = spriteRect.x + spriteRect.width - right;
        const topPos = spriteRect.y + top;
        const centerWidth = spriteRect.width - left - right;
        const centerHeight = spriteRect.height - top - bottom;
        const bottomPos = spriteRect.y + spriteRect.height - bottom;

        this.topLeft = new Sprite(spriteImg, spriteRect.x, spriteRect.y, left, top);
        this.topCenter = new SpritePattern(new Sprite(spriteImg, leftPos, spriteRect.y, centerWidth, top));
        this.topRight = new Sprite(spriteImg, rightPos, spriteRect.y, right, top);

        this.middleLeft = new SpritePattern(new Sprite(spriteImg, spriteRect.x, topPos, left, centerHeight));
        this.middleCenter = new SpritePattern(new Sprite(spriteImg, leftPos, topPos, centerWidth, centerHeight));
        this.middleRight = new SpritePattern(new Sprite(spriteImg, rightPos, topPos, right, centerHeight));

        this.bottomLeft = new Sprite(spriteImg, spriteRect.x, bottomPos, left, bottom);
        this.bottomCenter = new SpritePattern(new Sprite(spriteImg, leftPos, bottomPos, centerWidth, bottom));
        this.bottomRight = new Sprite(spriteImg, rightPos, bottomPos, right, bottom);
    }

    public draw(
        ctx: CanvasRenderingContext2D, timeStamp: number,
        x: number, y: number,
        width: number, height: number): void
    {
        const top = this.top;
        const right = this.right;
        const bottom = this.bottom;
        const left = this.left;

        const leftPos = x + left;
        const rightPos = x + width - right;
        const topPos = y + top;
        const centerWidth = width - left - right;
        const centerHeight = height - top - bottom;
        const bottomPos = y + height - bottom;

        this.topLeft.draw(ctx, timeStamp, x, y, left, top);
        this.topCenter.draw(ctx, timeStamp, leftPos, y, centerWidth, top);
        this.topRight.draw(ctx, timeStamp, rightPos, y, right, top);

        this.middleLeft.draw(ctx, timeStamp, x, topPos, left, centerHeight);
        this.middleCenter.draw(ctx, timeStamp, leftPos, topPos, centerWidth, centerHeight);
        this.middleRight.draw(ctx, timeStamp, rightPos, topPos, right, centerHeight);

        this.bottomLeft.draw(ctx, timeStamp, x, bottomPos, left, bottom);
        this.bottomCenter.draw(ctx, timeStamp, leftPos, bottomPos, centerWidth, bottom);
        this.bottomRight.draw(ctx, timeStamp, rightPos, bottomPos, right, bottom);
    }

    public getContentPaddings(): [number, number, number, number]
    {
        return [this.contentTop, this.contentRight, this.contentBottom, this.contentLeft];
    }
}
