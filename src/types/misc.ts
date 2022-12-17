

export type SelfOrList<Item> = Item | Array<Item>
export type SelfOrCreator<Item> = Item | (() => Item)