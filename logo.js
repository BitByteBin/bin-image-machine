const textToImage = require('text-to-image');
const imageDataUri = require('image-data-uri');
const Probability = require('./Probability.js/Probability.js');
const math = require('mathjs');
const fs = require('fs');

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

function binEncode(data) {
  var binArray = []
  var datEncode = "";

  for (i=0; i < data.length; i++) {
    binArray.push(data[i].charCodeAt(0).toString(2)); 
  } 
  for (j=0; j < binArray.length; j++) {
    var pad = padding_left(binArray[j], '0', 8);
    datEncode += pad + ' '; 
  }
  function padding_left(s, c, n) { if (! s || ! c || s.length >= n) {
    return s;
  }
    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
      s = c + s; } return s;
  }
  console.log(binArray);
  return binArray;
}

let lines = 32;
let bytesPerLine = 32;
let sumbytes = '';
let byte = 0;

for(let i = 0; i < lines; i++) {
  for(let j = 0; j < bytesPerLine; j++) {
    sumbytes += dec2bin(byte)
    byte++

    if(j != bytesPerLine - 1) {
      sumbytes += ' ';
    }
  }
  if(i != lines - 1) {
    sumbytes += '\n';
  }
}

let imageUri = textToImage.generateSync(sumbytes, {
  bgColor: "#000000",
  textColor: "#FFFFFF",
  maxWidth: 3730
});

imageDataUri.outputFile(imageUri, `./logo/1024.png`);
