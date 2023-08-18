import { MutableRefObject, useEffect, useState } from 'react';

const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= viewportHeight && rect.right <= viewportWidth;
};
export const useIntersectionObserver = (target: MutableRefObject<HTMLElement | null>, scrollElement?: HTMLElement) => {
  const [visible, setVisible] = useState(target.current ? isElementInViewport(target.current) : false);

  const callback = ([entry]: IntersectionObserverEntry[], _: IntersectionObserver) => {
    setVisible(entry.intersectionRatio > 0);
  };

  useEffect(() => {
    if (!target.current) return;
    setVisible(isElementInViewport(target.current));
    const observer = new IntersectionObserver(callback, { root: scrollElement ?? document.body, threshold: [0, 0.01] });
    observer.observe(target.current);
    return () => observer.disconnect();
  }, [target, scrollElement]);

  return visible;
};
