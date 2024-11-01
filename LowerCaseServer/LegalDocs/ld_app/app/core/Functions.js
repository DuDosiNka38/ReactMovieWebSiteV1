module.exports.mapArray = function* mapArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
} 

module.exports.sleep = async (ms) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 