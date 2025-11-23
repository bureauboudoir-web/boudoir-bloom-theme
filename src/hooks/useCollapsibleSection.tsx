import { useState, useEffect } from 'react';

export function useCollapsibleSection(storageKey: string, defaultOpen: boolean = true) {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored !== null ? stored === 'true' : defaultOpen;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(isOpen));
  }, [isOpen, storageKey]);

  const toggle = () => setIsOpen(prev => !prev);

  return { isOpen, toggle };
}
