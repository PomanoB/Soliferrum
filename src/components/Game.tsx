
import {App} from 'game/App';
import {CanvasRenderer} from 'game/UI/CanvasRenderer';
import * as React from 'react';

const kFieldWidth = 607;
const kFieldHeight = 600;

export class Game extends React.PureComponent
{
    private canvas: HTMLCanvasElement|null = null;
    private app: App|null = null;

    public componentDidMount()
    {
        if (this.canvas)
        {
            this.app = new App(new CanvasRenderer(this.canvas), kFieldWidth, kFieldHeight);
            this.app.start();
        }
    }

    public render()
    {
        return <canvas width={kFieldWidth} height={kFieldHeight} ref={(el) => { this.canvas = el; } }/>;
    }
}
