export default function isValidName(name: string) {
  const validNameRegex = /^[a-zA-Z0-9_]+$/;
  return validNameRegex.test(name);
}
