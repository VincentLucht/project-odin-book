import { useState } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import ModalInput from '@/components/Modal/components/ModalInput';
import ModalTextArea from '@/components/Modal/components/ModalTextArea';

import { report } from '@/Main/Global/api/reportAPI';
import { onCommentModeration } from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/hooks/useCommentModeration';
import { toast } from 'react-toastify';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import {
  DBPostWithCommunityName,
  DBPostWithCommunity,
  DBCommentWithReplies,
} from '@/interface/dbSchema';

interface ReportModalProps {
  show: boolean;
  onClose: () => void;
  token: string | null;
  apiData: {
    type: 'POST' | 'COMMENT';
    item_id: string;
  };
  setFetchedUser?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;
  setPost?: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  setComments?: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
}

export default function ReportModal({
  show,
  onClose,
  token,
  apiData,
  setFetchedUser,
  setPosts,
  setPost,
  setComments,
}: ReportModalProps) {
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const typeString = apiData.type.toLowerCase();

  const onClick = () => {
    if (!subject || !reason) {
      toast.info('Please fill in your report');
      return;
    }

    setSubmitting(true);
    void report(
      token,
      { ...apiData, subject, reason },
      {
        loading: `Reporting ${typeString}...`,
        success: `Successfully reported ${typeString}`,
        error: `Failed to report ${typeString}`,
      },
    ).then((report) => {
      setSubmitting(false);
      if (report === false) return;
      onClose();

      setPost?.((prev) => {
        if (!prev) return prev;

        return { ...prev, reports: [report] };
      });

      setPosts?.((prev) => {
        if (!prev) return prev;

        return prev.map((post) =>
          apiData.item_id === post.id ? { ...post, reports: [report] } : post,
        );
      });

      setFetchedUser?.((prev) => {
        if (!prev) return prev;

        return prev.map((item) =>
          item.id === apiData.item_id ? { ...item, reports: [report] } : item,
        );
      });

      apiData.type === 'COMMENT' &&
        onCommentModeration(
          apiData.item_id,
          (comment) => ({ ...comment, reports: [report] }),
          setComments!,
        );
    });
  };

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader headerName={`Report ${typeString}`} onClose={onClose} />

      <div>
        <ModalInput
          labelName="Subject"
          value={subject}
          setterFunc={setSubject}
          maxLength={20}
        />

        <ModalTextArea
          labelName="Reason"
          value={reason}
          setterFunc={setReason}
          maxLength={500}
          required={true}
        />
      </div>

      <ModalFooter
        onClose={onClose}
        submitting={submitting}
        onClick={onClick}
        confirmButtonName="Report"
      />
    </Modal>
  );
}
