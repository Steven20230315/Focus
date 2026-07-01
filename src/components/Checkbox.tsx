type ToggleButtonProps = {
  onClick?: () => void;
  id: string;
};

export default function ToggleButton({ onClick, id }: ToggleButtonProps) {
  return (
    <label htmlFor={id} className="item-center inline-flex cursor-pointer justify-end self-end">
      <input type="checkbox" name="" id={id} title="toggle sidebar" className="peer sr-only" />
      <div
        onClick={onClick}
        className="peer relative ml-auto h-6 w-11 rounded-full bg-sky-400/90 shadow-sm shadow-sky-200 peer-checked:bg-gray-500/90 after:absolute after:inset-s-5.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:bg-sky-50 after:transition-all after:content-[''] peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full"
      ></div>
    </label>
  );
}
