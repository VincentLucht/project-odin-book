export default function isSortByValid(type: string) {
  return type === 'new' || type === 'top' || type === 'hot';
}

export function isSortByValidUser(type: string) {
  return type === 'new' || type === 'top';
}
