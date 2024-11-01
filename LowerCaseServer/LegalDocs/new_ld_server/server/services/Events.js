const DBManager = require("../lib/DBManager");
var knex = require("knex");
const { filterObj } = require("../lib/Functions");

const get = (hostId) => {
  const db = DBManager(hostId);
  return db
    .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME"])
    .from("Activities")
    .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
    .toString();
}

const Events = {
  getEvent: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"])
      .from("Activities")
      .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
      .join("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type")
      .where(where)
      .then((r) => (r.length === 1 ? r[0] : {}));
  },

  getEventsInfo: async (hostId) => {
    const db = DBManager(hostId);
    const response = {
      ...(await db("Activities")
        .count("*", { as: "length" })
        .then((r) => r[0])),
      ...(await db("Activities")
        .min("Tentative_date", { as: "MIN_DATE" })
        .then((r) => r[0])),
      ...(await db("Activities")
        .max("Tentative_date", { as: "MAX_DATE" })
        .then((r) => r[0])),
    };

    return response;
  },

  getEvents: async (hostId) => {
    const db = DBManager(hostId);
    return await db
    .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"])
    .from("Activities")
    .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
    .join("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type");
  },

  getChildEvents: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
    .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"])
    .from("Activities")
    .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
    .join("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type")
    .where(where);
  },

  getParentEvent: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
    .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"])
    .from("Activities")
    .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
    .join("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type")
    .where(where);
  },

  getCaseEvents: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
    .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"])
    .from("Activities")
    .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
    .join("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type")
    .where("Activities.Case_NAME", where.Case_NAME);
  },

  getUserEvents: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"])
      .from("Activities")
      .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
      .join("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type")
      .where((builder) => {
        builder.where("Activities.Case_NAME", "IN", db.select("Case_NAME").from("Case_Participants").where("Person_id", where.Person_id))          
      });
  },

  getUserUpcomingEvents: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select(["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"])
      .from("Activities")
      .join("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
      .join("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type")
      .where((builder) => {
        builder.where("Activities.Case_NAME", "IN", db.select("Case_NAME").from("Case_Participants").where("Person_id", where.Person_id))          
      })
      .where((builder) => {
        builder.where("Activities.Time_estimate_days", ">=", "DATEDIFF(Activities.Tentative_date, CURDATE())")          
      });
  },

  getFilteredEvents: async (hostId, where) => {
    const db = DBManager(hostId);
    const defaults = {
      where: 1,
      order: {
        field: "Tentative_date",
        type: "ASC",
      },
      offset: 0,
      limit: 10,
    };

    const args = where;

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
      const selectValues = ["Activities.*", "Cases.CaseBg", "Cases.Case_Full_NAME", "Activity_types.Description as Activity_type_Description"];
      
      if(args.like && args.like.find((x) => x.field === "Text")){
        selectValues.push("File_Text.File_id", "File_Text.Page", "File_Text.Text");
      }

      if(args.like && args.like.find((x) => x.field === "KEYWORDS")){
        selectValues.push("Doc_Keywords.KEYWORDS");
      }

      if(args.like && args.like.find((x) => x.field === "DOCUMENT_NAME")){
        selectValues.push("Documents.DOCUMENT_NAME");
      }
      
      builder
        .select(selectValues)
        .from("Activities")
        .leftJoin("Cases", "Activities.Case_NAME", "Cases.Case_Short_NAME")
        .leftJoin("Activity_types", "Activity_types.Activity_type", "Activities.Activity_type");

      if(args.like && args.like.find((x) => x.field === "DOCUMENT_NAME" || x.field === "KEYWORDS" || x.field === "Text")){
        builder.leftJoin("Activity_Docs_Xref", "Activities.Activity_Name", "Activity_Docs_Xref.Activity_Name");
        builder.leftJoin("Documents", "Activity_Docs_Xref.DOC_ID", "Documents.DOC_ID");
      }

      if(args.like && args.like.find((x) => x.field === "KEYWORDS")){
        builder.leftJoin("Doc_Keywords", "Documents.DOC_ID", "Doc_Keywords.DOC_ID");
      }

      if(args.like && args.like.find((x) => x.field === "Text")){
        builder.leftJoin("Doc_files", "Doc_files.DOC_ID", "Documents.DOC_ID");
        builder.leftJoin("File_Text", "Doc_files.File_id", "File_Text.File_id");
      }
      
      builder.as("Search");
    }


    const data = await db
      .select("*")
      .from(function(){
        this.select("*")
        .from(selectFunction)
        .where(params.where)
        .where(filterWhere)
        // .where("Activities.Case_NAME", "IN", db.select("Case_NAME").from("Case_Participants").where("Person_id", where.Current_Person_id))
        .as("Result");
      })
      .groupBy("Activity_Name")
      .orderBy(params.order.field, params.order.type)
      .offset(params.offset)
      .limit(params.limit);

    const total = await await db
    .select("*")
    .from(function(){
      this.select("*")
      .from(selectFunction)
      .where(params.where)
      .where(filterWhere)
      // .where("Activities.Case_NAME", "IN", db.select("Case_NAME").from("Case_Participants").where("Person_id", where.Current_Person_id))
      .as("Result");
    })
    .groupBy("Activity_Name");

    return {data: data, length: total.length};
  },

  getEventChain: async (hostId, where) => {
    const db = DBManager(hostId);
    
    return await db.raw("CALL GET_EVENT_CHAIN(?)", where.Activity_Name).then((r) => {
      console.log({r})
      return r[0];
      return r[0][0];
    });
  },

  getClosestEvents: async (hostId, where) => {
    const db = DBManager(hostId);
    
    return await db.raw("CALL GET_INTERVAL_EVENTS(?, ?)", [where.Person_id, where.Date_End]).then((r) => {
      return r[0][0];
    });
  },
    
  insertEvent: async (hostId, eventData) => {
    try {
      const db = DBManager(hostId);
      return await db("Activities")
        .insert({...eventData, Activity_Name: eventData.Activity_Name.replace(" ", "_"), Activity_Title: eventData.Activity_Name})
        .then((r) => {
          return { result: true, data: eventData };
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

  getEventDocuments: async (hostId, Activity_Name) => {
    const db = DBManager(hostId);
    return await db
      .select(["Activity_Docs_Xref.Relation_type", "Documents.*", "Cases.CaseBg", "Cases.Case_Full_NAME"])
      .from("Activity_Docs_Xref")
      .leftJoin("Documents", "Activity_Docs_Xref.DOC_ID", "Documents.DOC_ID")
      .leftJoin("Cases", "Documents.Case_NAME", "Cases.Case_Short_NAME")
      .where("Activity_Docs_Xref.Activity_Name", Activity_Name);
  },

  updateEvent: async (hostId, Activity_Name, data) => {
    const db = DBManager(hostId);
    return await db("Activities").update(data).where({Activity_Name}).then((r) => ({result: true, data: data}));
  },
    
  deleteEvent: async (hostId, eventData) => {
    const db = DBManager(hostId);
    return await db("Activities").delete().where(eventData).then((r) => ({result: true, data: eventData}));
  },

  insertEventDocument: async (hostId, data) => {
    try {
      const db = DBManager(hostId);
      return await db("Activity_Docs_Xref")
        .insert(data)
        .then((r) => {
          return { result: true, data };
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

  updateEventDocument: async (hostId, Activity_Name, DOC_ID, data) => {
    const db = DBManager(hostId);
    return await db("Activity_Docs_Xref").update(data).where({Activity_Name, DOC_ID}).then((r) => ({result: true, data: data}));
  },
    
  deleteEventDocument: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Activity_Docs_Xref").delete().where(data).then((r) => ({result: true, data: data}));
  },
};

module.exports = Events;
