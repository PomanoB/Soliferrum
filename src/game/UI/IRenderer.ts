import {Screen} from 'game/UI/Screen';

export interface IRenderer
{
    draw(timeStamp: number, screen: Screen): void;
}
