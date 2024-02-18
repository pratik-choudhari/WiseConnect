// not battle tested, but lets use for WinHacks!
// https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
export function urlify(text: string) {
  const urlRegex = /(www?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}
