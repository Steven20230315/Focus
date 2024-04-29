import { useEffect } from 'react';

function useEscapeClose(isOpen: boolean, setIsOpen: (isOpen: boolean) => void) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, setIsOpen]);
}

export default useEscapeClose;
