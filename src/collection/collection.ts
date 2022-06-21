import { ObjectKeys, ObjectEntries } from "../object/object";

export class Collection<K extends PropertyKey, I> {
  private _items: Record<K, I>;

  public constructor(public keyGenerator?: (item: I) => K) {
    this._items = {} as Record<K, I>;
  }

  public add(item: I): K {
    if (this.keyGenerator === undefined) {
      throw "No key generator specified. Specify one in the construction of this Collection or provide the keys manually with the set() function.";
    }
    const key = this.keyGenerator(item);
    this._items[key] = item;
    return key;
  }

  public set(key: K, item: I): void {
    this._items[key] = item;
  }

  public get(key: K): I | null {
    if (this._items[key]) {
      return this._items[key];
    }
    return null;
  }

  public delete(key: K): I | null {
    const item = this._items[key];
    if (item) {
      delete this._items[key];
      return item;
    }
    return null;
  }

  public clear(): void {
    this._items = {} as Record<K, I>;
  }

  public keyOf(item: I): K | null {
    return this.entries().find(([_key, _item]) => _item === item)?.[0] ?? null;
  }

  public keys(): K[] {
    return ObjectKeys(this._items);
  }

  public items(): I[] {
    return Object.values(this._items);
  }

  public entries(): [K, I][] {
    return ObjectEntries(this._items);
  }

  public forEach(func: (item: I) => void): void {
    this.items().forEach(func);
  }

  public forEachKey(func: (key: K) => void): void {
    this.keys().forEach(func);
  }

  public forEachEntry(func: (entry: [K, I], index: number) => void): void {
    this.entries().forEach(func);
  }

  public map<T>(func: (item: I) => T): Collection<K, T> {
    const mappedCollection = new Collection<K, T>();
    this.forEachEntry(([key, item]) => {
      mappedCollection.set(key, func(item));
    });
    return mappedCollection;
  }

  public find(func: (item: I) => boolean): I | null {
    return this.items().find(func) ?? null;
  }

  public filter(func: (item: I, index: number) => boolean): Collection<K, I> {
    const filteredCollection = new Collection<K, I>(this.keyGenerator);
    this.forEachEntry(([key, item], index) => {
      if (func(item, index)) {
        filteredCollection.set(key, item);
      }
    });
    return filteredCollection;
  }

  public reduce(
    func: (value: I, item: I, index: number, items: I[]) => I,
    startValue?: I
  ): I;

  public reduce<T>(
    func: (value: T, item: I, index: number, items: I[]) => T,
    startValue: T
  ): T;

  public reduce<T>(
    func: (value: T, item: I, index: number, items: I[]) => T,
    startValue: T | undefined
  ): T {
    if (startValue !== undefined) {
      return this.items().reduce(func, startValue);
    } else {
      startValue = this.items()[0] as unknown as T;
      return this.items()
        .filter((_, index) => index !== 0) // Quatsch
        .reduce(func, startValue);
    }
  }
}
