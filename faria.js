/*

MIT License

Copyright (c) 2017 clarson469

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


*/


faria = {
  random:{
    choose: function ( array ) {
      const index = Math.floor(Math.random() * array.length);
      return array[index];
    },
    randInt: function ( a, b=null ) {
      const start = (b === null) ? 0 : a,
            end = (b === null) ? a : b;
      return Math.floor(Math.random() * (end - start)) + start;
    },
    odds: function ( num ) {
      return (Math.random() >= (1 - num));
    }
  },
  math:{
    sum: function ( array ) {
      return array.reduce((a,b) => a+b);
    },
    range: function ( a, b=null ) {
      const output = [],
            start = (b === null) ? 0 : a,
            end = (b === null) ? a : b;
      for (let i=start; i < end; i++) {
        output.push(i);
      }
      return output;
    },
    checkBetween: function ( number, a, b=null ) {
      const start = (b === null) ? 0 : a,
            end = (b === null) ? a : b;
      return (number >= start && number <= end);
    }
  },
  string:{
    getNthOccurance: function ( string, target, n ) {
      const sl = string.length;
      let i = -1;
      while (n-- && i++ < sl) {
        i = string.indexOf(target, i);
        if (i < 0) break;
      }
      return i;
    },
    getBetween: function ( string, a, b=null, keepSymbols=true ) {
      const start = a,
            end = b || a,
            exp = new RegExp(start + '.*?' + end, 'g');
      if (keepSymbols) return string.match(exp);

      return string.match(exp).map((item) => (item.slice(1,-1)));
    },
    formatText: function ( string, args ) {
      if (typeof args === 'string' || typeof args === 'number') args = [args];
      const markers = faria.string.getBetween(string, '{', '}', false),
            setMarkers = faria.data.getUnique(markers);
      for (let item of setMarkers) {
        if (item === '') {
          console.error('empty format marker ( "{}" ) given');
          return null;
        }
        let exp = new RegExp('\\{' + item + '\\}', 'g');
        string = string.replace(exp, args[item]);
      }
      return string;
    },
    leadingZeros: function( number, size ) {
        let output = number + '';
        while (output.length < size)
            output = '0' + output;
        return output;
    }
  },
  data:{
    getUnique: function ( array ) {
      const seen = {};
      return array.filter(function ( item ) {
        const k = JSON.stringify(item);
        return seen.hasOwnkey(k) ? false : (seen[k] = true);
      });
    },
    getChildren: function ( object, parentString=null, excl=[] ) {
      if (parentString !== null) object = faria.data.selectObjNode(object, parentString);
      let nodeList = [];
      for (let node in object) {
        if (!excl.includes(node)) nodeList.push(object[node]);
      }
      return nodeList;
    },
    findInObjList: function ( array, key, value ) {
      for (let item of array) {
        if (item[key] === value) return item;
      }
    },
    assignNodeValue: function assignNodeValue (object, nodeString, value) {
      const nodeList = nodeString.split('.'),
            nodeLength = nodeList.length;
      for (let key in object) {
        if (key === nodeList[0] && nodeLength === 1) object[key] = value;
        else if (key === nodeList[0]) {
          const newNodeString = nodeList.slice(1).join('.');
          assignNodeValue(object[key], newNodeString, value);
        }
      }
    },
    selectObjNode: function selectObjNode ( object, nodeString ) {
      const nodeList = nodeString.split('.'),
            nodeLength = nodeList.length,
            next = nodeList[0];
      if (nodeLength === 1) return object[next];
      const newNodeString = nodeList.slice(1).join('.');
      return selectObjNode(object[next], newNodeString);
    },
    randomiseStructure: function randomiseStructure ( object, output={} ) {
      const toString = Object.prototype.toString,
            arrayTest = toString.call([]);
      for (let key in object) {
        if (toString.call(object[key]) === arrayTest)
          output[key] = faria.random.choose(object[key]);
        else {
          output[key] = {};
          randomiseStructure(object[key], output[key]);
        }
      }
      return output;
    },
    populateStructure: function populateStructure ( object, index, output={}) {
      const toString = Object.prototype.toString,
            arrayTest = toString.call([]);
      for (let key in object) {
        if (toString.call(object[key]) === arrayTest)
          output[key] = object[key][index];
        else {
          output[key] = {};
          populateStructure(object[key], index, output[key]);
        }
      }
      return output;
    },
    copyStructure: function copyStructure ( object, output={} ) {
      const toString = Object.prototype.toString,
            objTest = toString.call({});
      for (let key in object) {
        if (toString.call(object[key]) !== objTest)
          output[key] = null;
        else {
          output[key] = {};
          copyStructure(object[key], output[key]);
        }
      }
      return output;
    },
    populateArray: function ( length, callback ) {
      const output = [];
      for (let i=0; i<length; i++) {
        let item = callback();
        output.push(item);
      }
      return output;
    },
    extend: function extend( object, extension ) {
      const toString = Object.prototype.toString,
            objTest = toString.call({});
      for (let key in extension) {
        if (extension[key] && objTest === toString.call(extension[key])) {
          object[key] = object[key] || {};
          extend(object[key], extension[key]);
        } else {
          object[key] = extension[key];
        }
      }
      return object;
    }
  }
};

module.exports = faria;
