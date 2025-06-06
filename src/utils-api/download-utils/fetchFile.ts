import { HttpError } from "./HttpError";
import { FetchFileResult, RequestOptions } from "./types";

export const fetchFile = async (
  url: string,
  { method = "GET", ...options }: RequestOptions = {}
): Promise<FetchFileResult> => {
  const response = await fetch(url, {
    method,
    ...options,
  });

  if (!response.ok) {
    throw new HttpError("File fetching failed.", response);
  }

  const data = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition") ?? "";
  const name = contentDisposition.split("filename=")[1];

  return {
    data,
    name,
  };
};
