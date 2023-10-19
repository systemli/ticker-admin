// FIXME: Might be better to use a library like validator.js
// to catch more cases.
export const replaceMagic = (text: string): string => {
  return text
    ? text
        .replace(/(https?:\/\/([a-zA-Z0-9._\-/]+))/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
        .replace(/#(\S+)/g, '<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/search?q=%23$1">#$1</a>')
        .replace(/ @(\S+)/g, ' <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/$1">@$1</a>')
        .replace(/([a-zA-Z0-9_\-.]+@[a-zA-Z0-9_-]+.[a-zA-Z]+)/g, '<a href="mailto:$1">$1</a>')
        .replace(/(?:\r\n|\r|\n)/g, '<br/>')
    : ''
}
