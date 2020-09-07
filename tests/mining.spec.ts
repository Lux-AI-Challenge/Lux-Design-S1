import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import { Game } from '../src/Game';
import { Resource } from '../src/Resource';
import { DEFAULT_CONFIGS } from '../src/defaults';

describe('Test resource collection and distribution', () => {
  let game: Game;
  const rates = DEFAULT_CONFIGS.parameters.WORKER_COLLECTION_RATE;
  beforeEach(() => {
    game = new Game({
      width: 16,
      height: 16,
    });
  });
  it('should distribute evenly given all workers have space and abundance of resource', () => {
    const cell = game.map.getCell(4, 4);
    cell.setResource(Resource.Types.WOOD, rates.WOOD * 10);
    const w1 = game.spawnWorker(0, 4, 4);
    const w2 = game.spawnWorker(1, 4, 5);
    game.handleResourceRelease(cell);
    expect(w1.cargo.wood).to.equal(rates.WOOD);
    expect(w2.cargo.wood).to.equal(rates.WOOD);
    expect(cell.resource.amount).to.equal(rates.WOOD * 8);
  });

  it('should distribute evenly given all workers have space and limited resources ', () => {
    const cell = game.map.getCell(4, 4);
    cell.setResource(Resource.Types.WOOD, rates.WOOD);
    const w1 = game.spawnWorker(0, 4, 4);
    const w2 = game.spawnWorker(1, 4, 5);
    game.handleResourceRelease(cell);
    expect(w1.cargo.wood).to.equal(Math.floor(rates.WOOD / 2));
    expect(w2.cargo.wood).to.equal(Math.floor(rates.WOOD / 2));
    expect(cell.resource).to.equal(null);
  });

  it('should distribute evenly given some workers have limited space and abundance of resources ', () => {
    const cell = game.map.getCell(4, 4);
    cell.setResource(Resource.Types.WOOD, rates.WOOD * 10);
    const w1 = game.spawnWorker(0, 4, 4);
    w1.cargo.wood =
      DEFAULT_CONFIGS.parameters.RESOURCE_CAPACITY.WORKER - rates.WOOD / 2;
    const w2 = game.spawnWorker(1, 4, 5);
    const w3 = game.spawnWorker(1, 4, 3);
    game.handleResourceRelease(cell);
    // shouldn't be able to go over cargo capacity and only mine half as much as usual
    expect(w1.cargo.wood).to.equal(
      DEFAULT_CONFIGS.parameters.RESOURCE_CAPACITY.WORKER
    );
    // while w1 takes less resources, it should still get max rates.WOOD
    expect(w2.cargo.wood).to.equal(Math.floor(rates.WOOD));
    expect(w3.cargo.wood).to.equal(Math.floor(rates.WOOD));
    expect(cell.resource.amount).to.equal(rates.WOOD * 7.5);
  });

  it('should distribute evenly given some workers have limited space and limited resources ', () => {
    const cell = game.map.getCell(4, 4);
    cell.setResource(Resource.Types.WOOD, rates.WOOD);
    const w1 = game.spawnWorker(0, 4, 4);
    w1.cargo.wood =
      DEFAULT_CONFIGS.parameters.RESOURCE_CAPACITY.WORKER -
      Math.floor(rates.WOOD / 6);
    const w2 = game.spawnWorker(1, 4, 5);
    const w3 = game.spawnWorker(1, 4, 3);
    game.handleResourceRelease(cell);

    expect(w1.cargo.wood).to.equal(
      DEFAULT_CONFIGS.parameters.RESOURCE_CAPACITY.WORKER
    );
    // due to w1 reaching cargo cap and there's limited resources, all other units take a little more than w1
    expect(w2.cargo.wood).to.equal(Math.floor((5 * rates.WOOD) / 12));
    expect(w3.cargo.wood).to.equal(Math.floor((5 * rates.WOOD) / 12));
    expect(cell.resource).to.equal(null);
  });
});
