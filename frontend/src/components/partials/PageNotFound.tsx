import { Link } from 'react-router-dom';

interface PageNotFoundProps {
  className?: string;
}

export default function PageNotFound({ className }: PageNotFoundProps) {
  return (
    <div className={`flex-col gap-4 df ${className}`}>
      <div className="flex-col df">
        <img src="/logo.webp" alt="Reddnir logo" className="w-20 rotate-[135deg]" />

        <div className="-mt-[5.5px] w-[60px] border-b-2"></div>
      </div>

      <h2 className="text-2xl font-bold">Page not found</h2>

      <span className="text-sm text-gray-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved
      </span>

      <Link to="/" className="w-full">
        <button className="h-8 w-full prm-button-blue"> Return to home page</button>
      </Link>
    </div>
  );
}
