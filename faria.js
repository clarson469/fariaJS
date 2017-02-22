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
    iterate: function ( callback, count ) {
      for (let i=0; i<count; i++) callback();
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
    getBetween: function ( string, a, b=undefined, keepSymbols=true ) {
      const start = a,
            end = b || a,
            exp = new RegExp(start + '.*?' + end, 'g');
      if (keepSymbols) string.match('exp');

      return string.match(exp).map((item) => (item.slice(1,-1)));
    },
    formatText: function ( string, args ) {
      if (typeof args === 'string' || typeof args === 'number') args = [args];
      const markers = util.string.getBetween(string, '{', '}', false),
            setMarkers = util.data.getUnique(markers);
      for (let item of setMarkers) {
        if (item === '') {
          console.error('empty format marker ( "{}" ) given');
          return null;
        }
        let exp = new RegExp('\\{' + item + '\\}', 'g');
        string = string.replace(exp, args[item]);
      }
      return string;
    }
  },
  data:{
    getUnique: function ( array ) {
      const seen = {};
      return array.filter(function ( item ) {
        const k = JSON.stringify(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      });
    },
    getChildren: function ( object, parentString=null, excl=[] ) {
      if (parentString !== null) object = util.data.selectObjNode(object, parentString);
      let nodeList = [];
      for (let node in object) {
        if (!excl.includes(node)) nodeList.push(object[node]);
      }
      return nodeList;
    },
    findInObjList: function ( list, key, value ) {
      for (let item of list) {
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
          output[key] = util.random.choose(object[key]);
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
    extend: function extend( destination, source ) {
      const toString = Object.prototype.toString,
            objTest = toString.call({});
      for (let property in source) {
        if (source[property] && objTest === toString.call(source[property])) {
          destination[property] = destination[property] || {};
          extend(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }
  }
};

module.exports = util;
