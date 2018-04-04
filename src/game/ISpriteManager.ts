import {Images} from 'game/resources';
import {NinePath} from 'game/UI/NinePath';
import {Sprite} from 'game/UI/Sprite';

export enum Sprites
{
}

export enum NinePathSprites
{
    ButtonNormal,
    ButtonHover,
}

export interface ISpriteManager
{
    getSprite(sprite: Sprites): Sprite;
    getNinePath(sprite: NinePathSprites): NinePath;
}

export interface ISpriteDescr
{
    readonly image: Images;
    readonly x?: number;
    readonly y?: number;
    readonly width?: number;
    readonly height?: number;
}
export interface INinePathSpriteDescr extends ISpriteDescr
{
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
}
