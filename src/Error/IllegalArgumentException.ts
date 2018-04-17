
declare class Object
{
    public static setPrototypeOf(obj: object, proto: object): void;
}

export class IllegalArgumentException extends Error
{
    constructor(message: string = '')
    {
        super(message);

        Object.setPrototypeOf(this,  new.target.prototype);
    }
}
