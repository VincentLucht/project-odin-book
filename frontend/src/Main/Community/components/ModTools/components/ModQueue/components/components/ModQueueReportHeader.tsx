import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';

import PFP from '@/components/PFP';

import getRelativeTime from '@/util/getRelativeTime';
import formatVotes from '@/util/formatVotes';

import { FetchedReport } from '@/Main/Community/components/ModTools/components/ModQueue/ModQueue';

interface ModQueueReportHeaderProps {
  report: FetchedReport;
  isPost: boolean;
}

export default function ModQueueReportHeader({
  report,
  isPost,
}: ModQueueReportHeaderProps) {
  const { isMobile } = useGetScreenSize();

  const source = isPost ? report.post : report.comment;

  return (
    <div className="flex items-center gap-1 text-xs">
      <div className={`flex items-center gap-1 ${isMobile && '-mt-[20px]'}`}>
        <PFP src={report.user.profile_picture_url} mode="user" className="!h-5 !w-5" />

        {/* TODO: Add option to ban user, similar to post */}
        <div className="break-all font-semibold">{`u/${report.user.username}`}</div>
      </div>

      <div className={`flex gap-1 text-gray-secondary ${isMobile && 'flex-col'}`}>
        <div className="flex items-center gap-1">
          <div className="text-white">•</div>
          <div className="font-medium text-white">
            Reported {formatVotes(report.report_count, 'time')}
          </div>

          <div>•</div>
          <div>[{isPost ? 'POST' : 'COMMENT'}]</div>

          <div>•</div>
          <div>{getRelativeTime(report.created_at, true)}</div>
        </div>

        <div className="flex items-center gap-1">
          <div>•</div>
          <div>{formatVotes(source.upvote_count, 'upvote')}</div>

          <div>•</div>
          <div>{formatVotes(source.downvote_count, 'downvote')}</div>

          <div>•</div>
          <div>{formatVotes(source.total_vote_score, 'public score')}</div>
        </div>
      </div>
    </div>
  );
}
