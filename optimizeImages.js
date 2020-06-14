const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

function readdirAsync(path) {
  return new Promise(function (resolve, reject) {
    fs.readdir(path, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

(async () => {
  const files = await imagemin(['assets/*.{jpg,png}'], {
    destination: 'src/assets',
    plugins: [
      // imageminJpegtran({ progressive: true }),
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({
        quality: [0.3, 0.5]
      })
    ]
  });

  const sizes = {};
  const items = await readdirAsync(path.resolve('./assets'));
  for (let item of items) {
    const stats = fs.statSync(path.resolve('./assets', item));
    const newStats = fs.statSync(path.resolve('./src/assets', item));
    sizes[item] = {
      original: stats.size,
      optimized: newStats.size,
      difference: stats.size - newStats.size,
    }
  }
  for (let [item, fileSizes] of Object.entries(sizes)) {
    if (fileSizes.difference > 0) {
      console.log(`${colors.white(item)}: ${colors.green('+' + fileSizes.difference)}`);
    } else {
      console.log(`${colors.yellow(item)}: ${colors.red(fileSizes.difference)}`);
    }
  }
  console.log(colors.cyan.bold('🤘 DONE 🤘'));
})();
