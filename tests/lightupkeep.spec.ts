import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import { Game } from '../src/Game';
import { DEFAULT_CONFIGS } from '../src/defaults';

describe('Test light upkeep', () => {
  const lightUpkeep = DEFAULT_CONFIGS.parameters.LIGHT_UPKEEP;
  const fuelRates = DEFAULT_CONFIGS.parameters.RESOURCE_TO_FUEL_RATE;
  let game: Game;
  beforeEach(() => {
    game = new Game({
      width: 16,
      height: 16,
    });
  });
  it('should make units spend wood, then coal, then uranium if left in night to survive', () => {
    const w1 = game.spawnWorker(0, 1, 1);
    w1.cargo.wood = lightUpkeep.WORKER * fuelRates.WOOD * DEFAULT_CONFIGS.parameters.NIGHT_LENGTH;
    for (let i = 0; i < DEFAULT_CONFIGS.parameters.NIGHT_LENGTH; i++) {
      expect(w1.spendFuelToSurvive()).to.equal(true);
    }
    expect(w1.cargo.wood).to.equal(0);

    // this test can fail depending on parameters
    const w2 = game.spawnWorker(0, 1, 3);
    w2.cargo.wood = 1;
    w2.cargo.coal = 1;
    w2.cargo.uranium = 1;
    // use up wood and coal
    expect(w2.spendFuelToSurvive()).to.equal(true);
    // use up uranium
    expect(w2.spendFuelToSurvive()).to.equal(true);
    // goodbye
    expect(w2.spendFuelToSurvive()).to.equal(false);
    expect(w2.cargo.wood).to.equal(0);
    expect(w2.cargo.coal).to.equal(0);
    expect(w2.cargo.uranium).to.equal(0);
  });
  it('should apply adjacency bonuses', () => {
    const c1 = game.spawnCityTile(0, 1, 1);
    const c2 = game.spawnCityTile(0, 1, 2);
    game.spawnCityTile(0, 1, 3);
    game.spawnCityTile(0, 2, 2);
    expect(c1.adjacentCityTiles).to.equal(1);
    expect(c2.adjacentCityTiles).to.equal(3);
    expect(game.cities.get(c1.cityid).getLightUpkeep()).to.equal(
      DEFAULT_CONFIGS.parameters.LIGHT_UPKEEP.CITY * 4 -
        6 * DEFAULT_CONFIGS.parameters.CITY_ADJACENCY_BONUS
    );
  });
});
