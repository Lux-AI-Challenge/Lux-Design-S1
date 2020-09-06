/**
 * Parser class to help parse a input line of data
 */
export function parse(str: string, delimmiter: string): Parsed {
  return new Parsed(str, this.delimiter);
}
export class Parsed {
  public contents: Array<string> = [];
  public index: number = 0;
  constructor(public str, d: string) {
    this.str = str;
    this.contents = str.split(d);
    
    // remove the last element if its empty string
    if (this.contents[this.contents.length - 1] === '') {
      this.contents = this.contents.slice(0, this.contents.length - 1);
    }
  }
  _nextStr(): string {
    if (this.index < this.contents.length) {
      return this.contents[this.index++];
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  // Returns the remainder of the line as an array of integers
  nextIntArr(): Array<number> {
    if (this.index < this.contents.length) {
      let remainder = this.contents.slice(this.index, this.contents.length).map((val) => parseInt(val));
      return remainder;
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  nextInt(): number {
    let str = this._nextStr();
    return parseInt(str);
  }
  // Returns the remainder of the line as an array of floats
  nextFloatArr(): Array<number> {
    if (this.index < this.contents.length) {
      let remainder = this.contents.slice(this.index++).map((val) => parseFloat(val));
      return remainder;
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  nextFloat(): number {
    let str = this._nextStr();
    return parseFloat(str);
  }
  // Returns the remainder of the line as an array of strings
  nextStrArr(): Array<string> {
    if (this.index < this.contents.length) {
      let remainder = this.contents.slice(this.index++);
      return remainder;
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  nextStr(): string {
    return this._nextStr();
  }
}