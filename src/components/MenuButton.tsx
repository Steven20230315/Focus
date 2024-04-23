import React from 'react';
import { Menu } from '@headlessui/react';

type MenuButtonProps = {
    children?: React.ReactNode;
};

export default function MenuButton({ children }: MenuButtonProps) {
    return (
        <Menu.Button
            className={
                'inline-flex w-full justify-center  rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'
            }
        >
            {children}
        </Menu.Button>
    );
}
