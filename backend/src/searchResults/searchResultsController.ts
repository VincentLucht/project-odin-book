import { Request, Response } from 'express';

import db from '@/db/db';

import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import { SortBySearch, TimeFrame } from '@/db/managers/util/types';
import getStartDate from '@/db/managers/util/getStartDate';
import isTimeFrameValid from '@/util/isTimeFrameValid';

class SearchResultsController {
  searchPosts = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      q: query,
      sbt: sort_by_type,
      t: timeframeQuery,
      cId: cursorId,
      safeSearch: safeSearchQuery,
    } = req.query as {
      q: string;
      sbt: SortBySearch;
      cId: string | undefined;
      t: TimeFrame;
      safeSearch: string;
    };

    try {
      const take = 30;
      const safeSearch = safeSearchQuery === 'true';
      let posts;
      let nextCursor: string | null = null;

      if (sort_by_type === 'relevance') {
        if (!isTimeFrameValid(timeframeQuery)) {
          throw new Error('Invalid timeframe detected');
        }
        const timeframe = getStartDate(timeframeQuery);
        const page = cursorId ? parseInt(cursorId) : 0;
        const offset = page * take;

        posts = await db.searchResults.searchPostsByRelevance(
          query,
          safeSearch,
          timeframe,
          take,
          offset,
        );

        // page number as cursor
        nextCursor = String(page + 1);
      } else if (sort_by_type === 'new') {
        posts = await db.searchResults.searchPostsByNew(
          query,
          safeSearch,
          cursorId,
          take,
        );

        // cursor pagination
        nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
      } else if (sort_by_type === 'top') {
        if (!isTimeFrameValid(timeframeQuery)) {
          throw new Error('Invalid timeframe detected');
        }
        const timeframe = getStartDate(timeframeQuery);

        posts = await db.searchResults.searchPostsByTop(
          query,
          safeSearch,
          timeframe,
          cursorId,
          take,
        );

        // cursor pagination
        nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
      } else {
        throw new Error('Invalid sort type specified');
      }

      return res.status(200).json({
        message: 'Successfully fetched posts',
        posts,
        nextCursor: posts.length === take ? nextCursor : null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to search posts',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  searchCommunities = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { q: query, safeSearch: safeSearchQuery } = req.query as {
      q: string;
      safeSearch: string;
    };
    const safeSearch = safeSearchQuery === 'true';

    try {
      const communities = await db.searchResults.searchCommunities(
        query,
        safeSearch,
      );

      return res.status(200).json({
        message: 'Successfully fetched communities',
        communities,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed get search communities',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  searchComments = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      q: query,
      sbt: sort_by_type,
      t: timeframeQuery,
      cId: cursorId,
      safeSearch: safeSearchQuery,
    } = req.query as {
      q: string;
      sbt: SortBySearch;
      cId: string | undefined;
      t: TimeFrame;
      safeSearch: string;
    };

    const safeSearch = safeSearchQuery === 'true';

    try {
      let comments;

      if (sort_by_type === 'relevance') {
        if (!isTimeFrameValid(timeframeQuery)) {
          throw new Error('Invalid timeframe detected');
        }

        const timeframe = getStartDate(timeframeQuery);

        comments = await db.searchResults.searchCommentsByRelevance(
          query,
          safeSearch,
          timeframe,
        );
      } else if (sort_by_type === 'new') {
        comments = await db.searchResults.searchCommentsByNew(
          query,
          safeSearch,
          cursorId,
        );
      } else if (sort_by_type === 'top') {
        if (!isTimeFrameValid(timeframeQuery)) {
          throw new Error('Invalid timeframe detected');
        }

        const timeframe = getStartDate(timeframeQuery);

        comments = await db.searchResults.searchCommentsByTop(
          query,
          safeSearch,
          timeframe,
          cursorId,
        );
      }

      return res.status(200).json({
        message: 'Successfully fetched comments',
        comments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to search comments',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  searchUsers = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { q: query, safeSearch: safeSearchQuery } = req.query as {
      q: string;
      safeSearch: string;
    };
    const safeSearch = safeSearchQuery === 'true';

    try {
      const users = await db.searchResults.searchUsers(query, safeSearch);

      return res.status(200).json({
        message: 'Successfully fetched users',
        users,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to search users',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const searchResultsController = new SearchResultsController();
export default searchResultsController;
