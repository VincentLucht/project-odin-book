import { Link } from 'react-router-dom';

interface PostNotFoundProps {
  className?: string;
}

export default function PostNotFound({ className }: PostNotFoundProps) {
  return (
    <div className="p-4 center-main">
      <div className="w-full lg:center-main-content">
        <div className={`flex-col gap-4 df ${className}`}>
          <div className="flex-col df">
            <img src="/logo.webp" alt="Reddnir logo" className="w-20 rotate-[135deg]" />

            <div className="-mt-[5.5px] w-[60px] border-b-2"></div>
          </div>

          <h2 className="text-2xl font-bold">Sorry, this post doesn&apos;t exist.</h2>

          <span className="text-sm text-gray-secondary">
            This post may have been deleted or the link is incorrect
          </span>

          <Link to="/" className="w-full">
            <button className="h-8 w-full prm-button-blue">Return to home page</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
