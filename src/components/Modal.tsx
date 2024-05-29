import { useRef, type FormEvent } from 'react';
import useCloseOnLoseFocus from '../hooks/useCloseOnLoseFocus';
import useEscapeClose from '../hooks/useEscapeClose';
import { RxCross2 } from 'react-icons/rx';
type ModalProps = {
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

export default function Modal({ setIsOpen, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEscapeClose(true, () => {});
  useCloseOnLoseFocus(ref, true, () => {});
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] h-screen w-screen bg-black bg-opacity-50">
      <div className=" flex h-full w-full items-center justify-center border border-red-400 ">
        <div className="relative flex flex-col gap-4 rounded-md bg-white p-4 text-gray-700">
          <button
            role="button"
            type="button"
            title="Close modal"
            className="absolute right-2 top-2 text-black"
            onClick={() => setIsOpen(false)}
          >
            <RxCross2 />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
