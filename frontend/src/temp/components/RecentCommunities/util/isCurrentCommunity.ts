export default function isCurrentCommunity(route: string, communityName: string) {
  return route === `/r/${communityName}` || route.startsWith(`/r/${communityName}/`);
}
