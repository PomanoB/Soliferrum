
export interface IStyle
{
    fontFamily: string;
    fontSize: number;
}

export function getGameStyle(): IStyle
{
    return {
        fontFamily: 'Arial',
        fontSize: 10,
    };
}
