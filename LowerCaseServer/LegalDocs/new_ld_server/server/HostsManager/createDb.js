const nodePath = process.argv[0];
const appPath = process.argv[1];
const HOST = process.argv[2];
const { dbPreset, dbPasswordSalt } = require("./../config/config.dev");
const dbConfig = require("./../config/db.config");

var mysql = require("mysql");
const md5 = require("md5");
var con = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
});


con.connect((err) => {
  const _result = {};
  const _error = null;

  const password = md5(`${dbPreset.database}${HOST}_${dbPasswordSalt}`);

  if (err){
    process.stdout.write(JSON.stringify({err}));
    process.exit();
  }

  con.query(`CREATE DATABASE ${dbPreset.database}${HOST}`, (err, result) => {
    if (err){
      process.stdout.write(JSON.stringify({err}));
      process.exit();
    }

    _result.CREATE_DB = true;
  });

  con.query(`CREATE USER '${dbPreset.user}${HOST}'@'localhost'`, (err, result) => {
    if (err){
      process.stdout.write(JSON.stringify({err}));
      process.exit();
    }

    _result.CREATE_USER = true;
  });

  con.query(`GRANT ALL PRIVILEGES ON *.* TO '${dbPreset.user}${HOST}'@'localhost' WITH GRANT OPTION`, (err, result) => {
    if (err){
      process.stdout.write(JSON.stringify({err}));
      process.exit();
    }

    _result.GRANT_PRIVILEGES = true;
  });

  // con.query(`ALTER USER '${dbPreset.user}${HOST}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${password}'`, (err, result) => {
  //   if (err){
  //     process.stdout.write(JSON.stringify({err}));
  //     process.exit();
  //   }

  //   _result.GRANT_PRIVILEGES = true;
  // });

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
