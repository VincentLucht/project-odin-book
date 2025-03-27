/**
 * Returns a number between 1-4, but with a large bias towards the first numbers. 1 has 50%, 2 has 35%, 3 has 10%, 4 has 5%
 */
export default function getBiasedRandomNumber() {
  const random = Math.random();

  if (random < 0.4) return 1; // 50% chance
  if (random < 0.8) return 2; // 35% chance
  if (random < 0.95) return 3; // 10% chance
  return 4; // 5% chance
}
