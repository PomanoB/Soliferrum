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

    public onMouseMove(x: number, y: number): void
    {
        super.onMouseMove(x, y);

        this.calcActor(x, y, (act, actX, actY) => act.onMouseMove(actX, actY));
    }

    public onMouseEnter(x: number, y: number): void
    {
        super.onMouseEnter(x, y);

        this.calcActor(x, y, (act, actX, actY) => act.onMouseEnter(actX, actY));
    }

    public onMouseLeave(x: number, y: number): void
    {
        super.onMouseClick(x, y);

        this.calcActor(x, y, (act, actX, actY) => act.onMouseLeave(actX, actY));
    }

    public onMouseClick(x: number, y: number): void
    {
        super.onMouseClick(x, y);

        this.calcActor(x, y, (act, actX, actY) => act.onMouseClick(actX, actY));
    }

    private calcActor(x: number, y: number, func: (actor: Actor, x: number, y: number) => void): void
    {
        const actor = this.hit(x, y);
        if (!actor)
            return;

        const rect = actor.getRect();
        func(actor, x - rect.x, y - rect.y);
    }
}
