export class Resource {
  constructor(public type: Resource.Types, public amount: number) {}
}

export namespace Resource {
  export enum Types {
    WOOD = 'wood',
    COAL = 'coal',
    URANIUM = 'uranium',
  }
}
