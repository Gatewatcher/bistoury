export const isInInput = (e: any): boolean => {
  const targetTagName = e.target.nodeName.toUpperCase();
  return targetTagName === 'INPUT' || targetTagName === 'TEXTAREA';
};

export const isTarget = (e: any, container: any): boolean => {
  if (container.current === null) {
    return false;
  }
  if (container.current.contains(e.target)) {
    return true;
  }
  return false;
};
