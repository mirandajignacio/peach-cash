import React from 'react';
import { UseQueryResult, UseSuspenseQueryResult } from '@tanstack/react-query';

type QueryState = 'loading' | 'error' | 'success';

type QueryRenderProps<TData, TError> = {
  query: UseQueryResult<TData, TError> | UseSuspenseQueryResult<TData, TError>;
  onData: (data: TData) => React.ReactNode;
  onLoading?: () => React.ReactNode;
  onError?: (error: TError | null) => React.ReactNode;
};

export function QueryRender<TData, TError = unknown>({
  query,
  onData,
  onLoading,
  onError,
}: QueryRenderProps<TData, TError>) {
  const state: QueryState = query.isLoading
    ? 'loading'
    : query.isError
    ? 'error'
    : 'success';

  switch (state) {
    case 'loading':
      return onLoading ? <>{onLoading()}</> : null;
    case 'error':
      return onError ? <>{onError(query.error)}</> : null;
    case 'success':
      // Manejar caso donde data puede ser null/undefined pero query es exitoso
      return query.data !== undefined && query.data !== null ? (
        <>{onData(query.data)}</>
      ) : null;
    default:
      return null;
  }
}
