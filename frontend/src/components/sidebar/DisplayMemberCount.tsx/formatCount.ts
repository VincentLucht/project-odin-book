export default function formatCount(count: number) {
  if (count < 0) {
    // less than 0
    return 0;
  }
  if (count < 1000) {
    // less than 1K
    return count;
  } else if (count >= 1000 && count < 1000000) {
    // 1K to 999K
    const firstDigits = Math.floor(count / 1000);
    const decimal = Math.floor((count % 1000) / 100);
    if (decimal > 0) {
      return `${firstDigits}.${decimal}K`;
    } else {
      return `${firstDigits}K`;
    }
  } else if (count >= 1000000 && count < 10000000) {
    // 1M to 9.9M
    const first = Math.floor(count / 1000000);
    const second = Math.floor((count % 1000000) / 100000);
    if (second > 0) {
      return `${first}.${second}M`;
    } else {
      return `${first}M`;
    }
  } else if (count >= 10000000 && count < 1000000000) {
    // 10M to 999M
    const millions = Math.floor(count / 1000000);
    return `${millions}M`;
  } else {
    // 1B+
    const billions = Math.floor(count / 1000000000);
    const decimal = Math.floor((count % 1000000000) / 100000000);
    if (decimal > 0) {
      return `${billions}.${decimal}B`;
    } else {
      return `${billions}B`;
    }
  }
}
