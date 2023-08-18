import { useIntersectionObserver } from './intersection-observer';
import { MutableRefObject, useEffect, useState } from 'react';

export const useHasBeenVisible = (target: MutableRefObject<HTMLDivElement | null>, scrollElement?: HTMLElement) => {
  const [visible, setVisible] = useState(false);
  const intersectionVisible = useIntersectionObserver(target, scrollElement);
  useEffect(() => {
    if (!intersectionVisible) return;
    setVisible(true);
  }, [intersectionVisible]);

  return visible;
};
