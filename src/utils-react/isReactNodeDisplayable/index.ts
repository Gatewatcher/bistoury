import { ReactNode } from 'react';

import { isDefined } from './../../utils-lang';

export const isReactNodeDisplayable = (
  node: ReactNode,
): node is NonNullable<Exclude<ReactNode, boolean>> => {
  return isDefined(node) && typeof node !== 'boolean';
};
