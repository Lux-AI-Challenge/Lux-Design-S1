import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import { Game } from '../src/Game';
import { GameMap } from '../src/GameMap';

describe('test movement handling', () => {
  let game: Game;
  beforeEach(() => {
    game = new Game({
      width: 8,
      height: 8,
      mapType: GameMap.Types.EMPTY,
    });
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
  });
});
