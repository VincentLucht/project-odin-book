import { useState, useEffect, useRef } from 'react';

import CommunityFlairPreview from '@/Main/Community/components/ModTools/components/CommunitySettings/components/components/previews/CommunityFlairPreview';
import CloseButton from '@/components/Interaction/CloseButton';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';
import SpinnerDots from '@/components/SpinnerDots';
import ColorPickerPanel from '@/Main/Global/ColorPickerPanel';

import {
  createCommunityFlair,
  updateCommunityFlair,
} from '@/Main/Community/components/ModTools/components/CommunitySettings/api/communityFlairAPI';
import { getFlairText } from '@/Main/Community/components/ModTools/components/CommunitySettings/components/components/DEFAULT_FLAIR';

import { FlairEditPanel } from '@/Main/Community/components/ModTools/components/CommunitySettings/components/CommunityFlairSettings';
import { DBCommunityFlair } from '@/interface/dbSchema';
import { toast } from 'react-toastify';

interface EditFlairPanelProps {
  flairType: 'user' | 'post';
  setFlairs: React.Dispatch<React.SetStateAction<DBCommunityFlair[]>>;
  token: string | null;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  editPanel: FlairEditPanel;
  setEditPanel: React.Dispatch<React.SetStateAction<FlairEditPanel>>;
  DEFAULT_FLAIR: DBCommunityFlair;
}
export default function EditFlairPanel({
  flairType,
  setFlairs,
  token,
  submitting,
  setSubmitting,
  editPanel,
  setEditPanel,
  DEFAULT_FLAIR,
}: EditFlairPanelProps) {
  const [previousFlair, setPreviousFlair] = useState(editPanel.flair);
  const prevModeRef = useRef(editPanel.mode);

  // Refresh on mode change OR when editing a different flair
  useEffect(() => {
    if (
      prevModeRef.current !== editPanel.mode ||
      previousFlair?.id !== editPanel.flair?.id
    ) {
      setPreviousFlair(editPanel.flair);
      prevModeRef.current = editPanel.mode;
    }
  }, [editPanel.mode, editPanel.flair, previousFlair?.id]);

  if (!editPanel.show) return null;

  const { mode, flair } = editPanel;
  const { name, emoji, textColor, color } = flair ?? {};
  const LIMIT_REACHED = editPanel.count >= 700;

  const hasChanges = () => {
    if (!flair) return false;

    return (
      previousFlair.name !== name ||
      previousFlair.emoji !== emoji ||
      previousFlair.textColor !== textColor ||
      previousFlair.color !== color ||
      previousFlair.is_assignable_to_posts !== flair.is_assignable_to_posts ||
      previousFlair.is_assignable_to_users !== flair.is_assignable_to_users
    );
  };

  return (
    <div
      className={`h-full-header sticky top-14 -mb-4 -mt-4 ml-4 overflow-y-scroll overscroll-contain
        border-l border-gray-600 px-4 pt-[22px]`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">{getFlairText(mode, flairType)}</h3>

        <div className="flex items-center gap-2">
          <button
            className={`h-8 font-medium prm-button ${
              mode === 'create' && !LIMIT_REACHED && name
                ? 'bg-blue-500 active:scale-95'
                : mode !== 'create' && hasChanges() && name
                  ? 'bg-blue-500 active:scale-95'
                  : 'bg-gray-inactive'
              }`}
            onClick={() => {
              if (mode === 'create') {
                if (LIMIT_REACHED) {
                  toast.warning('Community flair of 700 reached');
                  return;
                }

                if (!name) return;
                setSubmitting(true);

                // create api func
                void createCommunityFlair(token, editPanel.flair, {
                  loading: 'Creating community flair...',
                  success: 'Successfully created community flair',
                  error: 'Failed to create community flair',
                }).then((response) => {
                  setSubmitting(false);
                  if (response === false) return;

                  setFlairs((prev) => [response, ...prev]);
                  setEditPanel((prev) => ({
                    ...prev,
                    flair: {
                      ...DEFAULT_FLAIR,
                      community_id: response.community_id,
                      id: response.id,
                    },
                    count: prev.count + 1,
                  }));
                });
              } else if (mode === 'edit') {
                if (!name || !hasChanges()) return;
                setSubmitting(true);

                // edit api func
                void updateCommunityFlair(
                  token,
                  { community_flair_id: editPanel.flair.id, ...editPanel.flair },
                  {
                    loading: 'Updating community flair...',
                    success: 'Successfully updated community flair',
                    error: 'Failed to update community flair',
                  },
                ).then((response) => {
                  setSubmitting(false);
                  if (response === false) return;

                  setFlairs((prev) =>
                    prev.map((flair) =>
                      flair.id === editPanel.flair.id
                        ? { ...flair, ...editPanel.flair }
                        : flair,
                    ),
                  );

                  setPreviousFlair(editPanel.flair);
                });
              }
            }}
          >
            {submitting ? <SpinnerDots /> : mode === 'create' ? 'Create' : 'Save'}
          </button>

          <CloseButton
            customFunc={() => setEditPanel((prev) => ({ ...prev, show: false }))}
          />
        </div>
      </div>

      <CommunityFlairPreview mode={flairType} flair={{ ...editPanel.flair }} />

      <div className="mt-5">
        <h4 className="mb-3 font-medium">Setup</h4>

        <input
          type="text"
          className="w-full rounded-full px-4 py-2 focus-blue"
          placeholder="Flair name"
          value={name}
          onChange={(e) =>
            setEditPanel((prev) => ({
              ...prev,
              flair: { ...prev.flair, name: e.target.value },
            }))
          }
          maxLength={20}
        />

        <MaxLengthIndicator length={name.length} maxLength={20} />
      </div>

      <div className="flex flex-wrap justify-between gap-1">
        {/* BACKGROUND COLOR */}
        <ColorPickerPanel
          title="Text Color"
          color={color}
          onColorChange={(newColor) =>
            setEditPanel((prev) => ({
              ...prev,
              flair: {
                ...prev.flair,
                color: newColor,
              },
            }))
          }
        />

        {/* TEXT COLOR */}
        <ColorPickerPanel
          title="Text Color"
          color={textColor}
          onColorChange={(newColor) =>
            setEditPanel((prev) => ({
              ...prev,
              flair: {
                ...prev.flair,
                textColor: newColor,
              },
            }))
          }
        />
      </div>
    </div>
  );
}
