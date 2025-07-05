import { useState } from 'react';

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

/**
 * Allows to choose the community banner and icon, while also showing a preview.
 */
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
  const [showMobile, setShowMobile] = useState(false);

  if (level !== 2) {
    return;
  }

  const onAdd = (type: 'banner' | 'mobile' | 'icon') => {
    void Swal.fire({
      title: 'Enter the image URL',
      input: 'text',
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

  const bannerSrc = showMobile ? bannerUrlMobile : bannerUrl;

  return (
    <>
      <div className="mb-3">
        <div>
          <h2 className="text-2xl font-bold">Style your community</h2>

          <div className="flex items-center justify-between">
            <div className="mb-4 mt-2 text-sm text-gray-secondary">
              Note: You can update this at any time.
            </div>

            <button
              onClick={() => setShowMobile(!showMobile)}
              className="h-9 prm-button-blue"
            >
              {showMobile ? 'Show desktop banner' : 'Show mobile banner'}
            </button>
          </div>
        </div>

        <div
          className={`my-2 max-h-[128px] max-w-[1072px] overflow-hidden rounded-lg df
            ${bannerSrc ? '' : 'bg-neutral-200'} ${showMobile ? '!max-w-[500px]' : ''}`}
        >
          {bannerSrc ? (
            <img
              className="h-auto w-full rounded-lg object-contain"
              src={bannerSrc ?? ''}
              alt="Community Banner"
            />
          ) : (
            <div className="min-h-[128px] text-2xl font-semibold df text-bg-gray">
              {showMobile ? 'Mobile Banner Preview' : 'Banner Preview'}
            </div>
          )}
        </div>

        <div className="ml-4 flex">
          <div
            className="z-10 -mt-10 h-[88px] w-[88px] flex-shrink-0 rounded-full border-4 bg-gray-400 df
              border-bg-gray"
          >
            {iconUrl ? (
              <img className="rounded-full" src={iconUrl} alt="Community Icon" />
            ) : (
              <div>Icon</div>
            )}
          </div>

          <div className="flex w-full justify-between">
            <h3 className="ml-2 break-all text-3xl font-bold">r/{communityName}</h3>

            <div className="text-sm text-gray-secondary">
              {showMobile ? '(Currently mobile banner)' : '(Currently desktop banner)'}
            </div>
          </div>
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
            <div className="flex flex-col">
              <span>
                <b>Mobile banner:</b> Optional fallback for mobile devices.
              </span>

              <span>
                <b>Note:</b> Default banner typically works well on mobile.
              </span>
            </div>
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
