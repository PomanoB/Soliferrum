import font from 'images/font.png';
import ui from 'images/ui.png';

export enum Images
{
    UI,
    Font,
}

const loadedImages: HTMLImageElement[] = [];

function getImageUrl(img: Images): string
{
    switch (img)
    {
        case Images.UI:
            return ui;
        case Images.Font:
            return font;
    }
}

function loadImage(img: Images): Promise<HTMLImageElement>
{
    return new Promise((resolve, reject) =>
    {
        const image = new Image();
        image.onload = () =>
        {
            loadedImages[img] = image;
            resolve(image);
        };
        image.onerror = (e) => { reject(e); };
        image.src = getImageUrl(img);
    });
}

export function loadResources(): Promise<{}>
{
    return Promise.all([
        loadImage(Images.UI),
        loadImage(Images.Font),
    ]);
}
export function getImageResource(img: Images): HTMLImageElement
{
    return loadedImages[img];
}
