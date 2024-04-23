import { Menu } from '@headlessui/react';
import { FiEdit3 } from 'react-icons/fi';
import { IoDuplicateOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { IoMdHeart } from 'react-icons/io';
import { FaArchive } from 'react-icons/fa';
import { MdOutlineDriveFileMove } from 'react-icons/md';
import { FaRegShareSquare } from 'react-icons/fa';

export type MenuOptions =
    | 'Edit'
    | 'Duplicate'
    | 'Delete'
    | 'Favorite'
    | 'Move'
    | 'Share'
    | 'Archive';

const icons = {
    Edit: FiEdit3,
    Duplicate: IoDuplicateOutline,
    Delete: RiDeleteBinLine,
    Favorite: IoMdHeart,
    Move: MdOutlineDriveFileMove,
    Share: FaRegShareSquare,
    Archive: FaArchive,
};

type MenuItemProps = {
    type: MenuOptions;
    text: string;
    onClick?: () => void;
};

export default function MenuItem({ type, text, onClick }: MenuItemProps) {
    const Icon = icons[type];
    return (
        <div className="py-1" onClick={onClick}>
            <Menu.Item>
                {({ active }) => (
                    <a
                        href="#"
                        className={`flex items-center px-4 py-2 text-sm ${
                            active
                                ? 'bg-indigo-500 text-white'
                                : 'text-gray-700'
                        }`}
                    >
                        {Icon && (
                            <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
                        )}
                        {text}
                    </a>
                )}
            </Menu.Item>
        </div>
    );
}
