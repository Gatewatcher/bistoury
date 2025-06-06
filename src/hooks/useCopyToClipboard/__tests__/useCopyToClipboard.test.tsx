import { renderHook } from "@testing-library/react";

import { ERROR_NOT_AVAILABLE, ERROR_UNKNOWN, useCopyToClipboard } from "..";

describe("useCopyToClipboard", () => {
  const renderUseCopyToClipboard = (
    ...args: Parameters<typeof useCopyToClipboard>
  ) => {
    const { rerender, ...rest } = renderHook(
      (args) => useCopyToClipboard(...args),
      {
        initialProps: args,
      }
    );

    return {
      rerender: (...args: Parameters<typeof useCopyToClipboard>) =>
        rerender(args),
      ...rest,
    };
  };

  const defaultClipboardWriteText: (data: string) => Promise<void> = () =>
    new Promise((resolve: (value: void | PromiseLike<void>) => void) => {
      resolve();
    });

  const mockClipboard = (writeTextImpl = defaultClipboardWriteText) => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: writeTextImpl,
      },
    });

    return vi.spyOn(window.navigator.clipboard, "writeText");
  };

  const restoreClipboard = () => {
    Object.assign(window.navigator, {
      clipboard: null,
    });
  };

  afterEach(() => {
    restoreClipboard();
  });

  it("calls window.navigator.clipboard.writeText() with the data", async () => {
    const SAMPLE_TEXT = "Hello world!";
    const clipboardSpy = mockClipboard();

    await renderUseCopyToClipboard(SAMPLE_TEXT).result.current();

    expect(clipboardSpy).toHaveBeenCalledWith(SAMPLE_TEXT);
  });

  it("should call onSuccess() if the copy was successful", async () => {
    mockClipboard();
    const onSuccess = vi.fn();

    await renderUseCopyToClipboard("", { onSuccess }).result.current();

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should call onError() if the clipboard is not available, with the message", async () => {
    const onError = vi.fn();

    await renderUseCopyToClipboard("", { onError }).result.current();

    expect(onError).toHaveBeenCalledWith(ERROR_NOT_AVAILABLE);
  });

  it("should call onError() with an unknown error", async () => {
    mockClipboard(() => {
      throw "Oops";
    });
    const onError = vi.fn();

    await renderUseCopyToClipboard("", { onError }).result.current();

    expect(onError).toHaveBeenCalledWith(ERROR_UNKNOWN);
  });

  it("calls window.navigator.clipboard.writeText() with new data after re-render", async () => {
    const SAMPLE_TEXT_1 = "Hello world!";
    const SAMPLE_TEXT_2 = "Updated Hello world!";

    const clipboardSpy = mockClipboard();

    const hook = renderUseCopyToClipboard(SAMPLE_TEXT_1);
    await hook.result.current();
    hook.rerender(SAMPLE_TEXT_2);
    await hook.result.current();

    expect(clipboardSpy).toHaveBeenNthCalledWith(1, SAMPLE_TEXT_1);
    expect(clipboardSpy).toHaveBeenNthCalledWith(2, SAMPLE_TEXT_2);
  });

  it("calls onSuccess() after a re-render", async () => {
    const onSuccess = vi.fn();

    mockClipboard();

    const hook = renderUseCopyToClipboard("");
    await hook.result.current();
    hook.rerender("", { onSuccess });
    await hook.result.current();

    expect(onSuccess).toHaveBeenCalled();
  });

  it("calls onError() after a re-render", async () => {
    const onError = vi.fn();

    const hook = renderUseCopyToClipboard("");
    await hook.result.current();
    hook.rerender("", { onError });
    await hook.result.current();

    expect(onError).toHaveBeenCalled();
  });
});
