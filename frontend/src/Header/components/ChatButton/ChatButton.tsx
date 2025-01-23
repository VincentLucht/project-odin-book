export default function ChatButton() {
  return (
    <div className="hover:bg-accent-gray bg-hover-transition h-10 w-10 rounded-full df">
      <img
        src="/chat-processing-outline.svg"
        alt="User profile picture"
        className="h-7 w-7 rounded-full"
      />
    </div>
  );
}
