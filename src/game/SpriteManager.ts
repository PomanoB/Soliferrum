import {INinePathSpriteDescr, ISpriteDescr, ISpriteManager, NinePathSprites, Sprites} from 'game/ISpriteManager';
import {getImageResource, Images} from 'game/resources';
import {fontData} from 'game/UI/fontData';
import {IDrawable} from 'game/UI/IDrawable';
import {NinePath} from 'game/UI/NinePath';
import {Sprite} from 'game/UI/Sprite';
import {CacheLoader} from 'game/Util/CacheLoader';

const kNinePathSpritesData: INinePathSpriteDescr[] = [];
kNinePathSpritesData[NinePathSprites.ButtonNormal] = {
    image: Images.UI,
    x: 1,
    y: 97,
    width: 71,
    height: 46,
    top: 23,
    right: 34,
    bottom: 22,
    left: 34,
} as INinePathSpriteDescr;
kNinePathSpritesData[NinePathSprites.ButtonHover] = {
    image: Images.UI,
    x: 1,
    y: 49,
    width: 71,
    height: 46,
    top: 23,
    right: 34,
    bottom: 22,
    left: 34,
} as INinePathSpriteDescr;
const kSpritesData: ISpriteDescr[] = [];

class SpriteManager implements ISpriteManager
{
    public getSprite(sprite: Sprites): Sprite
    {
        const descr = kSpritesData[sprite];

        return new Sprite(getImageResource(descr.image), descr.x, descr.y, descr.width, descr.height);
    }

    public getNinePath(sprite: NinePathSprites): NinePath
    {
        const descr = kNinePathSpritesData[sprite];
        const normalSprite = new Sprite(getImageResource(descr.image), descr.x, descr.y, descr.width, descr.height);

        return new NinePath(normalSprite, descr.top, descr.right, descr.bottom, descr.left);
    }
}

export const spriteManager: ISpriteManager = new SpriteManager();
