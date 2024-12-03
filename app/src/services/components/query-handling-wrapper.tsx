import React, { PropsWithChildren } from 'react';
import { QueryErrorComponent } from '@/components/error';
import { useQueryStatuses } from '@/hooks';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { FillAreaWrapper } from '@/components/common/fill-area-wrapper';
import { ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { FirstFetchOnlyNotProps, FirstFetchOnlyProps } from '../types';

type MainProps = {
  LoadingSkeleton?: React.ReactNode;
  statuses: QueryStatus[] | QueryStatus;
  errorMessage?: string;
  httpCode?: number;
  variant?: 'page' | 'component' | 'hidden';
  onRetry?: VoidFunction;
};
type Props = MainProps & (FirstFetchOnlyProps | FirstFetchOnlyNotProps);

export const QueryHandlingWrapper = ({
  LoadingSkeleton,
  statuses,
  errorMessage,
  children,
  httpCode,
  variant = 'component',
  onRetry,
  firstFetchLoadingOnly,
  isFetchingFirstTime,
}: PropsWithChildren<Props>) => {
  const { someQueryError, someQueryPending } = useQueryStatuses(
    statuses,
    firstFetchLoadingOnly,
    isFetchingFirstTime
  );

  if (someQueryPending) {
    return (
      <>
        {LoadingSkeleton || (
          <FillAreaWrapper>
            <ActivityIndicator size="large" />
          </FillAreaWrapper>
        )}
      </>
    );
  }

  if (someQueryError) {
    switch (variant) {
      // TODO: rework this, to routing correctly
      case 'page':
        router.replace({ pathname: '/', params: { errorMessage, httpCode } });

        return null;
      case 'component':
        return (
          <FillAreaWrapper>
            <QueryErrorComponent message={errorMessage} onRetry={onRetry} />
          </FillAreaWrapper>
        );
      case 'hidden':
        return null;
      default:
        return null;
    }
  }

  return <>{children}</>;
};
