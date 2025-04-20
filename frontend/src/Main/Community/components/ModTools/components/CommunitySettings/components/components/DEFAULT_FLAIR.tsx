export const DEFAULT_FLAIR_POST = {
  id: 'tempId',
  community_id: '',
  name: '',
  emoji: '',
  textColor: '#ffffff',
  color: '#3b82f6',
  is_assignable_to_users: false,
  is_assignable_to_posts: true,
};

export const DEFAULT_FLAIR_USER = {
  id: 'tempId',
  community_id: '',
  name: '',
  emoji: '',
  textColor: '#ffffff',
  color: '#3b82f6',
  is_assignable_to_users: false,
  is_assignable_to_posts: true,
};

export const getFlairText = (
  mode: 'edit' | 'create' | null,
  flairType: 'user' | 'post',
) => {
  if (mode === 'create') {
    return flairType === 'post'
      ? 'Create post flair'
      : flairType === 'user'
        ? 'Create user flair'
        : 'Edit flair';
  }
  return flairType === 'post'
    ? 'Edit post flair'
    : flairType === 'user'
      ? 'Edit user flair'
      : 'Edit flair';
};
