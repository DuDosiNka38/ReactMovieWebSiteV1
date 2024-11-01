const DataChecker = require("./../services/DataChecker");

exports.filterObj = async (obj, cb) => {
    let retObj = {};

    for(let k in obj){
        if(await cb(obj[k], k, obj)){
            retObj[k] = obj[k];
        }
    }

    return retObj;
}

exports.mapObj = async (obj, cb) => {
    return await exports.filterObj(obj, cb);
}

exports.rollback = async (data) => {
    const response = {
        result: null,
        execStack: [],
    };

    //Check recieved data
    if(!Array.isArray(data)){
        response.result = false;
        response.data = {
            error_code: "WRONG_DATA_RECIEVED",
            error_message: "Check arguments",
            error_data: data
        };

        return response;
    }

    if(data.length === 0){
        response.result = false;
        response.data = {
            error_code: "EMPTY_ROLLBACK_ARRAY",
            error_message: "Recieved empty rollback array",
            error_data: data
        };

        return response;
    }

    for await (let item of data){
        if(item.hasOwnProperty("function")){
            if(typeof item.function === "function"){
                const rollbackItemResult = await item.function(item.data);
                response.execStack.push({
                    function: item.function,
                    data: item.data,
                    rollbackItemResult: rollbackItemResult
                });
            }
        } else {
            response.execStack.push({
                function: null,
                data: null,
                rollbackItemResult: {
                    result: true,
                    data: {
                        error_code: "WRONG_ROLLBACK_ITEM_ARGUMENTS",
                        error_message: "Wrong rollback item arguments",
                        data: item
                    }
                }
            });
        }
    }

    // data.map( async (item) => {
    //     if(item.hasOwnProperty("function")){
    //         if(typeof item.function === "function"){
    //             const rollbackItemResult = await item.function(item.data);
    //             response.execStack.push({
    //                 function: item.function,
    //                 data: item.data,
    //                 rollbackItemResult: rollbackItemResult
    //             });
    //         }
    //     } else {
    //         response.execStack.push({
    //             function: null,
    //             data: null,
    //             rollbackItemResult: {
    //                 result: true,
    //                 data: {
    //                     error_code: "WRONG_ROLLBACK_ITEM_ARGUMENTS",
    //                     error_message: "Wrong rollback item arguments",
    //                     data: item
    //                 }
    //             }
    //         });
    //     }
    // });

    response.result = true;

    return response;
}

exports.isValidSession = async (req, res, next) => {
  next();

    // const DBManager = require("./DBManager");
    // const db = DBManager(req.hostId);   
    
    // let data = req.headers;
    // const fields = ['user_ip', 'user_auth_hash'];
    // const checkData = DataChecker.checkFields(fields, data);
    // if(checkData.isError){
    //     res.send({
    //         result: false,
    //         data: {
    //             error_code: "NON_AUTH_REQUEST",
    //             error_message: "NON_AUTH_REQUEST",
    //             error_data: checkData.errorStack
    //         }
    //     });
    // } else {
    //     filtered = await exports.filterObj(data, (v, i, o) => (fields.includes(i)));
    //     const result = await db.select("auth_id").from("user_auth").where(filtered).then((r) => (r));
    //     result.length === 0 ? res.send({ result: false, data: { error_code: "WRONG_SESSION", error_message: "Wrong session", error_data: data}}) : next();
    // }
}

exports.getCurrentTimestamp = () => {
  return Math.ceil(Date.now()/1000);
}

exports.mapStep = async (data, cbSuccess, cbEnd, i, total) => {
  if (i === null || i === undefined) i = 0;

  if (total === null || total === undefined) total = data.length;

  if (cbSuccess !== null && cbSuccess !== undefined) {
    await cbSuccess(data[i], async (index) => {
      i = index || ++i;
      if (i < total) {
        await module.exports.mapStep(data, cbSuccess, cbEnd, i, total);
      } else {
        if (cbEnd !== null && cbEnd !== undefined) cbEnd();
      }
    }, i, data);
  }
}

exports.mapPartedStep = async (data, partSize, cbSuccess, cbEnd, i, total) => {
  if (i === null || i === undefined) i = 0;

  if (partSize === null || partSize === undefined) partSize = 100;

  if (total === null || total === undefined) total = Math.ceil(data.length / partSize);

  if (cbSuccess !== null && cbSuccess !== undefined) {
    cbSuccess(
      data.slice(i * partSize, i * partSize + partSize), 
      async () => {
        if (++i < total) {
          await module.exports.mapPartedStep(data, partSize, cbSuccess, cbEnd, i, total);
        } else {
          if (cbEnd !== null && cbEnd !== undefined) cbEnd(total);
        }
      }, 
      i,
      total);
  }
}

exports.isDbExists = async (hostId) => {
  const dbConfig = require("./../config/db.config");
  const { dbPreset } = require("./../config/config.dev");
  
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  return await new Promise((fulfill, reject) => {
    con.connect((err) => {
      if(err) reject(err);
    
      con.query(`SELECT count(SCHEMA_NAME) as COUNT FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME ='${dbPreset.database}${hostId}'`, (err, result) => {
        if(err) reject(err);

        if(result)
          fulfill(Boolean(result[0].COUNT));
        else
          fulfill(false);
      });
    });
  });

//   SELECT count(SCHEMA_NAME) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'dbi_ld_dev1'
}

module.exports.OCRmyPDF = async (path) => {
  const { exec } = require("child_process");
  return await new Promise(function (fulfill, reject){
    exec(`ocrmypdf --rotate-pages --force-ocr ${path} ${path}`, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) fulfill(stderr);
      
      fulfill(stdout);
    });
  })
  .then((r) => (true))
  .catch((e) => {
    console.log("OCR Error:", e);
    return false;
  });
}