import { useState } from 'react';

import PFP from '@/components/PFP';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';
import {
  CheckCircleIcon,
  AlertCircleIcon,
  ArchiveIcon,
  ArchiveXIcon,
} from 'lucide-react';
import Separator from '@/components/Separator';

import getRelativeTime from '@/util/getRelativeTime';
import {
  replyToMessage,
  updateMessage,
} from '@/Main/Community/components/ModTools/components/ModMail/api/modMailAPI';
import { toast } from 'react-toastify';

import { DBModMail } from '@/interface/dbSchema';

export interface FetchedModMail extends DBModMail {
  community: {
    id: string;
    name: string;
    profile_picture_url: string | null;
  };
  sender: {
    id: string;
    username: string;
  };
}

interface ModMailMessageProps {
  token: string | null;
  modMail: FetchedModMail;
  setModMail: React.Dispatch<React.SetStateAction<FetchedModMail[]>>;
}

export default function ModMailMessage({
  token,
  modMail,
  setModMail,
}: ModMailMessageProps) {
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState(`Replying to "${modMail.subject}"`);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Separator className="my-3" />

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PFP src={modMail.community.profile_picture_url} />

            <Link to={`/r/${modMail.community.name}`} className="hyperlink-hover">
              <h3 className="font-medium">r/{modMail.community.name}</h3>
            </Link>

            <div>•</div>

            <div className="break-all font-medium">{modMail.subject}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-secondary">
              {getRelativeTime(modMail.created_at)}
            </div>

            <div>•</div>

            <button
              className="text-sm transition-transform hover:underline active:scale-95"
              onClick={() => setShowModal(true)}
            >
              Reply
            </button>

            <div>•</div>

            <button
              className="df hyperlink-hover"
              onClick={() => {
                setArchiving(true);
                const archived = !modMail.is_archived;

                void updateMessage(token, {
                  modmail_id: modMail.id,
                  archived,
                }).then(() => {
                  setArchiving(false);
                  if (archived) {
                    setModMail((prev) =>
                      prev.filter((modmail) => modmail.id !== modMail.id),
                    );
                  } else {
                    setModMail((prev) =>
                      prev.map((modmail) =>
                        modmail.id === modMail.id
                          ? { ...modmail, is_archived: false }
                          : modmail,
                      ),
                    );
                  }

                  toast.success(
                    archived
                      ? 'Successfully archived modmail'
                      : 'Successfullly unarchived modmail',
                  );
                });
              }}
            >
              {archiving ? (
                <div className="spinner h-4 w-4 df"></div>
              ) : modMail.is_archived ? (
                <ArchiveXIcon size={16} />
              ) : (
                <ArchiveIcon size={16} />
              )}
            </button>
          </div>
        </div>

        <div className="mb-1 mt-2 flex items-center justify-between text-sm font-light">
          <Link className="hyperlink-hover" to={`/user/${modMail.sender.username}`}>
            u/{modMail.sender.username}
          </Link>

          <div className="flex items-center gap-2">
            {modMail.is_archived && (
              <div className="text-xs text-gray-secondary">[ARCHIVED]</div>
            )}

            {modMail.has_replied ? (
              <span className="flex items-center text-green-600">
                <CheckCircleIcon className="mr-1" size={16} />
                Replied
              </span>
            ) : (
              <span className="flex items-center text-orange-500">
                <AlertCircleIcon className="mr-1" size={16} />
                Not replied
              </span>
            )}
          </div>
        </div>

        <div className="break-all">{modMail.message}</div>

        <Modal show={showModal} onClose={onClose}>
          <ModalHeader
            headerName={`Reply to user: ${modMail.sender.username}`}
            onClose={onClose}
          />

          <div>
            <label className="-mb-2 font-medium" htmlFor="modal-subject">
              Subject
            </label>
            <input
              id="modal-subject"
              type="text"
              className="!py-2 modal-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              autoComplete="off"
            />
            <MaxLengthIndicator length={subject.length} maxLength={214} />
          </div>

          <div>
            <label className="-mb-2 font-medium" htmlFor="modal-message">
              Message
            </label>
            <TextareaAutosize
              id="modal-message"
              className="!py-2 modal-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={3}
              required
            />
            <MaxLengthIndicator length={message.length} maxLength={1000} />
          </div>

          <ModalFooter
            onClose={() => onClose()}
            onClick={() => {
              if (subject && message) {
                setSubmitting(true);

                void replyToMessage(
                  token,
                  { subject, message, modmail_id: modMail.id },
                  {
                    loading: 'Replying to mod mail...',
                    success: 'Successfully replied to mod mail',
                    error: 'Failed to reply to mod mail',
                  },
                ).then((success) => {
                  setSubmitting(false);
                  if (!success) return;

                  setModMail((prev) =>
                    prev.map((modmail) =>
                      modmail.id === modMail.id
                        ? { ...modmail, has_replied: true }
                        : modmail,
                    ),
                  );

                  setSubject('');
                  setMessage('');
                  setShowModal(false);
                });
              }
            }}
            submitting={submitting}
            confirmButtonName="Reply"
          />
        </Modal>
      </div>
    </>
  );
}
