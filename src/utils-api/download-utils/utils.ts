export const withObjectUrlFromFile = (
  file: Blob,
  callback: (objectUrl: string) => void
) => {
  if (!window.URL.createObjectURL) {
    throw new Error("window.URL.createObjectURL is not supported.");
  }

  let objectUrl: string | null = null;

  try {
    objectUrl = window.URL.createObjectURL(file);

    callback(objectUrl);
  } finally {
    if (objectUrl !== null) {
      window.URL.revokeObjectURL(objectUrl);
    }
  }
};

export const saveFileAtUrl = (url: string, name = "") => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
};
