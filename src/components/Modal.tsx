import { useRef, type FormEvent } from 'react';
import useCloseOnLoseFocus from '../hooks/useCloseOnLoseFocus';
import useEscapeClose from '../hooks/useEscapeClose';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

export default function Modal({ isOpen, setIsOpen, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEscapeClose(true, () => {});
  useCloseOnLoseFocus(ref, true, () => {});
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] h-screen w-screen  border-8 border-blue-800  bg-black bg-opacity-50">
      <div className="flex h-full w-full items-center justify-center border border-red-400 ">{children}</div>
    </div>
  );
}
