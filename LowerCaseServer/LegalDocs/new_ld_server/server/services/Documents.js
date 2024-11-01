const DBManager = require("../lib/DBManager");
const config = require("./../config/config.dev");
const { filterObj, mapObj, mapStep } = require("../lib/Functions");

let DOC_FORMS = null;

const Documents = {
  getFilesHashes: async (hostId) => {
    const db = DBManager(hostId);
    return await db.select("Files.File_id").from("Files").then((r) => (r.map((x) => (x.File_id))));
  },

  getDocument: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select(["Documents.*", "Cases.CaseBg", "Cases.Case_Full_NAME"])
      .from("Documents")
      .join("Cases", "Documents.Case_NAME", "Cases.Case_Short_NAME")
      .where(where)
      .then(async (r) => {
          await mapStep(r, async (x, next, i, a) => {
            if(x){
              a[i].keywords =  await Documents.getDocKeywords(hostId, {DOC_ID: x.DOC_ID});
            }
            next();
          });
          return r;
      }).then((r) => (r.length ? (r.length === 1 ? r[0] : r) : null));
  },
  getDocuments: async (hostId) => {
    const db = DBManager(hostId);
    return await db
      .select(["Documents.*", "Cases.CaseBg"])
      .from("Documents")
      .join("Cases", "Documents.Case_NAME", "Cases.Case_Short_NAME")
      .then(async (r) => {
        await mapStep(r, async (x, next, i, a) => {
          a[i].keywords =  await Documents.getDocKeywords(hostId, {DOC_ID: x.DOC_ID});
          next();
        });
        return r;
      });
  },
  getDocumentsInfo: async (hostId) => {
    const db = DBManager(hostId);
    const response = {
      ...(await db("Documents")
        .count("*", { as: "length" })
        .then((r) => r[0])),
      ...(await db("Documents")
        .min("CREATED_DATE", { as: "CREATED_DATE_START" })
        .then((r) => r[0])),
      ...(await db("Documents")
        .max("CREATED_DATE", { as: "CREATED_DATE_END" })
        .then((r) => r[0])),
    };

    return response;
  },

  getDocumentFiles: async (hostId, where) => {
    const db = DBManager(hostId);
    const Doc_files = await db
      .select(["Doc_files.*", "Files.*"])
      .from("Doc_files")
      .leftJoin("Files", "Doc_files.File_id", "Files.File_id")
      .where(where)
      .then(async (r) => {
        await mapStep(r, async (x, next, i, a) => {
          if(x){
            a[i].meta = await db.select("*").from("File_Metadata").where({File_id: x.File_id}).then(async (res) => {
              // const result = {};
              // await r.map((x) => {
              //   result[x.Param_name] = x.Value;
              // });

              return await res.map((x) => ({Name: x.Name, Value: x.Value}));
            });
            a[i].locations = await db.select("*").from("File_Locations").where({File_id: x.File_id}).then((res) => {
              return res;
            });

            a[i].IN_PARSE = await db("Sync_Files").count("*", {as: "Count"}).where({File_id: x.File_id}).then((r) => {
              return Boolean(r[0].Count);
            })
          }
          await next();
        });

        return r;
      });

    return Doc_files;
  },
  getDocumentEvents: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db.select(["Activity_Docs_Xref.*", "Activities.*"]).from("Activity_Docs_Xref").join("Activities", "Activity_Docs_Xref.Activity_Name", "Activities.Activity_Name").where("Activity_Docs_Xref.DOC_ID", where.DOC_ID);
  },
  getFilteredDocuments: async (hostId, args) => {
    const db = DBManager(hostId);
    const defaults = {
      where: 1,
      order: {
        field: "DOC_ID",
        type: "ASC",
      },
      offset: 0,
      limit: 10,
    };


    const filtered = await filterObj(args, (v, i) => i !== "whereIn" && i !== "whereBetween" && i !== "whereNull");
    const params = { ...defaults, ...filtered };
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
      if(args.like){
        args.like.map((row) => {
          builder.where(row.field, "like", `%${row.value}%`);
        });
      }
    };

    const selectFunction = (builder) => {
      const selectValues = [];
          selectValues.push("Documents.*");

          if(args.like && args.like.find((x) => x.field === "Text")){
            selectValues.push("File_Text.File_id", "File_Text.Page", "File_Text.Text");
          }

          if(args.like && args.like.find((x) => x.field === "KEYWORDS")){
            selectValues.push("Doc_Keywords.KEYWORDS");
          }

          if(args.like && args.like.find((x) => x.field === "Activity_Title")){
            selectValues.push("Activities.Activity_Title");
          }

          if(args.like && args.like.find((x) => x.field === "Comments")){
            selectValues.push("Activities.Comments");
          }
          
          builder
            .select(selectValues)
            .from("Doc_files")
            .leftJoin("Documents", "Doc_files.DOC_ID", "Documents.DOC_ID");
            
            // .leftJoin("Files", "Doc_files.File_id", "Files.File_id")\

          if(args.like && args.like.find((x) => x.field === "Text"))
            builder.leftJoin("File_Text", "Doc_files.File_id", "File_Text.File_id");

          if(args.like && args.like.find((x) => x.field === "KEYWORDS"))
            builder.leftJoin("Doc_Keywords", "Doc_files.DOC_ID", "Doc_Keywords.DOC_ID");

          if(args.like && args.like.find((x) => x.field === "Activity_Title" || x.field === "Comments")){
            builder.leftJoin("Activity_Docs_Xref", "Doc_files.DOC_ID", "Activity_Docs_Xref.DOC_ID");
            builder.leftJoin("Activities", "Activity_Docs_Xref.Activity_Name", "Activities.Activity_Name");
          }
          
            builder.as("Search");
    }


    const data = await db
      .select("*")
      .from(function(){
        this.select(["Search.CREATED_DATE", "Search.Case_NAME", "Search.DOCUMENT_NAME", "Search.DOC_ID", "Search.Description", "Search.FILED_DATE", "Cases.CaseBg", "Cases.Case_Full_NAME"])
        .from(selectFunction)
        .join("Cases", "Search.Case_NAME", "Cases.Case_Short_NAME")
        .where(params.where)
        .where(filterWhere)
        .as("Result");
      })
      .orderBy(params.order.field, params.order.type)
      .offset(params.offset)
      .limit(params.limit)
      .groupBy("DOC_ID");

    const total = await db
    .select("*")
    .from(function(){
      this.select(["Search.*"])
      .from(selectFunction)
      .where(params.where)
      .where(filterWhere)
      .as("Result");
    })
    .groupBy("DOC_ID");   

    return {data: data, length: total.length};
  },
  getCaseDocuments: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db.select(["Documents.*", "Cases.CaseBg"]).from("Documents").join("Cases", "Documents.Case_NAME", "Cases.Case_Short_NAME").where(where);
  },
  insertDocument: async (hostId, docData, {trx, disableForeign} = {trx: false, disableForeign: false}) => {
    try {
      const db = trx ? trx : DBManager(hostId);
        
      return await db("Documents")
        .insert(docData)
        .then(async (r) => {
          // const DOC_ID = await db.select("DOC_ID").from("Documents").where(docData).then((r) => (r.length === 1 ? r[0].DOC_ID : null));
          return { result: true, data: docData, DOC_ID: r[0] };
        });
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },
  updateDocument: async (hostId, data, DOC_ID) => {
    const db = DBManager(hostId);
    return await db("Documents").update(data).where({ DOC_ID: DOC_ID }).then((r) => ({result: true, data: DOC_ID}));
  },
  deleteDocument: async (hostId, docData) => {
    const db = DBManager(hostId);
    return await db("Documents")
      .delete()
      .where(docData)
      .then((r) => ({ result: true, data: docData }));
  },

  insertDocumentFiles: async (hostId, data, {trx, disableForeign} = {trx: false, disableForeign: false}) => {
    try {
      const db = trx ? trx : DBManager(hostId);
        
      return await db("Doc_files")
        .insert(data)
        .onConflict("File_id")
        .merge()
        .then((r) => {
          return { result: true, data: data };
        });
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },

  getFiles: async (hostId, where = {}, whereNot = {}) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Files").where(where).whereNot(whereNot);
  },

  getFile: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Files").where(where).limit(1).then((r) => (r.length ? r[0] : null));
  },

  insertFiles: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Files").insert(data).onConflict().merge();
  },

  updateFile: async (hostId, data, File_id) => {
    const db = DBManager(hostId);
    return await db("Files").update(data).where({ File_id }).then((r) => ({result: true, data: File_id}));
  },

  getDocumentsLocations: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("File_Locations")
      .where(where).then(async (r) => {
        const result = [];

        await mapStep(r, async (item, next) => {
          if(item && item.File_id){
            item.versions = await Documents.getFileVersions(hostId, {Original_version_File_id: item.File_id});
            result.push(item);
          }

          
          await next();
        })
        // const result = await r.map(async (item) => {
        //   console.log(item)
        //   item.hashes = await this.getFileVersions(hostId, {Original_file_File_id: item.File_id});
        //   return item;
        // });

        return result;
      });
  },
  getDocumentsActiveLocations: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("File_Locations")
      .where({...where, removed_dt: null});
  },
  insertDocumentLocations: async (hostId, data, params) => {
    try {
      const db = params && params.trx ? params.trx : DBManager(hostId);
        
      return await db("File_Locations")
        .insert(data)
        .then((r) => {
          return { result: true, data: data };
        });
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },

  insertFileLocation: async (hostId, data) => {
    return await Documents.insertDocumentLocations(hostId, [data]);
  },

  updateFileLocation: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("File_Locations").update(data).where({ File_id:  data.File_id, Computer_id: data.Computer_id, Person_id: data.Person_id}).then((r) => ({result: true, data}));
  },

  getFileVersions: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db.select("File_id").from("File_Versions").where(where).then((r) => (r.map((x) => (x.File_id))));
  },

  insertFileVersion: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("File_Versions").insert(data);
  },

  getFileDocument: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select("*")
      .from("Doc_files")
      .where(where)
      .limit(1)
      .then((r) => (r.length ? r[0] : null));
  },

  getDocTexts: async (hostId) => {
    const db = DBManager(hostId);
    return await db.select("*").from("File_Text");
  },
  getDocText: async (hostId, where) => {
    const db = DBManager(hostId);
    let like = [true];

    if(where._like){
      like = [];
      like.push(where._like.field, "LIKE", where._like.value);
    }

    let filtered = {};

    await filterObj(where, (v, i) => {
      if(i[0] !== "_"){
        filtered[i] = v;
      }
    });
    
    return await db.select("*").from("File_Text").where(filtered).andWhere(...like).then((r) => (!r.length ? null : r));
  },
  insertDocText: async (hostId, docData, {trx = false, disableForeign = false} = {}) => {
    const db = trx ? trx : DBManager(hostId);

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 0");

    const result = await db("File_Text")
      .insert(docData)
      .onConflict(["File_id", "Page_number"])
      .merge()
      .then((r) => {
        return { result: true, data: docData };
      });

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 1");

    return result;
  },
  deleteDocText: async (hostId, docData, {trx = false, disableForeign = false} = {}) => {
    const db = trx ? trx : DBManager(hostId);

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 0;");
      
    const response = await db("File_Text")
      .delete()
      .where(docData)
      .then((r) => ({ result: true, data: docData }));

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 0;");

    return response;
  },

  getDocMetadata: async(hostId, data, {trx = false, disableForeign = false} = {}) => {
    try {
      const db = trx ? trx : DBManager(hostId);

      if(disableForeign)
        await db.raw("SET foreign_key_checks = 0;");
        
      const response = await db
        .select("*")
        .from("File_Metadata")
        .where(data)
        .then((r) => (r.length ? (r.length === 1 ? r[0] : r) : null));      

      if(disableForeign)
        await db.raw("SET foreign_key_checks = 0;");

      return response;
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },  
  insertDocMetadata: async (hostId, data, {trx = false, disableForeign = false} = {}) => {
    try {
      const db = trx ? trx : DBManager(hostId);

      if(disableForeign)
        await db.raw("SET foreign_key_checks = 0;");
        
      const response = await db("File_Metadata")
        .insert(data)
        .onConflict("File_id")
        .merge()
        .then((r) => {
          return { result: true, data: data };
        });      

      if(disableForeign)
        await db.raw("SET foreign_key_checks = 0;");

      return response;
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },
  deleteDocMetadata: async (hostId, docData, {trx = false, disableForeign = false} = {}) => {
    const db = trx ? trx : DBManager(hostId);

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 0;");
      
    const response = await db("File_Metadata")
      .delete()
      .where(docData)
      .then((r) => ({ result: true, data: docData }));

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 0;");

    return response;
  },

  getDocForms: async (hostId) => {
    const db = DBManager(hostId);
    if(DOC_FORMS === null)
      DOC_FORMS = await db.select("*").from("File_Forms");

    return DOC_FORMS;
  },
  insertDocForm: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("File_Forms").insert(data);
  },
  insertDocFormText: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("File_Form_Text").insert(data);
  },

  detectFileForm: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db.raw("CALL GET_FORM(?)", where.Text).then(async (r) => {
      if(!r[0][0][0].Form) return false;
      const result = r[0][0];
      let form = null;
      let score = null;

      await mapStep(result, async (f, next, i) => {
        if(where.Text.toUpperCase().indexOf(f.Form) !== -1){
          if(!form) form = f.Form;

          if(form && f.score > result.find((x) => x.Form === form).score){
            form = f.Form;
          }
        }

        await next();
      });

      return form ? {Form: form, score: result.find((x) => x.Form === form).score} : null;
    }).catch((e) => (e));
  },

  getAllDocKeywords: async (hostId) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Doc_Keywords").then((r) => (r.map((x) => (x.KEYWORDS))));
  },
  getDocKeywords: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Doc_Keywords").where(data).then((r) => (r.map((x) => (x.KEYWORDS))));
  },
  insertDocKeywords: async (hostId, data, {trx = false, disableForeign = false} = {}) => {
    try {
      const db = trx ? trx : DBManager(hostId);

      if(disableForeign)
        await db.raw("SET foreign_key_checks = 0;");
        
      const response = await db("Doc_Keywords")
        .insert(data)
        .onConflict("DOC_ID")
        .merge()
        .then((r) => {
          return { result: true, data: data };
        });      

      if(disableForeign)
        await db.raw("SET foreign_key_checks = 0;");

      return response;
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },
  deleteDocKeywords: async (hostId, data, {trx = false, disableForeign = false} = {}) => {
    const db = trx ? trx : DBManager(hostId);

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 0;");
      
    const response = await db("Doc_Keywords")
      .delete()
      .where(data)
      .then((r) => ({ result: true, data }));

    if(disableForeign)
      await db.raw("SET foreign_key_checks = 0;");

    return response;
  },

  getLastCheckLocations: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db.select("Check_Date").from("Check_Locations").where(data).orderBy("Check_Date", "DESC").limit(1);
  },

  insertCheckLocations: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Check_Locations").insert(data).onConflict().merge();
  }
};

module.exports = Documents;
