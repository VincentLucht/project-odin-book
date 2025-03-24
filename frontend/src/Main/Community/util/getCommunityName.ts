export default function getCommunityName(url: string) {
  const split = url.split('/');
  const communityName = split[2];
  return communityName;
}
