import { Unit } from '.';
import { LuxMatchConfigs } from '../types';

export class Cart extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.CART, team, configs);
  }
}
