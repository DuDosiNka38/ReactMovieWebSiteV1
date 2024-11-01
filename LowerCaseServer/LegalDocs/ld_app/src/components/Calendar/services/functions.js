

const countDays = (startStr, endStr) => {
  return Math.abs(
    (Date.parse(endStr) - Date.parse(startStr)) / (60 * 60 * 24 * 1000)
  );
};

const countWorkDays = (startStr, endStr) => {
  const weekends = [0, 6];
  const DAY = 60 * 60 * 24 * 1000;
  const numDays = countDays(startStr, endStr);
  const startDate = Date.parse(startStr);
  let WORK = 0;

  for (let i = 0; i < numDays; ++i) {
    let curDay = startDate + i * DAY;
    let utcDay = new Date(curDay).getDay();

    if (!weekends.includes(utcDay)) WORK += 1;
  }

  return WORK;
};

export default { countDays, countWorkDays };
