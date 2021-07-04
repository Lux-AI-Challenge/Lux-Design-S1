export class Parsed {
  public str: string;
  public contents: Array<string>;
  public index: number;

  public constructor(str: string, d: string) {
    this.str = str;
    this.contents = str.split(d);

    // remove the last element if its empty string
    if (this.contents[this.contents.length - 1] === '') {
      this.contents = this.contents.slice(0, this.contents.length - 1);
    }
    this.index = 0;
  }

  public _nextStr(): string {
    if (this.index < this.contents.length) {
      return this.contents[this.index++];
    } else {
      throw new Error("No more contents to consume from line")
    }
  }

  // Returns the remainder of the line as an array of integers
  public nextIntArr(): Array<number> {
    if (this.index < this.contents.length) {
      return this.contents.slice(this.index, this.contents.length).map((val) => parseInt(val, 10));
    } else {
      throw new Error("No more contents to consume from line")
    }
  }

  public nextInt(): number {
    const str = this._nextStr();
    return parseInt(str, 10);
  }

  // Returns the remainder of the line as an array of floats
  public nextFloatArr(): Array<number> {
    if (this.index < this.contents.length) {
      return this.contents.slice(this.index++).map((val) => parseFloat(val));
    } else {
      throw new Error("No more contents to consume from line")
    }
  }

  public nextFloat(): number {
    const str = this._nextStr();
    return parseFloat(str);
  }

  // Returns the remainder of the line as an array of strings
  public nextStrArr(): Array<string> {
    if (this.index < this.contents.length) {
      return this.contents.slice(this.index++);
    } else {
      throw new Error("No more contents to consume from line")
    }
  }

  public nextStr(): string {
    return this._nextStr();
  }
}