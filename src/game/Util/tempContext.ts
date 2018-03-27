
let tempCanvas: HTMLCanvasElement|null = null;

function getTempCanvas(): HTMLCanvasElement
{
    if (tempCanvas === null)
    {
        tempCanvas = document.createElement('canvas');
    }

    return tempCanvas;
}

export interface ITempCanvasContext
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}
export function getTempContext(width: number, height: number): ITempCanvasContext
{
    const canvas = getTempCanvas();
    canvas.width = width;
    canvas.height = height;

    return {
        canvas,
        ctx: canvas.getContext('2d') as CanvasRenderingContext2D,
    };
}
