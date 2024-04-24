type ToggleButtonProps = {
    onClick?: () => void;
    id: string;
};

export default function ToggleButton({
    onClick,
    id,
}: ToggleButtonProps) {
    return (
        <label
            htmlFor={id}
            className="item-center jsutify-end inline-flex cursor-pointer"
        >
            <input
                type="checkbox"
                name=""
                id={id}
                title="toggle sidebar"
                className="peer sr-only"
            />
            <div
                onClick={onClick}
                className="peer relative ml-auto h-6 w-11 rounded-full bg-sky-400/90 shadow-lg shadow-sky-200 after:absolute after:start-[22px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-sky-50 after:transition-all after:content-[''] peer-checked:bg-gray-500/90 peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full"
            ></div>
        </label>
    );
}
