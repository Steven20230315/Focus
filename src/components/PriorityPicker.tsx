import { Menu, Transition } from '@headlessui/react';
import { IoFlag } from 'react-icons/io5';
import { IoFlagOutline } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { Priority } from '../types';
export default function PriorityPicker() {
  // const priorities = ['Urgen', 'High', 'Normal', 'Low'];

  const [priority, setPriority] = useState<Priority | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const priorities: Record<Priority, string> = {
    Urgen: 'text-red-500',
    High: 'text-yellow-500/90',
    Normal: 'text-cyan-500',
    Low: 'text-slate-500/90',
  };
  return (
    <Menu
      as="div"
      className="relative  flex self-center rounded-sm border border-stone-400 p-1  text-left shadow-sm shadow-black/30 "
    >
      {/* // Default value of the priority is Normal */}
      <input type="text" hidden readOnly name="priority" value={priority || 'Normal'} ref={inputRef} />
      <Menu.Button>
        {!priority ? (
          <IoFlagOutline className="h-5 w-5 bg-transparent " />
        ) : (
          <IoFlag className={`h-5 w-5 ${priorities[priority]}`} />
        )}
      </Menu.Button>
      <Transition
        enter="transform transition duration-100 ease-in"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transform duration-75 ease-out"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 flex w-36 origin-top-left flex-col items-center justify-center rounded-md border border-black bg-slate-600 ">
          {Object.entries(priorities).map(([key, value]) => (
            <div className="w-full px-1 py-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setPriority(key as Priority)}
                    className={`mx-auto flex w-full items-center gap-5 rounded-md px-2 py-1 text-lg ${value} ${active ? 'bg-slate-300 opacity-80' : ''} `}
                  >
                    <IoFlag className="h-5 w-5" />
                    <span>{key}</span>
                  </button>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
