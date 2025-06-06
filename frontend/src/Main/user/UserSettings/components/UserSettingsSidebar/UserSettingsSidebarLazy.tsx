export default function UserSettingsSidebarLazy() {
  const randomHeight = Math.floor(Math.random() * (335 - 225 + 1)) + 225;

  return (
    <div
      className="skeleton mt-[70px] w-[300px] rounded-2xl"
      style={{ height: `${randomHeight}px` }}
    ></div>
  );
}
