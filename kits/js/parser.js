/**
 * Parser class to help parse a input line of data
 */
class Parser {
  
  constructor(d = ',') {
    this.delimiter = d;
    return this.parse.bind(this);
  }
  setDelimeter(s) {
    this.delimiter = s;
  }
  parse(str) {
    return new Parsed(str, this.delimiter);
  }
   
}
class Parsed {
  constructor(str, d) {
    this.str = str;
    this.contents = str.split(d);
    
    // remove the last element if its empty string
    if (this.contents[this.contents.length - 1] === '') {
      this.contents = this.contents.slice(0, this.contents.length - 1);
    }
    this.index = 0;
  }
  _nextStr() {
    if (this.index < this.contents.length) {
      return this.contents[this.index++];
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  // Returns the remainder of the line as an array of integers
  nextIntArr() {
    if (this.index < this.contents.length) {
      let remainder = this.contents.slice(this.index, this.contents.length).map((val) => parseInt(val));
      return remainder;
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  nextInt() {
    let str = this._nextStr();
    return parseInt(str);
  }
  // Returns the remainder of the line as an array of floats
  nextFloatArr() {
    if (this.index < this.contents.length) {
      let remainder = this.contents.slice(this.index++).map((val) => parseFloat(val));
      return remainder;
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  nextFloat() {
    let str = this._nextStr();
    return parseFloat(str);
  }
  // Returns the remainder of the line as an array of strings
  nextStrArr() {
    if (this.index < this.contents.length) {
      let remainder = this.contents.slice(this.index++);
      return remainder;
    }
    else {
      throw new Error("No more contents to consume from line")
    }
  }
  nextStr() {
    return this._nextStr();
  }
}
module.exports = Parser