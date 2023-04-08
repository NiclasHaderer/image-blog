import { useEffect, useState } from 'react';

export const usePageFocus = () => {
  const [currentFocus, setCurrentFocus] = useState<HTMLElement>();
  useEffect(() => {
    const updateCurrentFocus = (e: Event) => setCurrentFocus(e.target as unknown as HTMLElement);

    document.addEventListener('focus', updateCurrentFocus, true);
    document.addEventListener('blur', updateCurrentFocus, true);
    return () => {
      document.removeEventListener('focus', updateCurrentFocus, true);
      document.removeEventListener('blur', updateCurrentFocus, true);
    };
  }, []);

  return currentFocus;
};
