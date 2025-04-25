import { useRef, useEffect, useState } from 'react';

import { Modal } from '@/components/Modal/Modal';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';
import CloseButton from '@/components/Interaction/CloseButton';

import { moderatePost } from '@/Main/Post/components/PostInteractionBar/api/postModerationAPI';
import { moderateComment } from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/api/commentModerationAPI';

interface GiveRemovalReasonProps {
  type: 'post' | 'comment';
  token: string | null;
  apiData: { id: string };
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateRemovalReason?: (
    _postId: string,
    newReason: string,
    success: boolean,
  ) => void;
}

export default function GiveRemovalReason({
  type,
  token,
  apiData,
  show,
  setShow,
  onUpdateRemovalReason,
}: GiveRemovalReasonProps) {
  const [removalReason, setRemovalReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && show) {
      inputRef.current.focus();
    }
  }, [show]);

  const handleClose = () => {
    setShow(false);
    setRemovalReason('');
  };

  const onSubmit = () => {
    setSubmitting(true);

    const removalPayload = {
      reason: removalReason,
      moderation_action: 'REMOVED' as const,
    };
    const toastMessages = {
      loading: 'Adding removal reason...',
      success: 'Successfully added removal reason',
      error: 'Failed to add removal reason',
    };

    void (
      type === 'post'
        ? moderatePost(token, { post_id: apiData.id, ...removalPayload }, toastMessages)
        : moderateComment(
            token,
            { comment_id: apiData.id, ...removalPayload },
            toastMessages,
          )
    ).then((success) => {
      setSubmitting(false);
      setShow(false);
      onUpdateRemovalReason?.(apiData.id, removalReason, success);
    });
  };

  return (
    <Modal show={show} onClose={() => handleClose()}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Give a removal reason</h2>

        <CloseButton customFunc={() => handleClose()} />
      </div>

      <div className="-mt-1 text-sm text-gray-secondary">
        Removing a {type} will notify a user.
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <input
            value={removalReason}
            onChange={(e) => setRemovalReason(e.target.value)}
            className="w-full rounded-2xl p-4 focus-blue"
            placeholder="Removal reason*"
            required={true}
            onKeyDown={(e) => {
              // Prevent enter from closing modal
              if (e.key === 'Enter') {
                e.preventDefault();
                if (removalReason) onSubmit();
              }
            }}
            maxLength={20}
            ref={inputRef}
          />

          <div>
            <MaxLengthIndicator length={removalReason.length} maxLength={20} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="cancel-button" onClick={() => handleClose()}>
            Cancel
          </button>

          <button className="confirm-button" type="submit">
            {submitting ? (
              <div className="df">
                <div className="spinner-dots scale-75"></div>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
