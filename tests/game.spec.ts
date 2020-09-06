import chai from 'chai';
import 'mocha';
import { Game } from '../src/Game';
import { fail } from 'assert';
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
    it('should validate build carts', () => {
      game.validateCommand({
        command: 'bc 2 2',
        agentID: 0,
      });
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
          command: 'bc 2 3 4',
          agentID: 0,
        });
        valid = true;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (valid) fail('malformed command');

      citytile23.cooldown = 0.2;
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
      game.validateCommand({
        command: 'bw 2 2',
        agentID: 0,
      });
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

      citytile23.cooldown = 0.2;
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

      citytile23.cooldown = 0.2;
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
      worker.cooldown = 0.1;
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
    });
  });
});
