import {CacheLoader} from 'game/Util/CacheLoader';

export interface ITextMeasure
{
    width: number;
    height: number;
}

// TODO: max-width
interface IMeasureParams
{
    fontFamiliy: string;
    fontSize: number;
}

class TextMeasurer
{
    private static getParamsCacheKey(measureParams: IMeasureParams): string
    {
        return `${measureParams.fontFamiliy}|${measureParams.fontSize}`;
    }

    private cache: CacheLoader<string, ITextMeasure> = new CacheLoader();
    private measureContainer: HTMLSpanElement|null = null;

    public mesure(text: string, measureParams: IMeasureParams): ITextMeasure
    {
        return this.cache.get(TextMeasurer.getParamsCacheKey(measureParams), () =>
        {
            this.setMeasureParams(measureParams);
            const container = this.getMeasureContainer();

            return {
                width: container.offsetWidth,
                height: container.offsetHeight,
            };
        });
    }

    private getMeasureContainer(): HTMLSpanElement
    {
        if (!this.measureContainer)
        {
            this.measureContainer = document.createElement('span');
            const style = this.measureContainer.style;
            style.position = 'absolute';
            style.top = '-1000px';
            style.padding = '0';
            style.margin = '0';
            document.body.appendChild(this.measureContainer);
        }

        return this.measureContainer;
    }

    private setMeasureParams(measureParams: IMeasureParams): void
    {
        const style = this.getMeasureContainer().style;
        style.fontFamily = measureParams.fontFamiliy;
        style.fontSize = measureParams.fontSize + 'pt';
    }
}

export const textMeasurer = new TextMeasurer();
