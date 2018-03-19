import {Sprite} from 'game/UI/Sprite';

export interface ISpriteDescr
{
    readonly image: string;
    readonly x?: number;
    readonly y?: number;
    readonly width?: number;
    readonly height?: number;
}

export interface ISpriteManager
{
    load(...descr: ISpriteDescr[]): Promise<void>;
    getSprite(descr: ISpriteDescr|string): Sprite;
}
