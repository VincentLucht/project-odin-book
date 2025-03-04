import AddOrRemove from '@/Main/Community/components/CreateCommunity/Levels/Level2/AddOrRemove';

import Swal from 'sweetalert2';
import swalDefaultProps from '@/util/swalDefaultProps';

interface Level2Props {
  level: number;
  communityName: string;
  bannerUrl: string | null;
  setBannerUrl: React.Dispatch<React.SetStateAction<string | null>>;
  bannerUrlMobile: string | null;
  setBannerUrlMobile: React.Dispatch<React.SetStateAction<string | null>>;
  iconUrl: string | null;
  setIconUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Level2({
  level,
  communityName,
  bannerUrl,
  setBannerUrl,
  bannerUrlMobile,
  setBannerUrlMobile,
  iconUrl,
  setIconUrl,
}: Level2Props) {
  if (level !== 2) {
    return;
  }

  const onAdd = (type: 'banner' | 'mobile' | 'icon') => {
    void Swal.fire({
      title: 'Enter the image URL',
      input: 'url',
      inputPlaceholder: 'Paste your image URL here...',
      confirmButtonText: 'Add',
      ...swalDefaultProps,
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;

      if (type === 'banner') {
        setBannerUrl(result.value as string);
      } else if (type === 'mobile') {
        setBannerUrlMobile(result.value as string);
      } else if (type === 'icon') {
        setIconUrl(result.value as string);
      }
    });
  };

  return (
    <>
      <div className="mb-3">
        <h2 className="text-2xl font-bold">Style your community</h2>

        <div className="mb-4 mt-2 text-sm text-gray-secondary">
          Note: You can update this at any time.
        </div>

        <div
          className={`my-2 max-h-[128px] max-w-[1072px] overflow-hidden rounded-lg df
            ${bannerUrl ? '' : 'bg-neutral-200'}`}
        >
          {bannerUrl ? (
            <img
              className="h-auto w-full rounded-lg object-contain"
              src={bannerUrl}
              alt="Community Banner"
            />
          ) : (
            <div className="min-h-[128px] text-2xl font-semibold df text-bg-gray">
              Banner Preview
            </div>
          )}
        </div>

        <div className="ml-4 flex">
          <div className="border-bg-gray z-10 -mt-10 h-[88px] w-[88px] rounded-full border-4 bg-gray-400 df">
            {iconUrl ? (
              <img className="rounded-full" src={iconUrl} alt="Community Icon" />
            ) : (
              <div>Icon</div>
            )}
          </div>

          <h3 className="ml-2 text-3xl font-bold">r/{communityName}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AddOrRemove
          value={bannerUrl}
          setterFunc={setBannerUrl}
          name="Banner"
          onAdd={() => onAdd('banner')}
          subText="For good results, the image should be 1072 x 128px."
        />

        <AddOrRemove
          value={bannerUrlMobile}
          setterFunc={setBannerUrlMobile}
          name="Banner (mobile)"
          onAdd={() => onAdd('mobile')}
          subText={
            <span>
              <b>Optional:</b> will be displayed on mobile devices instead.
            </span>
          }
        />

        <AddOrRemove
          value={iconUrl}
          setterFunc={setIconUrl}
          name="Icon"
          onAdd={() => onAdd('icon')}
          subText="Icons are 88 x 88px."
        />
      </div>
    </>
  );
}
