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
    w1.cargo.wood = lightUpkeep.WORKER * fuelRates.WOOD;
    expect(w1.spendFuelToSurvive()).to.equal(true);
    expect(w1.cargo.wood).to.equal(0);

    // this test can fail depending on parameters
    const w2 = game.spawnWorker(0, 1, 3);
    w2.cargo.wood = 1;
    w2.cargo.coal = 1;
    w2.cargo.uranium = 1;
    expect(w2.spendFuelToSurvive()).to.equal(true);
    expect(w2.cargo.wood).to.equal(0);
    expect(w2.cargo.coal).to.equal(0);
    expect(w2.cargo.uranium).to.equal(0);
  });
});
