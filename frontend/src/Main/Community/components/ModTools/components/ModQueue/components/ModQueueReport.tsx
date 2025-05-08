import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import useMeasure from 'react-use-measure';

import Separator from '@/components/Separator';
import ModQueueReportHeader from '@/Main/Community/components/ModTools/components/ModQueue/components/components/ModQueueReportHeader';
import Post from '@/Main/Post/Post';
import PFP from '@/components/PFP';
import { CheckIcon } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import ModalTextArea from '@/components/Modal/components/ModalTextArea';

import { moderatePost } from '@/Main/Post/components/PostInteractionBar/api/postModerationAPI';
import { moderateComment } from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/api/commentModerationAPI';

import { FetchedReport } from '@/Main/Community/components/ModTools/components/ModQueue/ModQueue';
import { TokenUser } from '@/context/auth/AuthProvider';
import getRelativeTime from '@/util/getRelativeTime';

interface ModQueueReportProps {
  report: FetchedReport;
  setReports: React.Dispatch<React.SetStateAction<FetchedReport[]>>;
  user: TokenUser;
  token: string | null;
  currentPostId: string | null;
  setCurrentPostId: React.Dispatch<React.SetStateAction<string | null>>;
  currentCommentId: string | null;
  setCurrentCommentId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ModQueueReport({
  report,
  setReports,
  user,
  token,
  currentPostId,
  setCurrentPostId,
  currentCommentId,
  setCurrentCommentId,
}: ModQueueReportProps) {
  const [showReason, setShowReason] = useState(false);
  const [showDismissReasonModal, setShowDismissReasonModal] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [ref, { height }] = useMeasure();

  const isPost = report.post_id !== null && report.comment_id === null;
  const iconClassName =
    'absolute left-[21px] top-[22px] rounded-full df h-[12px] w-[12px] ';
  const approved =
    report.status === 'PENDING' ? null : report.status === 'REVIEWED' ? true : false;

  const postOptions = {
    showComments: isPost ? false : true,
    commentId: report.comment_id ?? '',
  };

  const showPost = isPost
    ? currentPostId === report.post_id
    : currentPostId === report.comment?.parent_post?.id &&
      currentCommentId === report.comment?.id;

  const reasonAnimation = useSpring({
    height: showReason ? height : 0,
    opacity: showReason ? 1 : 0,
    marginTop: showReason ? 4 : 0,
    config: { mass: 0.7, tension: 400, friction: 18, clamp: true },
  });

  const onSuccess = (action: 'APPROVED' | 'REMOVED', reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: action === 'APPROVED' ? 'REVIEWED' : 'DISMISSED',
              moderator: {
                profile_picture_url: user.profile_picture_url,
                username: user.username,
              },
              moderated_at: new Date().toISOString(),
              removal_reason: dismissReason,
            }
          : report,
      ),
    );

    setSubmitting(false);
  };

  const onModeration = (action: 'APPROVED' | 'REMOVED', makeCall = false) => {
    setSubmitting(true);

    if (isPost) {
      if (makeCall) {
        void moderatePost(
          token,
          {
            post_id: report.post_id!,
            moderation_action: action,
            dismiss_reason: dismissReason,
          },
          {
            loading: 'Moderating post...',
            success: 'Successfully moderate post',
            error: 'Failed to moderate post',
          },
        ).then((success) => {
          setSubmitting(false);
          if (!success) return;

          onSuccess(action, report.id);
        });
      } else {
        onSuccess(action, report.id);
      }
    } else {
      if (makeCall) {
        void moderateComment(
          token,
          {
            comment_id: report.comment_id!,
            moderation_action: action,
          },
          {
            loading: 'Moderating comment...',
            success: 'Successfully moderated comment',
            error: 'Failed to moderate comment',
          },
        ).then((success) => {
          setSubmitting(false);
          if (!success) return;

          onSuccess(action, report.id);
        });
      } else {
        onSuccess(action, report.id);
      }
    }

    setCurrentCommentId(null);
    setCurrentPostId(null);
  };

  return (
    <>
      <Separator className="my-3" />

      <div className={`${showPost && 'grid grid-cols-2'}`}>
        <div
          className="cursor-pointer rounded-2xl p-4 bg-transition-hover"
          onClick={() => {
            if (isPost) {
              setCurrentPostId(
                report.post_id === currentPostId ? null : report.post_id,
              );
              setCurrentCommentId(null);
            } else {
              if (report.comment.id === currentCommentId) {
                setCurrentPostId(null);
                setCurrentCommentId(null);
              } else {
                setCurrentPostId(report.comment.parent_post.id);
                setCurrentCommentId(report.comment.id);
              }
            }
          }}
        >
          <ModQueueReportHeader report={report} isPost={isPost} />

          <div>
            {isPost ? (
              <>
                <div className="mt-2 font-semibold">{report.post.title}</div>

                <div className="text-sm text-hidden-ellipsis text-gray-secondary">
                  {report.post.body}
                </div>
              </>
            ) : (
              <>
                <div className="mt-2 text-sm font-medium text-gray-secondary">
                  {report.comment.parent_post.title}
                </div>

                <div className="mt-1 border-l-2 pl-2 text-sm text-hidden-ellipsis">
                  {report.comment.content}
                </div>
              </>
            )}
          </div>

          <div className="my-3 mt-5 flex flex-col gap-1 text-sm">
            <div className="font-semibold">Report:</div>

            <div className="text-base font-semibold">{report.subject}</div>

            <animated.div style={{ ...reasonAnimation, overflow: 'hidden' }}>
              <div ref={ref}>{report.reason}</div>
            </animated.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReason(!showReason);
              }}
              className="mb-2 mt-1 w-fit py-1 text-xs !font-medium prm-button normal-bg-transition"
            >
              {showReason ? 'Hide reason' : 'Show reason'}
            </button>
          </div>

          {report.moderated_at ? (
            <div>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-semibold">
                  {`${report.status.charAt(0) + report.status.slice(1).toLowerCase()}
                   ${getRelativeTime(report.moderated_at, true)} 
                   by u/${report.moderator.username}`}
                </span>

                <div className="relative">
                  <PFP
                    src={report.moderator.profile_picture_url}
                    className="!h-8 !w-8"
                  />

                  {approved ? (
                    <div className={`${iconClassName} bg-green-400`}>
                      <CheckIcon className="h-3 w-3 text-bg-gray" />
                    </div>
                  ) : (
                    <div className={`${iconClassName} bg-red-500`}>
                      <img src="/x-close-bg-gray.svg" alt="x close icon" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 break-words text-sm">{report.removal_reason}</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="confirm-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (report.status !== 'REVIEWED') {
                    onModeration('APPROVED', true);
                  }
                }}
              >
                Approve
              </button>

              <button
                className="cancel-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDismissReasonModal(true);
                }}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {showPost && (
          <Post
            mode="fetched"
            options={postOptions}
            givenPostId={currentPostId}
            onModerationCb={onModeration}
          />
        )}

        <Modal
          show={showDismissReasonModal}
          onClose={() => setShowDismissReasonModal(false)}
        >
          <ModalHeader
            headerName={`Are you sure you want to dismiss ${report.report_count} ${report.report_count === 1 ? 'report' : 'reports'}?`}
            onClose={() => setShowDismissReasonModal(false)}
          />

          <ModalTextArea
            labelName="You may provide a reason for your decision"
            value={dismissReason}
            setterFunc={setDismissReason}
            maxLength={100}
          />

          <ModalFooter
            onClose={() => setShowDismissReasonModal(false)}
            onClick={() => {
              onModeration('REMOVED', true);
              setShowDismissReasonModal(false);
            }}
            submitting={submitting}
            confirmButtonName="Dismiss"
          />
        </Modal>
      </div>
    </>
  );
}
