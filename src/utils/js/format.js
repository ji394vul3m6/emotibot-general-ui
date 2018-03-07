function datetimeToString(date) {
  if (typeof date !== 'string') {
    return '';
  }
  const time = new Date(date);

  const month = this.paddingNumToTwo(time.getMonth() + 1);
  const day = this.paddingNumToTwo(time.getDate());
  const hour = this.paddingNumToTwo(time.getHours());
  const min = this.paddingNumToTwo(time.getMinutes());
  const sec = this.paddingNumToTwo(time.getSeconds());

  return `${time.getFullYear()}/${month}/${day} ${hour}:${min}:${sec}`;
}

export default {
  datetimeToString,
};
