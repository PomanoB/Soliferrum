
import * as cursor from 'images/AnimCursor.png';

export enum CursorState
{
    Normal,
    Hover,
    Pressed,
}

export interface ICursorService
{
    setState(state: CursorState): void;
}

class CursorService implements ICursorService
{
    private static styles: string[] = [
        'default',
        'pointer',
        'pointer',
    ];

    private state: CursorState = CursorState.Normal;

    public setState(state: CursorState): void
    {
        this.state = state;
        document.body.style.cursor = CursorService.styles[this.state];
    }
}

export const cursorService: ICursorService = new CursorService();
