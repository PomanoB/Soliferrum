
import {App} from 'game/App';
import {CanvasRenderer} from 'game/UI/CanvasRenderer';
import * as React from 'react';

const kFieldWidth = 607;
const kFieldHeight = 600;

export class Game extends React.PureComponent
{
    private canvas: HTMLCanvasElement|null = null;
    private app: App|null = null;

    private onMouseLeave = this.withCoord((app, x, y) => app.onMouseLeave(x, y));
    private onMouseEnter = this.withCoord((app, x, y) => app.onMouseEnter(x, y));
    private onMouseMove = this.withCoord((app, x, y) => app.onMouseMove(x, y));
    private onMouseClick = this.withCoord((app, x, y) => app.onMouseClick(x, y));

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
        return <canvas
            width={kFieldWidth}
            height={kFieldHeight}
            ref={(el) => { this.canvas = el; } }
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onMouseClick}
            onMouseMove={this.onMouseMove}
        />;
    }

    private withCoord(
        func: (app: App, x: number, y: number) => void): (event: React.MouseEvent<HTMLCanvasElement>) => void
    {
        return (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!this.canvas || !this.app)
                return;

            const canvasRect = this.canvas.getBoundingClientRect();
            func(this.app, event.clientX - canvasRect.left, event.clientY - canvasRect.top);
        };
    }
}
