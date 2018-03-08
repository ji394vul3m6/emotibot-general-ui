function paddingNumToTwo(num) {
  return num >= 10 ? num.toString() : `0${num}`;
}

function datetimeToString(date) {
  if (typeof date !== 'string') {
    return '';
  }
  const time = new Date(date);

  const month = paddingNumToTwo(time.getMonth() + 1);
  const day = paddingNumToTwo(time.getDate());
  const hour = paddingNumToTwo(time.getHours());
  const min = paddingNumToTwo(time.getMinutes());
  const sec = paddingNumToTwo(time.getSeconds());

  return `${time.getFullYear()}/${month}/${day} ${hour}:${min}:${sec}`;
}

export default {
  datetimeToString,
};
