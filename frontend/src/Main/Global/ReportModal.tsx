import { useState } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';

import { report } from '@/Main/Global/api/reportAPI';
import { onCommentModeration } from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/hooks/useCommentModeration';
import { toast } from 'react-toastify';

import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
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
  setFetchedUser?: React.Dispatch<React.SetStateAction<UserAndHistory | null>>;
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

        return {
          ...prev,
          history: prev.history.map((item) =>
            item.id === apiData.item_id ? { ...item, reports: [report] } : item,
          ),
        };
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
        <label htmlFor="report-subject" className="-mb-2 font-medium">
          Subject
        </label>
        <input
          id="report-subject"
          type="text"
          className="!py-2 modal-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={20}
          required
          autoComplete="off"
        />
        <MaxLengthIndicator length={subject.length} maxLength={20} />

        <label className="-mb-2 font-medium" htmlFor="report-message">
          Reason
        </label>
        <TextareaAutosize
          id="report-message"
          className="!py-2 modal-input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          minRows={3}
          maxLength={500}
          required
        />
        <MaxLengthIndicator length={reason.length} maxLength={500} />
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
