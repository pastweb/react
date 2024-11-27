import { MutableRefObject } from 'react';
import { setRef } from '../../src/setRef';

const element = document.createElement('div');

describe('setRef', () => {
  it('should set the ref using a MutableRefObject', () => {
    const ref = { current: null } as MutableRefObject<HTMLDivElement | null>;
    setRef(ref, element);

    // Verify that the ref was set correctly
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should set the ref using a callback ref', () => {
    let refElement: HTMLDivElement | null = null;

    const handleRef = (element: HTMLDivElement | null) => {
      setRef((ref: HTMLDivElement | null) => {
        refElement = ref;
      }, element);
    };

    handleRef(element);

    // Verify that the callback ref was set correctly
    expect(refElement).not.toBeNull();
    expect(refElement).toBeInstanceOf(HTMLDivElement);
  });
});
