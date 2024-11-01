var config = require("./../config/config.dev");
const Functions = require("./../lib/Functions");
const Connections = [];

var knex = require("knex");
const md5 = require("md5");

const DBManager = (host) => {
  if (!Connections.find((x) => x.host === host)) {
    const dbConfig = Object.assign({}, config.dbPreset);
    dbConfig.user += host;
    dbConfig.database += host;
    dbConfig.insequreAuth = true;
    dbConfig.password = md5(`${host}_${config.dbPasswordSalt}`);

    Connections.push({
      host: host,
      createTime: Functions.getCurrentTimestamp(),
      connection: new knex({
        client: "mysql",
        connection: dbConfig,
        pool: { min: 0, max: 100 },
      }),
    });
  }

  // console.log(Connections.map((x) => (x.createTime)));

  return Connections.find((x) => x.host === host).connection;
};

module.exports = DBManager;
