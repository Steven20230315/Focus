import { useEffect } from 'react';

function useCloseOnLoseFocus(ref: React.RefObject<HTMLElement>, isOpen: boolean, setIsOpen: (isOpen: boolean) => void) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    //Attach event listener when isOpen is true
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [ref, isOpen, setIsOpen]);
}

export default useCloseOnLoseFocus;
