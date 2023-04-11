import { useEffect, useState } from 'react';

export const usePageFocus = () => {
  const [currentFocus, setCurrentFocus] = useState<HTMLElement>();
  useEffect(() => {
    const updateCurrentFocus = (e: Event) => {
      if (e.target instanceof HTMLElement) {
        setCurrentFocus(e.target);
      }
    };

    document.addEventListener('focus', updateCurrentFocus, true);
    document.addEventListener('blur', updateCurrentFocus, true);
    return () => {
      document.removeEventListener('focus', updateCurrentFocus, true);
      document.removeEventListener('blur', updateCurrentFocus, true);
    };
  }, []);

  return currentFocus;
};
