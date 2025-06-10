/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse<T = any> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface ApiError {
  detail: string;
  statusCode: number;
}

export const DefaultResponseError: ApiError = {
  detail: 'Unexpected error',
  statusCode: 400,
};

export const errorDetailAsString = (detail: string | any): string => {
  if (typeof detail !== 'string') {
    detail = JSON.stringify(detail, null, 2);
  }
  return detail;
};

export const formatApiError = (error?: ApiError | null): string => {
  return error?.detail
    ? errorDetailAsString(error.detail)
    : !Object.keys(error || '')?.length
      ? 'Unexpected error'
      : JSON.stringify(error, null, 2);
};

export const formatApiErrorList = (error?: any): string[] => {
  const errorResults = [];
  if (!error) {
    return ['An error occurred, please contact the Gatewatcher support.'];
  }

  const errorKeys = Object.keys(error).filter(k => k !== 'statusCode');
  if (errorKeys?.length) {
    for (const key of errorKeys) {
      if (Array.isArray(error[key])) {
        for (const errVal of error[key]) {
          errorResults.push(errorDetailAsString(errVal));
        }
      } else {
        const value = error[key];
        if (value && typeof value !== 'boolean') {
          errorResults.push(errorDetailAsString(error[key]));
        }
      }
    }
  }
  return errorResults;
};
