const DBManager = require("../lib/DBManager");
const { filterObj, mapStep } = require("../lib/Functions");
const {
  insertDocument,
  insertDocumentFiles,
  insertDocumentLocations,
  deleteDocText,
  deleteDocMetadata,
  getDocumentsLocations,
  insertFiles,
  getDocMetadata,
  getFile,
} = require("./Documents");
const Path = require("path");
const md5 = require("md5");
const pathinfo = require("pathinfo");
const ROOT_DIR = require("./../rootDir");
const path = require("path");
const { mainHostsDir, libraryFilesDir, uploadDir, libraryPreviewsDir } = require("../config/hostDirs");

const Sync = {
  getSyncShare: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select(["sync_share.*", "Personnel.NAME as Share_to_NAME", "Personnel.Email_address as Share_to_Email_address"])
      .from("sync_share")
      .leftJoin("Personnel", "sync_share.Share_to_Person_id", "Personnel.Person_id")
      .where("sync_share.Person_id", where.Person_id)
      .then((r) => r);
  },
  insertSyncSharePersons: async (hostId, persons) => {
    const db = DBManager(hostId);
    return await db("sync_share")
      .insert(persons)
      .then(async (r) => {
        return { result: true, data: await Sync.getSyncShare(hostId, { Person_id: persons[0].Person_id }) };
      });
  },
  deleteSyncSharePersons: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db("sync_share")
      .delete()
      .where(where)
      .then((r) => ({ result: true, data: where }));
  },
  getSyncSharedPersons: async (hostId, Person_id) => {
    const db = DBManager(hostId);
    return await db
      .select([
        "sync_share.*",
        "Personnel.NAME as Share_person_NAME",
        "Personnel.Email_address as Share_person_Email_address",
      ])
      .from("sync_share")
      .leftJoin("Personnel", "sync_share.Person_id", "Personnel.Person_id")
      .where("sync_share.Share_to_Person_id", Person_id)
      .then((r) => r);
  },

  getSyncSchedule: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Sync_Dirs")
      .join("Sync_Dir_Schedule")
      .where("Sync_Dirs.Person_id", where.Person_id)
      .then((r) => r);
  },
  insertSyncSchedule: async (hostId, data) => {
    const db = DBManager(hostId);
    const insert = data.Directories.map((dir) => ({
      Person_id: data.Person_id,
      Computer_id: data.Computer_id,
      Directory_name: dir,
      Sync_time: data.Sync_time,
      Sync_days: data.Sync_days,
    }));

    return await db("Sync_Dir_Schedule")
      .insert(insert)
      .onConflict(["Computer_id", "Directory_name"])
      .merge()
      .then(async (r) => {
        return { result: true, data: await Sync.getSyncSchedule(hostId, { Person_id: data.Person_id }) };
      });
  },
  deleteSyncSchedule: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db("Sync_Dir_Schedule")
      .delete()
      .where(where)
      .then((r) => ({ result: true, data: where }));
  },

  getSyncFiles: async (hostId) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Sync_Files")
      .leftJoin("Files", "Sync_Files.File_id", "Files.File_id")
      .then((r) => r);
  },
  getSyncFile: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Sync_Files")
      .leftJoin("Files", "Sync_Files.File_id", "Files.File_id")
      .where(where)
      .then((r) => r[0]);
  },
  getUserSyncFiles: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Sync_Files")
      .leftJoin("Files", "Sync_Files.File_id", "Files.File_id")
      .where(where)
      .then((r) => r);
  },
  getUserSyncFilesWithLocations: async (hostId, where) => {
    const db = DBManager(hostId);
    
    return await db
      .select("*")
      .from(function(){
        this
        .select(["Sync_Files.*", "Files.Format", "Files.Size", "Files.CREATED_DATE", "File_Locations.File_dir", "File_Locations.File_name as Location_Name"])
        .from("Sync_Files")
        .leftJoin("Files", "Sync_Files.File_id", "Files.File_id")
        .leftJoin('File_Locations', 'Sync_Files.File_id', 'File_Locations.File_id')
        .where({"Sync_Files.Person_id" : where.Person_id, "Sync_Files.Computer_id": where.Computer_id})
        .as("Result")
      })
      .where(where) 
      .groupBy("File_id")     
      .then((r) => r);
  },

  getUserSyncFilesFiltered: async (hostId, Person_id, args) => {
    const db = DBManager(hostId);
    const defaults = {
      where: { Parsing_Step_Key: "PARSED" },
      order: {
        field: "Upload_dt",
        type: "ASC",
      },
      offset: 0,
      limit: 10,
    };

    const persons = await Sync.getSyncSharedPersons(hostId, Person_id);

    if (args.whereIn.find((x) => x.field === "Person_id") === undefined) {
      args.whereIn = [...args.whereIn, { field: "Person_id", values: [Person_id, ...persons.map((x) => x.Person_id)] }];
    }

    const filtered = await filterObj(args, (v, i) => i !== "whereIn" && i !== "whereBetween" && i !== "whereNull");
    const params = { ...defaults, ...filtered };
    params.where = { ...params.where, ...defaults.where};
    const filterWhere = (builder) => {
      if (args.whereIn) {
        args.whereIn.map((row) => {
          builder.where(row.field, "in", row.values);
        });
      }
      if (args.whereBetween) {
        args.whereBetween.map((row) => {
          builder.where(row.field, "between", row.values);
        });
      }
      if (args.like) {
        args.like.map((row) => {
          builder.where(row.field, "like", `%${row.value}%`);
        });
      }
      if (args.whereNull) {
        builder.whereNull(args.whereNull);
      }
    };

    const data = await db
      .select(["Sync_Files.*", "Files.*"])
      .from("Sync_Files")
      .leftJoin("Files", "Sync_Files.File_id", "Files.File_id")
      // .joinRaw  ("File_Locations", "Files.File_id", "File_Locations.File_id")
      .where(params.where)
      .where(filterWhere)
      .orderBy(params.order.field, params.order.type)
      .offset(params.offset)
      .limit(params.limit);

    const length = await db("Sync_Files")
      .count("Upload_dt", { as: "length" })
      .where(params.where)
      .where(filterWhere)
      .then((r) => r[0].length);

    return { data: data, length: length };
  },

  insertSyncFiles: async (hostId, data) => {
    const db = DBManager(hostId);
    const insert = [];

    await data.map((x) => {
      insert.push(
        {
          File_id: x.File_id,
          Format: x.File_ext.replace(".", ""),
          Size: x.File_size,
          CREATED_DATE: x.CREATED_DATE,
        }
      );
    });

    await insertFiles(hostId, insert);

    const locations = [];
    await data.map(async (x) => {
      if (x.File_locations) {
        await x.File_locations.map(async (loc) => {
          locations.push({
            File_id: x.File_id,
            Person_id: x.Person_id,
            Computer_id: x.Computer_id,
            File_name: loc.File_name,
            File_dir: loc.File_dir,
            File_path_hash: await md5(loc),
          });
        });
      }

      locations.push({
        File_id: x.File_id,
        Person_id: x.Person_id,
        Computer_id: x.Computer_id,
        File_name: x.File_name,
        File_dir: x.File_dir,
        File_path_hash: await md5(x.File_path),
      });
    });

    await db("File_Locations").insert(locations).onConflict().merge();

    await db("Sync_Files").insert(
      data.map((x) => ({
        File_id: x.File_id,
        File_name: x.File_name,
        Person_id: x.Person_id,
        Computer_id: x.Computer_id,
        Parsing_Step_Key: "TMP",
        Case_NAME: x.Case_NAME,
      }))
    ).onConflict().merge();

    return { result: true, data: data };
  },
  updateSyncFiles: async (hostId, data) => {
    const db = DBManager(hostId);
    const _results = [];
    if (data && data.length > 0) {
      await db.transaction(async (trx) => {
        for await (let file of data) {
          const response = await trx("Sync_Files")
            .update(file)
            .where({ File_id: file.File_id })
            .then((r) => ({ result: Boolean(r), data: file }));
          _results.push(response);
        }
      });
    }

    return _results;
  },
  updateSyncFile: async (hostId, set, where) => {
    if(set && where){
      const db = DBManager(hostId);
      return await db("Sync_Files").update(set).where(where);
    } else {
      return false;
    }
    
  },
  deleteSyncFiles: async (hostId, where, { trx, disableForeign } = {}) => {
    const db = trx ? trx : DBManager(hostId);
    return await db("Sync_Files")
      .delete()
      .where(where)
      .then((r) => ({ result: true, data: where }));
  },

  getSyncParsingSteps: async (hostId) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Sync_parsing_steps")
      .then((r) => r);
  },
  getPrevSyncParsingStep: async (hostId, Step_Key) => {
    const db = DBManager(hostId);
    return await db
      .select("Step_Key")
      .from("Sync_parsing_steps")
      .where("Next_Step_Key", Step_Key)
      .then((r) => {
        const Prev_Step_Key = r[0].Step_Key;
        return Sync.getSyncParsingStepByKey(hostId, Prev_Step_Key);
      });
  },
  getNextSyncParsingStep: async (hostId, Step_Key) => {
    const db = DBManager(hostId);
    return await db
      .select("Next_Step_Key")
      .from("Sync_parsing_steps")
      .where("Step_Key", Step_Key)
      .then((r) => {
        const Next_Step_Key = r[0].Next_Step_Key;
        return Sync.getSyncParsingStepByKey(hostId, Next_Step_Key);
      });
  },
  getSyncParsingStepByKey: async (hostId, key) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Sync_parsing_steps")
      .where("Step_Key", key)
      .then((r) => r[0]);
  },

  checkSyncFile: async (hostId, fileData, fileInfo, parsingStep) => {
    const fse = require("fs-extra");
    //Data for file is not exists in DB
    if (!fileData) {
      //Remove it
      fse.remove(fileInfo.pathInfo.abspath);
      
      return false;
    }

    const { Person_id, Computer_id, File_id, Parsing_Step_Key, Format: File_ext } = fileData;

    //Parsing Step Key is DIFFERENT
    if (Parsing_Step_Key !== parsingStep) {
      const nextStep = await module.exports.getSyncParsingStepByKey(hostId, Parsing_Step_Key);

      const changeStepResult = await module.exports.changeSyncFileParsingStep(hostId, {
        fileInfo,
        nextStep,
      }, {
        Person_id,
        File_id,
        Computer_id,
      });

      return false;
    }

    return true;
  },

  changeSyncFileParsingStep: async (hostId, { fileInfo = {}, nextStep = {}, set = {} } = {}, where) => {
    const HOST_FOLDER = Path.join(mainHostsDir, hostId);
    const { pathInfo } = fileInfo;

    try {
      const nextFolder = Path.join(HOST_FOLDER, uploadDir, nextStep.Step_folder);
      const newFilePath = Path.join(nextFolder, pathInfo.filename);

      set.Parsing_Step_Key = nextStep.Step_Key;

      await Sync.updateSyncFile(hostId, set, where);

      // console.log(pathInfo)
      if(fs.existsSync(pathInfo.abspath))
        // fs.move(pathInfo.abspath, newFilePath);
        fs.renameSync(pathInfo.abspath, newFilePath);

      

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  saveSyncedFiles: async (hostId, data, res) => {
    const db = DBManager(hostId);
    const HOST_FOLDER = Path.join(mainHostsDir, hostId);
    const result = [];

    await mapStep(
      data,
      async (file, next) => {
        if (file) {
          await db
            .transaction(async (trx) => {
              const tmp = {};

              const fileFolder = Path.join(libraryFilesDir, file.File_id[0]);
              const fileName = `${file.File_id}.${file.Format}`;

              if (!fs.existsSync(Path.join(HOST_FOLDER, fileFolder))) {
                fs.mkdirSync(Path.join(HOST_FOLDER, fileFolder), 0777);
              }

              await trx("Files").update({ Preview_img: file.File_preview }).where({ File_id: file.File_id });

              tmp.insertDocument = await insertDocument(
                hostId,
                {
                  DOCUMENT_NAME: file.File_name,
                  Description: `Document for ${file.File_name}`,
                  Case_NAME: file.Case_NAME,
                  Person_id: file.Person_id,
                  Form: file.Form,
                  CREATED_DATE: file.CREATED_DATE,
                },
                {
                  trx,
                }
              );

              tmp.insertDocumentFiles = await insertDocumentFiles(
                hostId,
                {
                  File_id: file.File_id,
                  DOC_ID: tmp.insertDocument.DOC_ID,
                },
                { trx }
              );

              const DocLocs = [
                {
                  File_id: file.File_id,
                  Person_id: "SERVER",
                  Computer_id: "SERVER",
                  File_name: fileName,
                  File_dir: Path.join(HOST_FOLDER, fileFolder),
                  File_path_hash: md5(Path.join(HOST_FOLDER, fileFolder, fileName)),
                  loaded_dt: file.Upload_dt,
                },
              ];              
          
              tmp.insertDocumentLocations = await insertDocumentLocations(hostId, DocLocs, { trx });

              tmp.removeSyncFile = await Sync.deleteSyncFiles(hostId, { File_id: file.File_id }, { trx });
              const currentStep = await Sync.getSyncParsingStepByKey(hostId, file.Parsing_Step_Key);
              
              fs.renameSync(
                Path.join(HOST_FOLDER, uploadDir, currentStep.Step_folder, file.Server_File_id),
                Path.join(HOST_FOLDER, fileFolder, fileName)
              );

              result.push(tmp);

              next();
            })
            .then(function (resp) {
              // console.log('Transaction complete.');
            })
            .catch(function (err) {
              console.error(err);
            });
        } else {
          next();
        }
        //insertDocKey
        //insertFileVer
      },
      () => {
        res.send(result);
      }
    );
  },
  removeSyncedFiles: async (hostId, data, res) => {
    const result = [];

    await mapStep(
      data,
      async (file, next) => {

        let unlinkFile = false; 
        let unlinkPreview = false;
        
        //Check is file uploaded
        const stepInfo = await Sync.getSyncParsingStepByKey(hostId, "PARSED");
        
        if(file.Upload_dt){
          unlinkFile = fs.existsSync(path.join(mainHostsDir, hostId, uploadDir, stepInfo.Step_folder, file.Server_File_id))
            ? fs.unlinkSync(path.join(mainHostsDir, hostId, uploadDir, stepInfo.Step_folder, file.Server_File_id))
            : { result: false, message: "File is not exists" };
          unlinkPreview = fs.existsSync(path.join(mainHostsDir, hostId, libraryPreviewsDir, file.File_preview))
            ? fs.unlinkSync(path.join(mainHostsDir, hostId, libraryPreviewsDir, file.File_preview))
            : { result: false, message: "File is not exists" };
        }

        const removeDocText = await deleteDocText(hostId, { File_id: file.File_id });
        const removeDocMeta = await deleteDocMetadata(hostId, { File_id: file.File_id });

        const removeData = await Sync.deleteSyncFiles(hostId, {Person_id: file.Person_id, Computer_id: file.Computer_id, File_id: file.File_id});
        result.push({
          file,
          unlinkFile,
          unlinkPreview,
          removeData,
          removeDocText,
          removeDocMeta,
        });

        next();
      },
      () => {
        res.send(result);
      }
    );
  },
  moveAndUpdate: async ({ oldPath, newPath, hostId, set, where }) => {
    try {
      await Sync.updateSyncFile(hostId, set, where);
      if (oldPath && newPath && !fs.existsSync(newPath)) fs.renameSync(oldPath, newPath);
      else if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    } catch (e) {
      console.log(e);
      // await Sync.deleteSyncFiles(hostId, where);
    }
  },

  getSynchronizations: async (hostId) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Synchronizations")
      .then((r) => r);
  },

  getUserSynchronizations: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Synchronizations")
      .where(where)
      .then((r) => r);
  },

  insertSynchronization: async (hostId, data) => {
    const db = DBManager(hostId);

    return await db("Synchronizations")
      .insert(data)
      .then(async (r) => {
        return { result: true, data, Sync_id: r[0] };
      })
      .catch((e) => ({ result: false, error: e, data }));
  },

  updateSynchronization: async (hostId, data) => {
    const db = DBManager(hostId);

    return await db("Synchronizations")
      .update(data)
      .where({Sync_id: data.Sync_id})
      .then(async (r) => {
        return { result: true, data, Sync_id: r[0] };
      })
      .catch((e) => ({ result: false, error: e, data }));
  },

  insertSyncFolder: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Sync_Dirs")
      .insert(data)
      .then(async (r) => {
        return { result: true, data };
      })
      .catch((e) => ({ result: false, error: e, data }));
  },

  getUserSyncFolders: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Sync_Dirs")
      .where(where)
      .then((r) => r);
  },

  insertSyncFolderInfo: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Sync_Info")
      .insert(data)
      .then(async (r) => {
        return { result: true, data };
      })
      .catch((e) => ({ result: false, error: e, data }));
  },

  getUserParseInfo: async (hostId, where) => {
    const db = DBManager(hostId);
    const Steps = await Sync.getSyncParsingSteps(hostId);
    const Shared = await Sync.getSyncSharedPersons(hostId, where.Person_id);
    const Persons = [];
    Shared.map((x) => {
      Persons.push(x.Person_id);
    })

    Persons.push(where.Person_id);

    const result = [];

    await mapStep(Steps, async (x, next) => {
      const Count = await db("Sync_Files").count({Count: "File_id"}).where({Parsing_Step_Key: x.Step_Key}).whereIn('Person_id', Persons).then((r) => r[0].Count);
      result.push({
        Step_Key: x.Step_Key,
        Step_Desc: x.Step_Desc,
        Count 
      });

      await next();
    })

    return result;
  },

  getFileParseInfo: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Parsing_File_Info")
      .leftJoin("Sync_Files", "Parsing_File_Info.File_id", "Sync_Files.File_id")
      .where(where)
      .then(async (r) => {
        await mapStep(r, async (f, next, i, a) => {

          if(f.File_id){
            f.meta = [];
            f.Step_Info = await Sync.getSyncParsingStepByKey(hostId, f.Step_Key);
            // f.File_Info = await getFile(hostId, {File_id: f.File_id});
            f.meta = await getDocMetadata(hostId, {File_id: f.File_id});
            
            a[i] = f;
          }

          await next();
        });

        return r;
      });
  },

  insertFileParseInfo: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Parsing_File_Info")
      .insert(data)
      .then(async (r) => {
        return { result: true, data, r };
      })
      .catch((e) => ({ result: false, error: e, data }));
  },

  updateFileParseInfo: async (hostId, data) => {
    const db = DBManager(hostId);

    return await db("Parsing_File_Info")
      .update(data)
      .where({Step_Key: data.Step_Key})
      .then(async (r) => {
        return { result: true, data, row_id: r[0] };
      })
      .catch((e) => ({ result: false, error: e, data }));
  },
};

module.exports = Sync;
