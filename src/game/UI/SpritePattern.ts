import {IDrawable} from 'game/UI/IDrawable';
import {Sprite} from 'game/UI/Sprite';
import {Text} from 'game/UI/Text';
import {Rect} from 'game/Util/Rect';

export class SpritePattern implements IDrawable
{
    private pattern: CanvasPattern;

    constructor(sprite: Sprite)
    {
        const patternCanvas = document.createElement('canvas');
        const rect = sprite.getRect();
        patternCanvas.width = rect.width;
        patternCanvas.height = rect.height;

        const ctx = patternCanvas.getContext('2d') as CanvasRenderingContext2D;
        sprite.draw(ctx, 0, 0, 0, rect.width, rect.height);

        this.pattern = ctx.createPattern(patternCanvas, 'repeat');
    }

    public draw(
        ctx: CanvasRenderingContext2D, timeStamp: number,
        x: number, y: number,
        width: number, height: number): void
    {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = this.pattern;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }
}
