

export type SelfOrList<Item> = Item | Array<Item>
export type SelfOrCreator<Item> = Item | (() => Item)

export type RecordOrArray<Key extends string | number, Item> = Record<Key, Item> | Array<Item>