import { IoCheckmark } from 'react-icons/io5';
type CheckboxProps = {
  id: string;
};

export default function Checkbox2({ id }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2 border border-black">
      {/* To center mark icon in the checkbox. This container create a square that both input and mark icon live in */}
      <div className="relative ml-1 flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          name="task checkbox"
          id={id}
          className="peer h-full w-full appearance-none rounded-full border border-black checked:border-2 hover:border hover:opacity-70"
        />
        <IoCheckmark className="absolute hidden  text-sm text-black peer-checked:block peer-hover:block peer-hover:opacity-70" />
      </div>
      <label htmlFor={id}>Task 1</label>
    </div>
  );
}
