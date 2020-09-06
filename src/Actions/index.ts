import { Game } from '../Game';
import { Unit } from '../Unit';
import { Resource } from '../Resource';

/**
 * Internal representations of agent sent actions. All actions must be validated prior to construction
 */
export abstract class Action {
  constructor(public action: Game.ACTIONS, public team: Unit.TEAM) {}
}

export class MoveAction extends Action {
  constructor(
    action: Game.ACTIONS,
    team: Unit.TEAM,
    public unitid: string,
    public direction: Game.DIRECTIONS
  ) {
    super(action, team);
  }
}

export abstract class SpawnAction extends Action {
  abstract type: Unit.Type;
  constructor(
    action: Game.ACTIONS,
    team: Unit.TEAM,
    public x: number,
    public y: number
  ) {
    super(action, team);
  }
}

export class SpawnCartAction extends SpawnAction {
  public type = Unit.Type.CART;
  constructor(action: Game.ACTIONS, team: Unit.TEAM, x: number, y: number) {
    super(action, team, x, y);
  }
}

export class SpawnWorkerAction extends SpawnAction {
  public type = Unit.Type.WORKER;
  constructor(action: Game.ACTIONS, team: Unit.TEAM, x: number, y: number) {
    super(action, team, x, y);
  }
}

export class SpawnCityAction extends Action {
  constructor(action: Game.ACTIONS, team: Unit.TEAM, public unitid: string) {
    super(action, team);
  }
}

export class TransferAction extends Action {
  constructor(
    action: Game.ACTIONS,
    team: Unit.TEAM,
    public srcID: string,
    public destID: string,
    public resourceType: Resource.Types,
    public amount: number
  ) {
    super(action, team);
  }
}

export class ResearchAction extends Action {
  constructor(
    action: Game.ACTIONS,
    team: Unit.TEAM,
    public x: number,
    public y: number
  ) {
    super(action, team);
  }
}
