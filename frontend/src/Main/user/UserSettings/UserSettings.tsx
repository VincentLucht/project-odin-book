import useAuthGuard from '@/context/auth/hook/useAuthGuard';

export default function UserSettings() {
  const { user } = useAuthGuard();

  return <div>User Settings</div>;
}
