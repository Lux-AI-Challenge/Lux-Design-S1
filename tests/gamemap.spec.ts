import chai from 'chai';
import 'mocha';
import { Game } from '../src/Game';
const expect = chai.expect;
describe('Test GameMap', () => {
  it('should initialize game map properly', () => {
    const gamemap = new Game(16, 16);
    expect(gamemap.map.length).to.equal(16);
    expect(gamemap.map[0].length).to.equal(16);
  });
});
