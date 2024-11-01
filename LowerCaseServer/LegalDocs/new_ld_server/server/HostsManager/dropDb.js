const nodePath = process.argv[0];
const appPath = process.argv[1];
const HOST = process.argv[2];
const { dbPreset } = require("../config/config.dev");
const dbConfig = require("./../config/db.config");

var mysql = require("mysql");
var con = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
});


con.connect((err) => {
  const _result = {};
  const _error = null;

  if (err){
    process.stdout.write(JSON.stringify({err}));
    process.exit();
  }

  con.query(`DROP DATABASE IF EXISTS ${dbPreset.database}${HOST}`, (err, result) => {
    if (err){
      process.stdout.write(JSON.stringify({err}));
      process.exit();
    }

    _result.DROP_DB = true;
  });

  con.query(`DROP USER '${dbPreset.user}${HOST}'@'localhost'`, (err, result) => {
    if (err){
      process.stdout.write(JSON.stringify({err}));
      process.exit();
    }

    _result.DROP_USER = true;
  });

  con.end(function(err) {
    if (err){
      process.stdout.write(JSON.stringify({err}));
      process.exit();
    }

    _result.MYSQL_USER = `${dbPreset.user}${HOST}`;
    _result.MYSQL_DB = `${dbPreset.database}${HOST}`;

    process.stdout.write(JSON.stringify(_result));
    process.exit();
  });


    
  
});
