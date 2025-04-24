import { Prisma } from '@prisma/client';
import isTimeFrameValid from '@/util/isTimeFrameValid';
import getStartDate from '@/db/managers/util/getStartDate';
import { TimeFrame } from '@/db/managers/util/types';

/**
 * Creates sorting parameters based on provided sort type and timeframe.
 */
export default function createSortParams(
  sortBy: 'new' | 'top',
  timeframe: TimeFrame | undefined,
) {
  let convertedTimeframe = null;

  // Only for 'top' sorting
  if (sortBy === 'top' && timeframe) {
    if (!isTimeFrameValid(timeframe)) {
      throw new Error('Invalid timeframe detected');
    } else {
      convertedTimeframe = getStartDate(timeframe);
    }
  }

  const orderMap = {
    new: [{ created_at: Prisma.SortOrder.desc }],
    top: [
      { total_vote_score: Prisma.SortOrder.desc },
      { id: Prisma.SortOrder.asc }, // tiebreaker
    ],
  };

  const orderBy = orderMap[sortBy];

  return {
    orderBy,
    ...(convertedTimeframe && { convertedTimeframe }),
  };
}
