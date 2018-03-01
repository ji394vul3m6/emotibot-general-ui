function useIE() {
  // for Now, detect IE 11 and Edge only, other IE version will has no support
  return (navigator.appName === 'Microsoft Internet Explorer' ||
    !!(navigator.userAgent.match(/Trident/) ||
    navigator.userAgent.match(/rv:11/) ||
    navigator.userAgent.match(/Edge/)));
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

export default {
  useIE,
  downloadRawFile,
};
