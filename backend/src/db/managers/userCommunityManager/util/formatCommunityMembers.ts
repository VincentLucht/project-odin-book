/** Formats prisma and raw sql data into a FetchedCommunityMember object. */
export default function formatCommunityMembers(
  members: any[],
  mode: 'users' | 'moderators' | 'banned' | 'approved',
) {
  return members.map((member) => {
    const user = member.user || member;
    const isRawSQL = !member.user;

    const formatted: any = {
      id: member.id,
      user: {
        username: isRawSQL ? member.username : user.username,
        profile_picture_url: isRawSQL
          ? member.profile_picture_url
          : user.profile_picture_url,
      },
    };

    // Add mode-specific fields
    if (mode === 'users') {
      formatted.joined_at = member.joined_at;
      formatted.role = member.role;

      if (isRawSQL) {
        formatted.is_moderator = member.is_moderator;
        formatted.approved_at = member.approved_at;
      } else {
        formatted.is_moderator =
          user.community_moderator?.[0]?.is_active || null;
        formatted.approved_at = user.approved_users?.[0]?.approved_at || null;
      }
    } else if (mode === 'moderators') {
      formatted.created_at = member.created_at;

      if (isRawSQL) {
        formatted.approved_at = member.approved_at;
      } else {
        formatted.approved_at = user.approved_users?.[0]?.approved_at || null;
      }
    } else if (mode === 'banned') {
      formatted.banned_at = member.banned_at;
      formatted.ban_reason = member.ban_reason;
      formatted.ban_duration = member.ban_duration;
    } else if (mode === 'approved') {
      formatted.approved_at = member.approved_at;

      if (isRawSQL) {
        formatted.is_moderator = member.is_moderator;
      } else {
        formatted.is_moderator =
          user.community_moderator?.[0]?.is_active || null;
      }
    }

    return formatted;
  });
}
