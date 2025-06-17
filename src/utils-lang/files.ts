/* eslint-disable @typescript-eslint/no-explicit-any */

export const isFile = (input: any): input is File => {
  return input instanceof File;
};

export const isBlob = (input: any): input is Blob => {
  return input instanceof Blob;
};
