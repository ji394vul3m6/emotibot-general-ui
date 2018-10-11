function createEvent(eventname) {
  let event;
  if (typeof Event === 'function') {
    event = new Event(eventname);
  } else {  // IE 11 do not support Event()
    event = document.createEvent('Event');
    event.initEvent(eventname, false, false);
  }
  return event;
}

export default {
  createEvent,
};
