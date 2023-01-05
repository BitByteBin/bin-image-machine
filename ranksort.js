const _=require('underscore');
const fs = require('fs');
const math = require('mathjs');
//const json = require('./assets/ranks.json');

let json = JSON.parse(fs.readFileSync('../BinList/assets/bin-list.json', 'utf8'));

let resultArray = [];
let jsonResult = {};

_.map(json, function(content) {
  let number = content.rarity.split(':')[1];
  number = parseFloat(number);
  number = number = number + 0; // you are number!!
  number = math.format(number, {notation: 'fixed'});
  jsonResult = {
    "bin": content.bin,
    "bits": content.bits,
    "bytes": content.bytes,
    "lines": content.lines,
    "name": content.name,
    "rarity": content.rarity,
    "humanreadable": number.toString()
  }
  console.log(jsonResult);

  resultArray.push(jsonResult);
});

/*
fs.writeFile(`./bin-ranks.json`, JSON.stringify(resultArray), function (err) {
  if (err) return console.log(err);
  console.log(`write ./bin-ranks.json`);
});

json = JSON.parse(fs.readFileSync('./bin-ranks.json', 'utf8'));


resultArray = [];
jsonResult = {};
*/
var arr = [];
let metadata = {};

resultArray.sort((a, b) => {
  return b.humanreadable - a.humanreadable;
});

for(var i = 0; i < resultArray.length; i++) {
  //console.log(json[i].humanreadable);
  metadata = {
    "bin": resultArray[i].bin,
    "bits": resultArray[i].bits,
    "bytes": resultArray[i].bytes,
    "lines": resultArray[i].lines,
    "name": resultArray[i].name,
    "rarity": resultArray[i].rarity,
    "humanreadable": resultArray[i].humanreadable,
    "rank": i.toString()
  }

  arr.push(metadata);
}

fs.writeFile(`../BinList/bin-list.json`, JSON.stringify(arr), function (err) {
  if (err) return console.log(err);
  console.log(`write ./bins-ranked.json`);
});

