import { useState } from 'react';

import { MailIcon } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalInput from '@/components/Modal/components/ModalInput';
import ModalTextArea from '@/components/Modal/components/ModalTextArea';

import { sendMessage as sendMessageToModMail } from '@/Main/Community/components/ModTools/components/ModMail/api/modMailAPI';
import notLoggedInError from '@/util/notLoggedInError';

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
      <button
        className="gap-2 df sidebar-btn-stone"
        onClick={() => {
          if (!token) {
            notLoggedInError('You need to log in to write messages to mods');
            return;
          }
          setShowModal(true);
        }}
      >
        <MailIcon className="w-5" strokeWidth={1.7} />
        Message Mods {!token ? '(login required)' : ''}
      </button>

      <Modal show={showModal} onClose={onClose}>
        <ModalHeader headerName="Send a message to the moderators" onClose={onClose} />

        <ModalInput
          labelName="Subject"
          value={subject}
          setterFunc={setSubject}
          maxLength={200}
        />

        <ModalTextArea
          labelName="Message"
          value={message}
          setterFunc={setMessage}
          maxLength={1000}
        />

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
