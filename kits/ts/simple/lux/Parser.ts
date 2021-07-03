import {Parsed} from "./Parsed";

/**
 * Parser class to help parse a input line of data
 */
export class Parser {
  public delimiter: string;
  public constructor(d = ',') {
    this.delimiter = d;
    return this.parse.bind(this);
  }
  public setDelimeter(s: string): void {
    this.delimiter = s;
  }
  public parse(str: string): Parsed {
    return new Parsed(str, this.delimiter);
  }
}

