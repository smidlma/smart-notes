export type PaginatedResponse<T> = T & {
  results_count?: number;
};

export type ResponseErrorWithMessage = {
  data: {
    detail: string;
  };
};

export type ResponseMultipleErrorsWithMessage = {
  data: {
    [key: string]: string[];
  };
};

export type FirstFetchOnlyProps = {
  firstFetchLoadingOnly: boolean;
  isFetchingFirstTime: boolean;
};

export type FirstFetchOnlyNotProps = {
  firstFetchLoadingOnly?: undefined;
  isFetchingFirstTime?: never;
};
