export default function getBaseURL(url: string) {
  const split = url.split('/');
  split.pop();

  let newUrl = '';
  for (const segment of split) {
    newUrl += `${segment}/`;
  }

  return newUrl.slice(0, -1);
}
