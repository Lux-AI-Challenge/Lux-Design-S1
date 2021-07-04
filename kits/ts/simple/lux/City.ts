// all data related to a city
import {CityTile} from "./CityTile";

export class City {
  public cityid: string;
  public team: number;
  public fuel: number;
  public citytiles = new Array<CityTile>();
  public lightUpkeep: number;

  public constructor(teamid: number, cityid: string, fuel: number, lightUpkeep: number) {
    this.cityid = cityid;
    this.team = teamid;
    this.fuel = fuel;
    this.lightUpkeep = lightUpkeep;
  }

  public addCityTile(x: number, y: number, cooldown: number): CityTile {
    const ct = new CityTile(this.team, this.cityid, x, y, cooldown);
    this.citytiles.push(ct);
    return ct;
  }

  public getLightUpkeep(): number {
    return this.lightUpkeep;
  }
}
