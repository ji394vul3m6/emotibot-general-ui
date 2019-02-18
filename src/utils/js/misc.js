function useIE() {
  // for Now, detect IE 11 and Edge only, other IE version will has no support
  return (navigator.appName === 'Microsoft Internet Explorer' ||
    !!(navigator.userAgent.match(/Trident/) ||
    navigator.userAgent.match(/rv:11/) ||
    navigator.userAgent.match(/Edge/)));
}

function isEllipsisActive(elem) {
  // Check whether text ellipsis is active
  return elem.offsetWidth < elem.scrollWidth;
}

function downloadRawFile(blobData, filename) {
  if (blobData != null && navigator.msSaveBlob) {
    navigator.msSaveBlob(blobData, filename);
    return;
  }
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blobData);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}

const passKeys = [
  16, // shift
  17, // ctrl
  18, // alt
  91, // meta
  93, // meta
  9, // tab
  20, // caps lock
];
// e is keyboard event, check if press controll key only
function controlKeyOnly(e) {
  for (let i = 0; i < passKeys.length; i += 1) {
    if (e.keyCode === passKeys[i]) {
      return true;
    }
  }
  return false;
}

function getBrowserLanguage() {
  const browserLanguage = window.navigator.language;
  const validZHTW = ['zh-TW', 'zh-HK'];

  return validZHTW.find(i18n => i18n === browserLanguage) ? 'zh-tw' : 'zh-cn';
}

function copyToClipboard(text) {
  const input = document.createElement('input');
  input.value = text;
  const body = document.querySelector('body');
  body.append(input);

  input.select();
  document.execCommand('copy');
  input.remove();
}

// eslint-disable-next-line
document.head || (document.head = document.getElementsByTagName('head')[0]);
function changeFavicon(src) {
  const link = document.createElement('link');
  const oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}

export default {
  useIE,
  isEllipsisActive,
  downloadRawFile,
  controlKeyOnly,
  getBrowserLanguage,
  copyToClipboard,
  changeFavicon,
};
