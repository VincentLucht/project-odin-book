export default function NotificationButton() {
  return (
    <div className="hover:bg-accent-gray bg-hover-transition h-10 w-10 rounded-full df">
      <img
        src="/bell-outline.svg"
        alt="User profile picture"
        className="h-6 w-6 rounded-full"
      />
    </div>
  );
}
