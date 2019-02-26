function paddingNumToTwo(num) {
  return num >= 10 ? num.toString() : `0${num}`;
}

function datetimeToString(date) {
  const time = new Date(date);

  if (isNaN(time.getTime())) {
    return '';
  }

  const month = paddingNumToTwo(time.getMonth() + 1);
  const day = paddingNumToTwo(time.getDate());
  const hour = paddingNumToTwo(time.getHours());
  const min = paddingNumToTwo(time.getMinutes());
  const sec = paddingNumToTwo(time.getSeconds());

  return `${time.getFullYear()}/${month}/${day} ${hour}:${min}:${sec}`;
}

function dateToString(date) {
  const month = paddingNumToTwo(date.getMonth() + 1);
  const day = paddingNumToTwo(date.getDate());

  return `${date.getFullYear()}${month}${day}`;
}

export default {
  datetimeToString,
  dateToString,
};
