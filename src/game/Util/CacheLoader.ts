
export class CacheLoader<K, V>
{
    private cache: Map<K, V> = new Map();

    public get(key: K, loader: () => V): V
    {
        if (this.cache.has(key)) {
            return this.cache.get(key) as V;
        }

        const value = loader();
        this.cache.set(key, value);

        return value;
    }
}
