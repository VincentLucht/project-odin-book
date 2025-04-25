import { useState } from 'react';

import { MailIcon } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';

import { sendMessage as sendMessageToModMail } from '@/Main/Community/components/ModTools/components/ModMail/api/modMailAPI';

interface MessageModsProps {
  community_id: string;
  token: string | null;
}

export default function MessageMods({ community_id, token }: MessageModsProps) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const onClose = () => {
    setShowModal(false);
    setSubmitting(false);
    setSubject('');
    setMessage('');
  };

  return (
    <>
      <button className="gap-2 df sidebar-btn-stone" onClick={() => setShowModal(true)}>
        <MailIcon className="w-5" strokeWidth={1.7} />
        Message Mods
      </button>

      <Modal show={showModal} onClose={onClose}>
        <ModalHeader headerName="Send a message to the moderators" onClose={onClose} />

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
            maxLength={200}
            required
            autoComplete="off"
          />
          <MaxLengthIndicator length={subject.length} maxLength={200} />
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
            maxLength={1000}
            minRows={3}
            required
          />
          <MaxLengthIndicator length={message.length} maxLength={1000} />
        </div>

        <ModalFooter
          confirmButtonName="Send"
          onClick={() => {
            setSubmitting(true);
            void sendMessageToModMail(
              token,
              {
                community_id,
                subject,
                message,
              },
              {
                loading: 'Sending message',
                success: 'Successfully send mod message',
                error: 'Failed to send mod message',
              },
            ).then((success) => {
              setSubmitting(false);
              if (!success) return;
              onClose();
            });
          }}
          submitting={submitting}
          onClose={onClose}
        />
      </Modal>
    </>
  );
}
