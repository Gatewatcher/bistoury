/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { ApiError, DefaultResponseError } from './../utils-api';
import { TestId, TestIdLoading } from './../utils-types';

export const suffixTestId = (baseId: TestId, ...suffixes: TestId[]): TestId =>
  `${baseId}-${suffixes.join('-')}`;

export const expectToBeVisibleInTheDocument = async (
  testId: TestId | RegExp,
  method = screen.findByTestId,
) => {
  const element = await method(testId);
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectNotToBeVisibleInTheDocument = async (
  testId: TestId | RegExp,
  method = screen.queryByTestId,
) => {
  const element = await method(testId);
  expect(element).toBeNull();
  expect(element).not.toBeInTheDocument();
};

export const expectIsLoading = async (
  loaderId: TestIdLoading = 'circular-loader',
) => {
  await expectToBeVisibleInTheDocument(loaderId);
};

export const expectDefaultResponseError = async (
  error: ApiError | string = DefaultResponseError,
) => {
  await waitFor(
    async () => {
      await expectToBeVisibleInTheDocument(
        typeof error === 'string' ? error : error.detail,
        screen.findByText,
      );
    },
    { timeout: 3000 },
  );
};

export const waitForLoaderToBeRemoved = async (
  loaderId: TestIdLoading = 'circular-loader',
): Promise<any> => {
  await waitForElementToBeRemoved(() => screen.getAllByTestId(loaderId));
  await new Promise(process.nextTick);
};
