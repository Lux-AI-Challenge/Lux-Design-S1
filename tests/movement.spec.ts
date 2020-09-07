import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import { Game } from '../src/Game';
import { GameMap } from '../src/GameMap';
import { MatchWarn } from 'dimensions-ai';
import { fail } from 'assert';

describe('Test movement handling', () => {
  let game: Game;
  beforeEach(() => {
    game = new Game({
      width: 8,
      height: 8,
      mapType: GameMap.Types.EMPTY,
    });
  });
  it('should move units given a move action', () => {
    const w1 = game.spawnWorker(0, 4, 4);
    const action = game.validateCommand({
      agentID: 0,
      command: `m ${w1.id} s`,
    });
    w1.giveAction(action);
    w1.turn(game);
    expect(w1.pos.y).to.equal(5);
    expect(w1.pos.x).to.equal(4);
    expect(game.map.getCell(4, 4).units.size).to.equal(0);
    expect(game.map.getCell(4, 5).units.get(w1.id)).to.equal(w1);
  });
  describe('collison testing', () => {
    it('should remove all actions if all go to the same place', () => {
      // the following units will collide at (4, 5)
      const w1 = game.spawnWorker(0, 4, 4);
      const w2 = game.spawnWorker(0, 4, 6);
      const w3 = game.spawnWorker(0, 5, 5);

      const moveActions: any[] = [
        game.validateCommand({
          agentID: 0,
          command: `m ${w1.id} s`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w2.id} n`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w3.id} w`,
        }),
      ];

      const pruned = game.handleMovementActions(moveActions);
      expect(pruned.length).to.equal(0);
    });

    it('should remove all actions if some go to same place and other units expect the colliding units to move out of the way', () => {
      // the following units will collide at (4, 5)
      const w1 = game.spawnWorker(0, 4, 4);
      const w2 = game.spawnWorker(0, 4, 6);
      const w3 = game.spawnWorker(0, 5, 5);

      // the following units were expect w1 to move, but since it collided, these units will also no longer move
      const w4 = game.spawnWorker(0, 3, 4);
      const w5 = game.spawnWorker(0, 2, 4);

      // this unit should be able to move because it doesn't collide
      const w6 = game.spawnWorker(0, 3, 3);

      const moveActions: any[] = [
        game.validateCommand({
          agentID: 0,
          command: `m ${w1.id} s`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w2.id} n`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w3.id} w`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w4.id} e`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w5.id} e`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w6.id} e`,
        }),
      ];

      const pruned = game.handleMovementActions(moveActions);
      expect(pruned.length).to.equal(1);
      expect(pruned[0].unitid).to.equal(w6.id);
    });

    it('should allow many units to go where other units used to be without collision ', () => {
      // if the following 4 just rotate clockwise, no collisions should occur;
      const w1 = game.spawnWorker(0, 4, 4);
      const w2 = game.spawnWorker(0, 5, 4);
      const w3 = game.spawnWorker(0, 5, 5);
      const w4 = game.spawnWorker(0, 4, 5);

      const moveActions: any[] = [
        game.validateCommand({
          agentID: 0,
          command: `m ${w1.id} e`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w2.id} s`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w3.id} w`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w4.id} n`,
        }),
      ];
      const pruned = game.handleMovementActions(moveActions);
      expect(pruned).to.eql(moveActions);
    });

    it('should allow units to go where other units used to be without collision amongst other collisions', () => {
      // the following units will collide at (4, 5)
      const w1 = game.spawnWorker(0, 4, 4);
      const w2 = game.spawnWorker(0, 4, 6);
      const w3 = game.spawnWorker(0, 5, 5);

      // the following units were expect w1 to move, but since it collided, these units will also no longer move
      const w4 = game.spawnWorker(0, 3, 4);
      const w5 = game.spawnWorker(0, 2, 4);

      // w7 will move east, allowing w6 to move east as well
      const w6 = game.spawnWorker(0, 0, 0);
      const w7 = game.spawnWorker(0, 1, 0);

      const moveActions: any[] = [
        game.validateCommand({
          agentID: 0,
          command: `m ${w1.id} s`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w2.id} n`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w3.id} w`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w4.id} e`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w5.id} e`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w6.id} e`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w7.id} e`,
        }),
      ];

      const pruned = game.handleMovementActions(moveActions);
      expect(pruned.length).to.equal(2);
      expect(pruned[0].unitid).to.equal(w6.id);
      expect(pruned[1].unitid).to.equal(w7.id);
    });

    it('should allow units to move onto the same city tile of the same team but not other units', () => {
      // the following units will collide at (4, 5) unless its a city
      const w1 = game.spawnWorker(0, 4, 4);
      const w2 = game.spawnWorker(0, 4, 6);
      const w3 = game.spawnWorker(0, 5, 5);
      const w4 = game.spawnWorker(1, 3, 5);
      game.spawnCityTile(0, 4, 5);

      const moveActions: any[] = [
        game.validateCommand({
          agentID: 0,
          command: `m ${w1.id} s`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w2.id} n`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w3.id} w`,
        }),
      ];

      try {
        game.validateCommand({
          agentID: 1,
          command: `m ${w4.id} e`,
        });
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }

      const pruned = game.handleMovementActions(moveActions);
      expect(pruned.length).to.equal(3);
      expect(pruned[0].unitid).to.equal(w1.id);
      expect(pruned[1].unitid).to.equal(w2.id);
      expect(pruned[2].unitid).to.equal(w3.id);
    });

    it('should allow colliding units to revert onto the same city tiles and units to go to the city tile', () => {
      // the following units will collide at (4, 5) unless its a city
      const w1 = game.spawnWorker(0, 4, 4);
      const w2 = game.spawnWorker(0, 4, 4);
      const w3 = game.spawnWorker(0, 4, 4);
      const w4 = game.spawnWorker(0, 3, 4);
      game.spawnCityTile(0, 4, 4);

      const moveActions: any[] = [
        game.validateCommand({
          agentID: 0,
          command: `m ${w1.id} s`,
        }),
        game.validateCommand({
          agentID: 0,
          command: `m ${w2.id} s`,
        }),
        // the following 2 should be the only ones working
        // w3 can move north as nothing is blocking it there
        game.validateCommand({
          agentID: 0,
          command: `m ${w3.id} n`,
        }),
        // w4 can still move east to the city tile where w1 and w2 were reverted to due to collision as it is a city tile
        game.validateCommand({
          agentID: 0,
          command: `m ${w4.id} e`,
        }),
      ];

      const pruned = game.handleMovementActions(moveActions);
      expect(pruned.length).to.equal(2);
      expect(pruned[0].unitid).to.equal(w3.id);
      expect(pruned[1].unitid).to.equal(w4.id);
    });
  });
});
