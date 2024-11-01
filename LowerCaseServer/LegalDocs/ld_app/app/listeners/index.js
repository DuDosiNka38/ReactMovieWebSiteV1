const folder = __dirname;
const fs = require('fs');

fs.readdir(folder, (err, files) => {
  files.forEach(file => {
    if(file !== "index.js")
      require(`./${file}`);
  });
})