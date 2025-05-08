import { NotificationType } from '@/interface/dbSchema';

/**
 * Determines whether a notification should be clickable.
 */
export default function getNavigationLink(
  notificationType: NotificationType,
  link?: string,
): string | false {
  if (
    (notificationType === 'POSTREPLY' || notificationType === 'COMMENTREPLY') &&
    link
  ) {
    return link;
  }

  return false;
}
