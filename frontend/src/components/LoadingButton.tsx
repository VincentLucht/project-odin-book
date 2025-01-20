import '@/css/spinner.css';

interface LoadingButtonProps {
  text: string;
  isLoading: boolean;
  func: (...args: any[]) => void;
}

export default function LoadingButton({ text, isLoading, func }: LoadingButtonProps) {
  return (
    <button
      className="mt-1 h-[52px] w-full transition-all duration-300 df prm-button-blue"
      onClick={(e) => {
        e.preventDefault();
        func();
      }}
      type="submit"
    >
      <div className="relative flex h-5 w-full items-center justify-center">
        <span
          className={`absolute transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        >
          {text}
        </span>
        <div
          className={`absolute transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="spinner-dots mt-1 h-5 w-5" />
        </div>
      </div>
    </button>
  );
}
