import { QueryStatus } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

/**
 * `useQueryStatuses` is a custom hook that checks the status of one or more queries.
 * It returns an object with two boolean properties: `someQueryError` and `someQueryPending`.
 *
 * @param {QueryStatus | QueryStatus[]} statuses - The status or statuses to check.
 * @param {boolean} [firstFetchLoadingOnly=false] - If true, only the first fetch will be considered as pending.
 * @param {boolean} [isFetchingFirstTime=false] - If true, it indicates that it's the first time fetching.
 * @returns {Object} - An object with `someQueryError` and `someQueryPending` properties.
 */
export const useQueryStatuses = (
  statuses: QueryStatus | QueryStatus[],
  firstFetchLoadingOnly?: boolean,
  isFetchingFirstTime?: boolean
) =>
  useMemo(() => {
    const isArrayStatuses = Array.isArray(statuses);
    const someQueryError = isArrayStatuses
      ? statuses.some((status) => status === QueryStatus.rejected)
      : statuses === QueryStatus.rejected;

    let someQueryPending: boolean;

    if (firstFetchLoadingOnly) {
      someQueryPending = !!isFetchingFirstTime;
    } else {
      someQueryPending = isArrayStatuses
        ? statuses.some((status) => status === QueryStatus.pending)
        : statuses === QueryStatus.pending;
    }

    return {
      someQueryError,
      someQueryPending,
    };
  }, [statuses, isFetchingFirstTime, firstFetchLoadingOnly]);
