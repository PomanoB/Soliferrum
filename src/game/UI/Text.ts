import {getImageResource, Images} from 'game/resources';
import {spriteManager} from 'game/SpriteManager';
import {fontData} from 'game/UI/fontData';
import {IDrawable} from 'game/UI/IDrawable';
import {Sprite} from 'game/UI/Sprite';

export enum TextWrap
{
    NoBreak,
    BreakWord,
    BreakAll,
}

export class Text implements IDrawable
{
    private wordWidths: number[];
    private wordIndex: number[];
    private sprites: Sprite[] = [];
    private textWrap: TextWrap = TextWrap.BreakWord;

    constructor(text: string)
    {
        this.wordWidths = [];
        this.wordIndex = [];

        const sprites: Sprite[] = [];

        let curWidth = 0;
        let char: string = '';
        for (char of text)
        {
            const data = fontData[char];
            if (!data)
                continue;

            const charSprite = new Sprite(getImageResource(Images.Font), data[0], data[1], data[2], data[3]);

            this.wordIndex.push(this.wordWidths.length);
            if (char === ' ')
            {
                this.wordWidths.push(curWidth);
                curWidth = 0;
            }
            curWidth += charSprite.getRect().width;

            sprites.push(charSprite);
        }
        if (char !== ' ')
            this.wordWidths.push(curWidth);

        this.wordWidths.push(sprites.length);
        this.sprites = sprites;
    }

    public getTextWrap(): TextWrap
    {
        return this.textWrap;
    }

    public setTextWrap(textWrap: TextWrap): void
    {
        this.textWrap = textWrap;
    }

    public draw(
        ctx: CanvasRenderingContext2D, timeStamp: number,
        x: number, y: number, width: number, height: number): void
    {
        let curX = x;
        let curY = y;
        let wordStart = curX;
        let curWord = 0;

        const textWrap = this.textWrap;
        for (let i = 0; i < this.sprites.length; i++)
        {
            const char = this.sprites[i];
            const rect = char.getRect();

            if (textWrap === TextWrap.BreakWord && curWord !== this.wordIndex[i])
            {
                curWord = this.wordIndex[i];
                if (curX + this.wordWidths[curWord] >= x + width)
                {
                    curX = x;
                    curY += rect.height;
                }
                wordStart = curX;
            }

            if (textWrap === TextWrap.BreakAll && curX + rect.width >= x + width)
            {
                curX = x;
                curY += rect.height;
            }

            if (curX + rect.width >= x + width || curY + rect.height >= y + height)
                break;

            char.draw(ctx, timeStamp, curX, curY, rect.width, rect.height);
            curX += rect.width;
        }
    }
}
