import chai from 'chai';
import 'mocha';
import { Game } from '../src/Game';
const expect = chai.expect;
describe('Test GameMap', () => {
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
    c1.fuel = 500;
    const c2 = game.spawnCityTile(0, 3, 1);
    c2.fuel = 500;
    game.spawnCityTile(0, 2, 2);
    const c3 = game.spawnCityTile(0, 2, 1);
    expect(c3.fuel).to.equal(1000);

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
});
