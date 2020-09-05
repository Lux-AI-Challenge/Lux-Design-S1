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
});
