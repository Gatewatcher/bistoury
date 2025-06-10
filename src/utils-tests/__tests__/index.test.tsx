import { render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';

import {
  expectDefaultResponseError,
  expectIsLoading,
  expectNotToBeVisibleInTheDocument,
  expectToBeVisibleInTheDocument,
  suffixTestId,
  waitForLoaderToBeRemoved,
} from '..';
import { ApiError, DefaultResponseError } from './../../utils-api';
import { circularLoader, isLoading } from './../../utils-types';

describe('utils tests', () => {
  it('should suffix test id', () => {
    const baseId = 'base';
    const suffix = 'suffix';

    expect(suffixTestId(baseId, suffix)).toBe('base-suffix');
  });

  it('should be visible in the document with test id', async () => {
    const testid = 'test';
    render(<span data-testid={testid}>test</span>);

    await expectToBeVisibleInTheDocument(testid);
  });

  it('should be visible in the document with text', async () => {
    const text = 'test';
    render(<span>{text}</span>);

    await expectToBeVisibleInTheDocument(text, screen.findByText);
  });

  it('should be visible with regexp usage', async () => {
    render(<span>tESt</span>);

    await expectToBeVisibleInTheDocument(/test/i, screen.findByText);
  });

  it('shloud not be visible in the document', async () => {
    render(<span data-testid="test">text</span>);
    await expectNotToBeVisibleInTheDocument('not');
  });

  it('should be loading (circular)', async () => {
    render(<span data-testid={circularLoader}>loading</span>);
    await expectIsLoading();
  });

  it('should be loading (loading)', async () => {
    render(<span data-testid={isLoading}>loading</span>);
    await expectIsLoading('is-loading');
  });

  it('should expect default response error', async () => {
    render(<span>{DefaultResponseError.detail}</span>);
    await expectDefaultResponseError();
  });

  it('should expect custom reponse error as string', async () => {
    const error = 'You lost';
    render(<span>{error}</span>);
    await expectDefaultResponseError(error);
  });

  it('should expect custom reponse error as ApiError', async () => {
    const error: ApiError = { statusCode: 500, detail: 'server error' };
    render(<span>{error.detail}</span>);
    await expectDefaultResponseError(error);
  });

  it('should wait for loader to be removed', async () => {
    const Component = () => {
      const [showLoader, setShowLoader] = useState(true);

      useEffect(() => {
        setTimeout(() => setShowLoader(false), 500);
      }, []);

      return showLoader && <span data-testid={circularLoader}>loader</span>;
    };

    render(<Component />);
    await waitForLoaderToBeRemoved();
    expect(await screen.queryByTestId(circularLoader)).not.toBeInTheDocument();
  });
});
