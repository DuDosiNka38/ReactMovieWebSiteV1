export const filterObj = (obj, cb) => {
  let retObj = {};

  for(let k in obj){
      if(cb(obj[k], k, obj)){
          retObj[k] = obj[k];
      }
  }

  return retObj;
}

export const getSecondsToday = () => {
  let d = new Date();
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

export const convertBytesToNormal = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes !== 0) {
    const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  } else {
    return 0;
  }
}

export const getCurrentTimestamp = function () {
  return Math.ceil(Date.now() / 1000);
}

export const secToTime = function (sec) {
  var sec_num = parseInt(sec, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}

export const mapStep = async (data, cbSuccess, cbEnd, i, total) => {
  if (i === null || i === undefined) i = 0;

  if (total === null || total === undefined) total = data.length;

  if (cbSuccess !== null && cbSuccess !== undefined && data[i]) {
    await cbSuccess(data[i], async (index) => {
      i = index || ++i;
      if (i < total) {
        await mapStep(data, cbSuccess, cbEnd, i, total);
      } else {
        if (cbEnd !== null && cbEnd !== undefined) cbEnd();
      }
    });
  }
}

export const mapPartedStep = async (data, partSize, cbSuccess, cbEnd, i, total) => {
  if (i === null || i === undefined) i = 0;

  if (partSize === null || partSize === undefined) partSize = 100;

  if (total === null || total === undefined) total = Math.ceil(data.length / partSize);

  if (cbSuccess !== null && cbSuccess !== undefined) {
    cbSuccess(data.slice(i * partSize, i * partSize + partSize), async () => {
      if (++i < total) {
        await mapPartedStep(data, partSize, cbSuccess, cbEnd, i, total);
      } else {
        if (cbEnd !== null && cbEnd !== undefined) cbEnd();
      }
    });
  }
}