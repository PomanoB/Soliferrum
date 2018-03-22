import {spriteManager} from 'game/SpriteManager';
import {fontData} from 'game/UI/fontData';
import {IDrawable} from 'game/UI/IDrawable';
import {Sprite} from 'game/UI/Sprite';

import * as font from 'images/font.png';

export class Text implements IDrawable
{
    private text: string;
    private sprites: Sprite[] = [];

    constructor(text: string)
    {
        this.text = text;

        for (const char of this.text)
        {
            const data = fontData[char];
            if (!data)
                continue;

            this.sprites.push(spriteManager.getSprite({
                image: font,
                x: data[0],
                y: data[1],
                width: data[2],
                height: data[3],
            }));
        }
    }

    public draw(
        ctx: CanvasRenderingContext2D, timeStamp: number,
        x: number, y: number, width: number, height: number): void
    {
        let curX = x;
        let curY = y;

        for (const char of this.sprites)
        {
            const rect = char.getRect();
            if (curX + rect.width >= x + width)
            {
                curX = x;
                // TODO!!!!
                curY += rect.height;
                if (curY >= y + height)
                    break;
            }

            char.draw(ctx, timeStamp, curX, curY, rect.width, rect.height);
            curX += rect.width;
        }
    }
}
