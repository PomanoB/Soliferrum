import {Actor} from 'game/UI/Actor';

export class Group extends Actor
{
    private children: Actor[] = [];

    public addChild(child: Actor): void
    {
        this.children.push(child);
    }

    public draw(ctx: CanvasRenderingContext2D, timeStamp: number): void
    {
        super.draw(ctx, timeStamp);

        this.children.forEach((child) =>
        {
            ctx.save();

            const childRect = child.getRect();
            ctx.translate(childRect.x, childRect.y);
            child.draw(ctx, timeStamp);

            ctx.restore();
        });
    }

    public hit(x: number, y: number): Actor|null
    {
        if (!super.hit(x, y)) {
            return null;
        }

        x -= this.rect.x;
        y -= this.rect.y;

        for (const child of this.children)
        {
            const childHit = child.hit(x, y);
            if (childHit !== null)
                return childHit;
        }

        return null;
    }
}
