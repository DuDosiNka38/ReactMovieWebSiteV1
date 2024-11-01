const si = require("systeminformation");
filterObj = async (obj, cb) => {
  let retObj = {};

  for (let k in obj) {
    if (await cb(obj[k], k, obj)) {
      retObj[k] = obj[k];
    }
  }

  return retObj;
};

mapStep = async (data, cbSuccess, cbEnd, i, total) => {
  if (i === null || i === undefined) i = 0;

  if (total === null || total === undefined) total = data.length;

  if (cbSuccess !== null && cbSuccess !== undefined) {
    await cbSuccess(
      data[i],
      async (index) => {
        i = index || ++i;
        if (i < total) {
          await mapStep(data, cbSuccess, cbEnd, i, total);
        } else {
          if (cbEnd !== null && cbEnd !== undefined) cbEnd();
        }
      },
      i,
      data
    );
  }
};
showModuleInfo = async (module, filterFields) => {
  const result = await si[module]();

  if (filterFields) {
    await mapStep(result, async (x, next, i, a) => {
      a[i] = await filterObj(x, (v, k) => filterFields.includes(k));
      await next();
    });
  }

  console.log(result);
};
module.exports = { si, showModuleInfo };
