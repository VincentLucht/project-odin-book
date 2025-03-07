export default function getCommunityName(url: string) {
  const communityName = url.slice(3);
  return communityName;
}
