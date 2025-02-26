import { PostType } from '@/Main/CreatePost/CreatePost';

interface SetPostTypeProps {
  postType: PostType;
  onPostTypeChange: (postType: PostType) => void;
}

export default function SetPostType({ postType, onPostTypeChange }: SetPostTypeProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onPostTypeChange('BASIC')}
        className={`create-btn ${postType === 'BASIC' && 'create-btn-before'}`}
      >
        Text
      </button>

      <button
        onClick={() => onPostTypeChange('images')}
        className={`create-btn ${postType === 'images' && 'create-btn-before'}`}
      >
        Images
      </button>

      <button
        onClick={() => onPostTypeChange('POLL')}
        className={`create-btn ${postType === 'POLL' && 'create-btn-before'}`}
      >
        Poll
      </button>
    </div>
  );
}
