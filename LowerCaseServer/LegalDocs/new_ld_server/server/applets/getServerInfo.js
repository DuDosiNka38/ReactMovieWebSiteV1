var osu = require('node-os-utils')

var cpu = osu.cpu

var drive = osu.drive;
drive.info()
  .then(info => {
    console.log(info)
  })
console.log("Max LOH i POSHEL V ZHOPU");
