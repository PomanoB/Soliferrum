import {ISpriteDescr, ISpriteManager} from 'game/ISpriteManager';
import {Sprite} from 'game/UI/Sprite';
import {CacheLoader} from 'game/Util/CacheLoader';
import {getTempContext} from 'game/Util/tempContext';

class SpriteManager implements ISpriteManager
{
    private images: Map<string, HTMLImageElement> = new Map();
    private loadingCache: CacheLoader<string, Promise<HTMLImageElement>> = new CacheLoader();

    public load(...descr: ISpriteDescr[]): Promise<void>
    {
        return Promise.all(descr.map((sprite) =>
        {
            return this.loadingCache.get(sprite.image, () => this.loadImage(sprite.image));
        })).then((images) =>
        {
            for (let i = 0; i < images.length; i++)
            {
                if (!this.images.has(descr[i].image)) {
                    this.images.set(descr[i].image, images[i]);
                }
            }
        });
    }

    public getSprite(imageOrDescr: string|ISpriteDescr): Sprite
    {
        const descr: ISpriteDescr = typeof imageOrDescr === 'string' ? {image: imageOrDescr} : imageOrDescr;
        const image = this.images.get(descr.image);
        if (!image) {
            throw new Error('Image not loaded!');
        }

        return new Sprite(image, descr.x, descr.y, descr.width, descr.height);
    }

    public getSpriteUrl(sprite: Sprite): string
    {
        const rect = sprite.getRect();
        const {ctx, canvas} = getTempContext(rect.width, rect.height);
        ctx.clearRect(0, 0, rect.width, rect.height);
        sprite.draw(ctx, 0, 0, 0, rect.width, rect.height);

        return canvas.toDataURL('image/png');
    }

    private loadImage(url: string): Promise<HTMLImageElement>
    {
        return new Promise((resolve, reject) =>
        {
            const image = new Image();
            image.onload = () => { resolve(image); };
            image.onerror = (e) => { reject(e); };
            image.src = url;
        });
    }
}

export const spriteManager: ISpriteManager = new SpriteManager();
