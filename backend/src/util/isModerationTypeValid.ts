export default function isModerationTypeValid(type: string) {
  return type === 'APPROVED' || type === 'REMOVED';
}
