export interface DBUser {
  id: string;
  username: string;
  email: string;
  password: string;
  display_name: string | null;
  profile_picture_url: string | null;
  description: string | null;
  cake_day: string | null;
  created_at: Date;
  deletedAt: Date | null;
}
