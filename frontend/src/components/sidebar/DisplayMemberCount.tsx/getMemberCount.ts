export default function getMemberCount(memberCount: number) {
  if (memberCount < 1000) {
    return memberCount;
  } else if (memberCount >= 1000000 && memberCount < 10000000) {
    // 1 mil to 99 mil
    const first = parseInt(memberCount.toString().substring(0, 1));
    const second = parseInt(memberCount.toString().substring(1, 2));
    if (second > 0) {
      return `${first}.${second}M`;
    } else {
      return `${first}M`;
    }
  } else if (memberCount >= 10000000) {
    // 100+ mil
    const firstThreeDigits = parseInt(memberCount.toString().substring(0, 3));
    return `${firstThreeDigits}M`;
  } else {
    // thousands
    const firstTwoDigits = parseInt(memberCount.toString().substring(0, 2));
    return `${firstTwoDigits}K`;
  }
}
