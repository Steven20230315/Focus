import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { IoFlag } from 'react-icons/io5';
import { IoFlagOutline } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { Priority } from '../types';

type PriorityPickerProps = {
  priority?: Priority;
  onPrioritySelect?: (priority: Priority) => void;
};

export default function PriorityPicker({ priority: priorityProp, onPrioritySelect }: PriorityPickerProps) {
  // const priorities = ['Urgent', 'High', 'Normal', 'Low'];

  const [priority, setPriority] = useState<Priority | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const priorities: Record<Priority, string> = {
    Urgent: 'text-red-500',
    High: 'text-yellow-500/90',
    Normal: 'text-cyan-500',
    Low: 'text-slate-300/90',
  };

  const updatePriority = (priority: Priority) => {
    setPriority(priority);
    if (onPrioritySelect) {
      onPrioritySelect(priority);
    }
  };

  return (
    <Menu as="div" className="relative flex self-center rounded-sm text-left">
      {/* // Default value of the priority is Normal */}
      <input type="text" hidden readOnly name="priority" value={priority || 'Normal'} ref={inputRef} />
      <MenuButton>
        {priorityProp ? (
          <IoFlag className={`h-5 w-5 ${priorities[priorityProp]}`} />
        ) : !priority ? (
          <IoFlagOutline className="h-5 w-5" />
        ) : (
          <IoFlag className={`h-5 w-5 ${priorities[priority]}`} />
        )}
      </MenuButton>

      <MenuItems className="absolute top-8 left-0 z-30 flex w-36 origin-top-left flex-col items-center justify-center rounded-md border border-black bg-slate-600 transition-all">
        {Object.entries(priorities).map(([key, value]) => (
          <MenuItem key={key}>
            {({ focus }) => (
              <button
                type="button"
                onClick={() => updatePriority(key as Priority)}
                className={`mx-auto flex w-full items-center gap-5 rounded-md px-2 py-1 text-lg ${value} ${focus ? 'bg-slate-300 opacity-80' : ''} `}
              >
                <IoFlag className="h-5 w-5" />
                <span>{key}</span>
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
