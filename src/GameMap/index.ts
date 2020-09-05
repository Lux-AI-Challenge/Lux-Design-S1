import { Cell } from './cell';

export class GameMap {
  public map: Array<Array<Cell>>;
  constructor(public width: number, public height: number) {}
}
export namespace GameMap {
  export interface Configs {
    width: number;
    height: number;
  }
}
