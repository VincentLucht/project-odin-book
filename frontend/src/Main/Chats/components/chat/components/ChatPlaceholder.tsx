export default function ChatPlaceholder() {
  return (
    <div className="mb-6 flex-col px-4 text-center df">
      <div className="flex items-center gap-[6px]">
        <img
          loading="eager"
          src="/logo.webp"
          alt="reddnir logo"
          className="max-h-[40px] min-w-[40px]"
        />

        <h1 className="hidden text-3xl font-bold md:block">reddnir chats</h1>
      </div>
    </div>
  );
}
