import chai from 'chai';
import 'mocha';
import { Game } from '../src/Game';
import { fail } from 'assert';
import { Resource } from '../src/Resource';
import { MatchWarn } from 'dimensions-ai';

const expect = chai.expect;
describe('Test Game', () => {
  it('should initialize game map properly', () => {
    const game = new Game({
      width: 16,
      height: 16,
    });
    expect(game.map.width).to.equal(16);
    expect(game.map.height).to.equal(16);
  });
  it('should merge city tiles properly and delete obsolete cities after mergers', () => {
    const game = new Game({
      width: 16,
      height: 16,
    });
    // the following 4 will first create 3 cities, which then merge into 1 and merge the fuel deposits
    const c1 = game.spawnCityTile(0, 1, 1);
    game.cities.get(c1.cityid).fuel = 500;
    const c2 = game.spawnCityTile(0, 3, 1);
    game.cities.get(c2.cityid).fuel = 500;
    game.spawnCityTile(0, 2, 2);
    const c3 = game.spawnCityTile(0, 2, 1);
    expect(game.cities.get(c3.cityid).fuel).to.equal(1000);

    // the following 4 will first create 2 cities, which then merge into 1
    game.spawnCityTile(0, 14, 14);
    game.spawnCityTile(0, 12, 14);
    game.spawnCityTile(0, 13, 14);
    game.spawnCityTile(0, 13, 13);

    game.spawnCityTile(1, 11, 10);
    game.spawnCityTile(1, 10, 10);

    game.spawnCityTile(1, 4, 10);
    game.spawnCityTile(1, 4, 11);
    expect(game.cities.size).to.equal(4);
    expect(
      game.cities.get(game.map.getCell(1, 1).citytile.cityid).citycells.length
    ).to.equal(4);

    expect(
      game.cities.get(game.map.getCell(13, 13).citytile.cityid).citycells.length
    ).to.equal(4);

    expect(
      game.cities.get(game.map.getCell(11, 10).citytile.cityid).citycells.length
    ).to.equal(2);

    expect(
      game.cities.get(game.map.getCell(4, 10).citytile.cityid).citycells.length
    ).to.equal(2);
  });

  describe('test validate commands', () => {
    let game: Game;
    let citytile23;
    beforeEach(() => {
      game = new Game({
        width: 16,
        height: 16,
      });
      game.spawnCityTile(0, 2, 2);
      citytile23 = game.spawnCityTile(0, 2, 3);
    });
    it('should invalidate invalid command', () => {
      let valid = false;
      try {
        game.validateCommand({
          command: `imnotacommand`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('cannot send invalid commands');
    });
    it('should validate build cities', () => {
      const worker = game.spawnWorker(0, 4, 5);
      worker.cargo.wood = 100;
      game.spawnCityTile(0, 1, 5);
      const workerOnCity = game.spawnWorker(0, 1, 5);
      game.map.getCell(6, 6).setResource(Resource.Types.COAL, 100);
      const workerOnResource = game.spawnWorker(0, 6, 6);
      game.validateCommand({
        command: `bcity ${worker.id}`,
        agentID: 0,
      });
      let valid = false;
      try {
        game.validateCommand({
          command: 'bcity invalid',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build with invalid unit id');

      valid = false;
      try {
        game.validateCommand({
          command: `bcity ${workerOnResource.id}`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build on non empty resource tile');

      valid = false;
      try {
        game.validateCommand({
          command: `bcity ${workerOnCity.id}`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build city on existing city');
    });
    it('should validate build carts', () => {
      const init = game._genInitialAccumulatedActionStats();
      game.spawnCityTile(0, 0, 0);
      game.spawnCart(0, 14, 14);
      game.spawnCart(0, 14, 15);
      game.validateCommand(
        {
          command: 'bc 2 2',
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: `bc 0 0`,
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(
          MatchWarn,
          'validate did not throw error for building carts after unit cap reached'
        );
      }
      let valid = false;
      try {
        game.validateCommand({
          command: 'bc 10 10',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build on non city tile');

      valid = false;
      try {
        game.validateCommand({
          command: 'bc 2 3',
          agentID: 1,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build on opponents city');

      valid = false;
      try {
        game.validateCommand({
          command: 'bc a c',
          agentID: 1,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('tried to build using nan coords');

      valid = false;
      try {
        game.validateCommand({
          command: 'bc 2 3 4',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('malformed command');

      citytile23.cooldown = 1.2;
      valid = false;
      try {
        game.validateCommand({
          command: 'bw 2 3',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('cannot act during cooldown');
    });

    it('should validate build workers', () => {
      const init = game._genInitialAccumulatedActionStats();
      game.spawnCityTile(0, 0, 0);
      game.spawnWorker(0, 14, 14);
      game.spawnWorker(0, 14, 15);
      game.validateCommand(
        {
          command: 'bw 2 2',
          agentID: 0,
        },
        init
      );
      // cannot build worker if unit cap reached
      try {
        game.validateCommand(
          {
            command: `bw 0 0`,
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(
          MatchWarn,
          'validate did not throw error for building worker after unit cap reached'
        );
      }
      let valid = false;
      try {
        game.validateCommand({
          command: 'bw 10 10',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build on non city tile');

      valid = false;
      try {
        game.validateCommand({
          command: 'bw 2 3',
          agentID: 1,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build on opponents city');

      valid = false;
      try {
        game.validateCommand({
          command: 'bw 2 3 4',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('malformed command');

      citytile23.cooldown = 1.2;
      valid = false;
      try {
        game.validateCommand({
          command: 'bw 2 3',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('cannot act during cooldown');
    });

    it('should validate research', () => {
      game.validateCommand({
        command: 'r 2 2',
        agentID: 0,
      });
      let valid = false;
      try {
        game.validateCommand({
          command: 'r 10 10',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build on non city tile');

      valid = false;
      try {
        game.validateCommand({
          command: 'r 2 3',
          agentID: 1,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not build on opponents city');

      valid = false;
      try {
        game.validateCommand({
          command: 'r 2 3 4',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('malformed command');

      citytile23.cooldown = 1.2;
      valid = false;
      try {
        game.validateCommand({
          command: 'r 2 3',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('cannot research more during cooldown');
    });

    it('should validate move commands', () => {
      const worker = game.spawnWorker(0, 4, 4);
      const workerEdge = game.spawnWorker(0, 0, 0);
      game.spawnCityTile(1, 0, 1);
      game.validateCommand({
        command: `m ${worker.id} n`,
        agentID: 0,
      });
      let valid = false;
      try {
        game.validateCommand({
          command: `m ${worker.id} a`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not move in invalid direction');

      valid = false;
      try {
        game.validateCommand({
          command: `m ${worker.id} n`,
          agentID: 1,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not move unowned unit');

      valid = false;
      try {
        game.validateCommand({
          command: `m invalidid n`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not move an unit that does not exist');

      valid = false;
      try {
        game.validateCommand({
          command: `m ${workerEdge.id} n`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not move a unit off map');

      valid = false;
      try {
        game.validateCommand({
          command: `m ${workerEdge.id} s`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not move a unit onto enemy city');

      valid = false;
      worker.cooldown = 1.1;
      try {
        game.validateCommand({
          command: `m ${worker.id} n`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not move an unit that is on cooldown');
    });
    it('should validate resource transfer commands', () => {
      const worker1 = game.spawnWorker(0, 10, 10);
      const worker2 = game.spawnWorker(0, 11, 10);
      const worker3 = game.spawnWorker(0, 11, 15);
      const teamBworker4 = game.spawnWorker(1, 10, 9);
      worker1.cargo.wood = 100;
      game.validateCommand({
        command: `t ${worker1.id} ${worker2.id} wood 100`,
        agentID: 0,
      });
      let valid = false;
      try {
        game.validateCommand({
          command: `t ${worker1.id} ${worker2.id} invalidresource 100`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not give invalid resource');

      valid = false;
      try {
        game.validateCommand({
          command: `t ${worker1.id} ${worker3.id} wood 100`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not give resources to non-adjacent units');

      valid = false;
      try {
        game.validateCommand({
          command: `t ${worker1.id} ${teamBworker4.id} wood 100`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not give resources to opponent units');

      valid = false;
      try {
        game.validateCommand({
          command: `t ${teamBworker4.id} ${worker1.id} wood 100`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not transfer from opponent units');

      valid = false;
      try {
        game.validateCommand({
          command: `t ${worker1.id} ${worker1.id} wood 100`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not transfer to same unit');

      valid = false;
      try {
        game.validateCommand({
          command: `t ${worker1.id} ${worker2.id} wood a`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not transfer nan amount');

      valid = false;
      try {
        game.validateCommand({
          command: `t ${worker1.id} ${worker2.id} wood -1`,
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('can not transfer invalid amount');
    });
    it('should validate pillage commands', () => {
      const worker = game.spawnWorker(0, 4, 4);
      game.validateCommand({
        command: `p ${worker.id}`,
        agentID: 0,
      });
      try {
        game.validateCommand({
          command: `p invalidid`,
          agentID: 0,
        });
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(
          MatchWarn,
          'validate did not throw error for unowned unit id'
        );
      }

      worker.cooldown = 0.1;
      try {
        game.validateCommand({
          command: `p ${worker.id}`,
          agentID: 0,
        });
      } catch (err) {
        expect(err).to.be.instanceOf(
          MatchWarn,
          'validate did not throw error for unit on cooldown'
        );
      }
    });

    it('should not allow duplicate commands for build cities', () => {
      const init = game._genInitialAccumulatedActionStats();
      const worker = game.spawnWorker(0, 4, 5);
      worker.cargo.wood = 100;
      game.spawnCityTile(0, 1, 5);
      game.validateCommand(
        {
          command: `bcity ${worker.id}`,
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: `bcity ${worker.id}`,
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }
    });
    it('should not allow duplicate commands for build carts', () => {
      const init = game._genInitialAccumulatedActionStats();
      game.validateCommand(
        {
          command: 'bc 2 2',
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: 'bc 2 2',
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }
    });
    it('should not allow duplicate commands for build workers', () => {
      const init = game._genInitialAccumulatedActionStats();
      game.spawnCityTile(0, 0, 0);
      game.validateCommand(
        {
          command: 'bw 2 2',
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: 'bw 2 2',
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }
    });
    it('should not allow duplicate commands for research', () => {
      const init = game._genInitialAccumulatedActionStats();
      game.validateCommand(
        {
          command: 'r 2 2',
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: 'r 2 2',
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }
    });
    it('should not allow duplicate commands for moves', () => {
      const init = game._genInitialAccumulatedActionStats();
      const worker = game.spawnWorker(0, 4, 4);
      game.validateCommand(
        {
          command: `m ${worker.id} n`,
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: `m ${worker.id} s`,
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }
    });
    it('should not allow duplicate commands for transfers', () => {
      const init = game._genInitialAccumulatedActionStats();
      const worker1 = game.spawnWorker(0, 10, 10);
      const worker2 = game.spawnWorker(0, 11, 10);
      game.validateCommand(
        {
          command: `t ${worker1.id} ${worker2.id} wood 100`,
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: `t ${worker1.id} ${worker2.id} wood 100`,
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }
    });
    it('should not allow duplicate commands for pillage', () => {
      const init = game._genInitialAccumulatedActionStats();
      const worker = game.spawnWorker(0, 4, 4);
      game.validateCommand(
        {
          command: `p ${worker.id}`,
          agentID: 0,
        },
        init
      );
      try {
        game.validateCommand(
          {
            command: `p ${worker.id}`,
            agentID: 0,
          },
          init
        );
        fail();
      } catch (err) {
        expect(err).to.be.instanceOf(MatchWarn, 'validate did not throw error');
      }
    });
  });
});
