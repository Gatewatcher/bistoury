export type RequestOptions = RequestInit & {
  extractErrorData?: (response: Response) => Promise<unknown>;
};

export type FetchFileResult = {
  data: Blob;
  name?: string;
};
