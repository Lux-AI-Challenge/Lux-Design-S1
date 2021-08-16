import chai from 'chai';
import 'mocha';
import { Game } from '../src/Game';
import { Resource } from '../src/Resource';

const expect = chai.expect;
describe('Test resource transfer', () => {
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
    it('should transfer resources', () => {
      const cart1 = game.spawnCart(0, 14, 14);
      const cart2 = game.spawnCart(0, 14, 15);
      cart1.cargo.wood = 300
      game.transferResources(cart1.team, cart1.id, cart2.id, Resource.Types.WOOD, 200);
      expect(cart1.cargo.wood).to.equal(100);
      expect(cart2.cargo.wood).to.equal(200);
    });
    it('should transfer less resources if target has no space', () => {
      const cart1 = game.spawnCart(0, 14, 14);
      const worker1 = game.spawnWorker(0, 14, 15);
      cart1.cargo.wood = 300
      worker1.cargo.uranium = 20
      game.transferResources(cart1.team, cart1.id, worker1.id, Resource.Types.WOOD, 100);
      expect(cart1.cargo.wood).to.equal(300 - 80);
      expect(worker1.cargo.wood).to.equal(80);
    });
    it('should transfer less resources if source does not have enough', () => {
      const cart1 = game.spawnCart(0, 14, 14);
      const worker1 = game.spawnWorker(0, 14, 15);
      cart1.cargo.wood = 20
      worker1.cargo.uranium = 20
      game.transferResources(cart1.team, cart1.id, worker1.id, Resource.Types.WOOD, 100);
      expect(cart1.cargo.wood).to.equal(0);
      expect(worker1.cargo.wood).to.equal(20);
      expect(worker1.cargo.uranium).to.equal(20);
    });
});