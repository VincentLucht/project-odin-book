export default function CreateButton() {
  return (
    <div className="hover:bg-accent-gray bg-hover-transition h-10 w-10 rounded-full df">
      <img
        src="/plus.svg"
        alt="User profile picture"
        className="h-8 w-8 rounded-full"
      />
    </div>
  );
}
