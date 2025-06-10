import { render } from '@testing-library/react';

import { UseWatchValueOnChangeHandler, useWatchValue } from '..';

type TestComponentProps<T> = {
  onChange: UseWatchValueOnChangeHandler<T>;
  value: T;
};

const TestComponent = <T,>({ value, onChange }: TestComponentProps<T>) => {
  useWatchValue(value, onChange);
  return null;
};

describe('useWatchValue unit tests', () => {
  it('should call onChange()', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <TestComponent onChange={onChange} value="Hello" />,
    );

    expect(onChange).not.toHaveBeenCalled();

    rerender(<TestComponent onChange={onChange} value="World" />);

    expect(onChange).toHaveBeenCalledWith({
      current: 'World',
      previous: 'Hello',
    });
  });

  it('should not call onChange()', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <TestComponent onChange={onChange} value="Hello" />,
    );

    rerender(<TestComponent onChange={onChange} value="Hello" />);

    expect(onChange).not.toHaveBeenCalled();
  });
});
