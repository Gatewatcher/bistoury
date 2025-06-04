export const generateUniqId = () => {
  return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
};
