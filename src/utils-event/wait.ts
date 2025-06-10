export const waitTime = async (timeout: number) => {
  await new Promise(r => setTimeout(r, timeout));
};
