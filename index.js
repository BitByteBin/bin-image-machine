const textToImage = require('text-to-image');
const imageDataUri = require('image-data-uri');
const Probability = require('./Probability.js/Probability.js');
const math = require('mathjs');
const fs = require('fs');

const supply = 1024;
const gen = 0;
let genBin = dec2bin(gen);

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

for(let nftId = 0; nftId < supply; nftId++) {
  let bits = 0;
  let bytes = 0;
  let lines;
  let rarity;

  var probabilitilized1 = new Probability({
    p: '0.1%',
    f: function () {
      lines = 7;
      rarity = 0.1/100; 
    }
  }, {
    p: '0.9%',
    f: function () {
      lines = 8;
      rarity = 0.9/100; 
    }
  }, {
    p: '99%',
    f: function () {
      lines = 9;
      rarity = 99/100; 
    }
  });
  probabilitilized1();

  let sumbytes = '';

  for(let i = 0; i < lines; i++) {
    let bytesPerLine;
    var probabilitilized2 = new Probability({
      p: '60%',
      f: function () {
        bytesPerLine = 3;
        rarity *= 60/100; 
      }
    }, {
      p: '39%',
      f: function () {
        bytesPerLine = 2;
        rarity *= 39/100; 
      }
    }, {
      p: '1%',
      f: function () {
        bytesPerLine = 1;
        rarity *= 1/100; 
      }
    });
    probabilitilized2();
    bytes += bytesPerLine;

    for(let j = 0; j < bytesPerLine; j++) {
      let byteLength;
      var probabilitilized3 = new Probability({
        p: '32%',
        f: function () {
          byteLength = 8;
          rarity *= 32/100; 
        }
      }, {
        p: '25%',
        f: function () {
          byteLength = 7;
          rarity *= 25/100; 
        }
      }, {
        p: '20%',
        f: function () {
          byteLength = 6;
          rarity *= 20/100; 
        }
      }, {
        p: '4%',
        f: function () {
          byteLength = 5;
          rarity *= 4/100; 
        }
      }, {
        p: '9%',
        f: function () {
          byteLength = 4;
          rarity *= 9/100; 
        }
      }, {
        p: '6%',
        f: function () {
          byteLength = 3;
          rarity *= 6/100; 
        }
      }, {
        p: '3%',
        f: function () {
          byteLength = 2;
          rarity *= 3/100; 
        }
      }, {
        p: '1%',
        f: function () {
          byteLength = 1;
          rarity *= 1/100; 
        }
      });
      probabilitilized3();
      bits += byteLength;

      console.log(byteLength);
      for(let h = 0; h < byteLength; h++) {
        sumbytes += Math.round(Math.random());
      }
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
    maxWidth: 300,
    maxHeight: 300
  });
  let imageBin = binEncode(imageUri);

  //upload image to metaplex
  let imageUrl = '';

  let nftIdBin = dec2bin(nftId); //to bin
  //let bin = sumbytes.replaceAll("\n", ";") + ";";
  let bin = sumbytes;

  //rarity = (1/math.format(rarity, {notation: 'fixed'})) -1;
  rarity = 1/rarity -1;
  //save json and png
  let json = {
    "name": `Bin ${nftIdBin}`,
    "symbol": `Bin ${nftIdBin}`,
    "description": `${bin}`,
    "seller_fee_basis_points": 500,
    "image": imageUri,
    "attributes": [
      {
        "trait_type": "Bits",
        "value": `${bits}`
      },
      {
        "trait_type": "Bytes",
        "value": `${bytes}`
      },
      {
        "trait_type": "Lines",
        "value": `${lines}`
      },
      {
        "trait_type": "Rarity",
        "value": `1:${rarity}`
      },
      {
        "trait_type": "Bin",
        "value": `${bin}`
      }
    ],
    "collection": {
      "name": `Bin`,
      "family": "BitByteBin" 
    },
    "properties": {
      "files": [
        {
          "uri": imageUri,
          "type": "image/png"
        }
      ],
      "category": "image",
      "creators": [
        {
          "address": "7T5VNVREk5WmC8ziRT7vwgo5y6nRXatShjGAoTkqGrRP",
          "share": 100
        }
      ]
    }
  }

  fs.writeFile(`./assets/${nftId}.json`, JSON.stringify(json), function (err) {
    if (err) return console.log(err);
    console.log(`write ./assets/${nftId}.json`);
  });

  imageDataUri.outputFile(imageUri, `./assets/${nftId}.png`);
}
