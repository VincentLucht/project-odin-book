import PFP from '@/components/PFP';
import CommunityFlairTag from '@/Main/Global/CommunityFlairTag';
import UserCard from '@/components/user/UserCard';

interface CommunityFlairPreviewProps {
  mode: 'user' | 'post';
  flair: { name: string; emoji: string | null; textColor: string; color: string };
}

export default function CommunityFlairPreview({
  mode,
  flair,
}: CommunityFlairPreviewProps) {
  const { name, emoji, textColor, color } = flair;

  return (
    <div className="mt-5">
      <h4 className="mb-3 font-medium">Preview</h4>

      {mode === 'post' ? (
        <div className="rounded-xl border border-gray-600 py-2 pl-4 pr-1 text-sm">
          <div className="flex items-center gap-1">
            <PFP src={null} />

            <div className="font-semibold">r/valhalla</div>

            <div className="text-xs text-gray-secondary">1 min. ago</div>
          </div>

          <div className="mt-1 text-base font-medium">
            Is Gungnir (Odin&apos;s spear) more powerful than Mjolnir?
          </div>

          <CommunityFlairTag
            flair={{
              name: name ? name : 'Placeholder Flair',
              emoji: emoji ? emoji : null,
              textColor: textColor ? textColor : '',
              color: color ? color : 'rgb(59, 130, 246)',
            }}
            className="my-2"
          />

          <div>
            I would like a solid argument against what I believe is a fact, Gungnir has
            greater capabilities than Thor&apos;s hammer...
          </div>
        </div>
      ) : (
        <div>
          <UserCard
            profile_picture_url={
              'https://i.pinimg.com/736x/6c/c3/3b/6cc33b7ca514c5ad208d43c9dcb82469.jpg'
            }
            username="Thor"
            userFlair={{
              name: name ? name : 'Mjölnir',
              emoji: emoji ? emoji : null,
              textColor: textColor ? textColor : '',
              color: color ? color : 'rgb(59, 130, 246)',
            }}
          />
        </div>
      )}
    </div>
  );
}
