import { useState } from 'react';

export default function Test() {
  const [count, setCount] = useState<number>(0);
  const onClick = () => {
    setCount((state) => state + 1);
    setCount(count + 2);
    setCount((state) => state + 3);
    console.log('count', count); // count = ?
  };

  function stars2(count: number) {
    for (let i = 1; i <= count; i++) {
      console.log('*'.repeat(i));
    }
    for (let i = count - 1; i >= 1; i--) {
      console.log('*'.repeat(i));
    }
  }

  stars2(10);
  return (
    <div className="relative grid h-full grid-cols-2 border border-white">
      <div className="place-content-center items-center border border-white bg-black text-center">{count}</div>
      <div className="place-content-center items-center border border-white bg-black text-center">2</div>

      <div className="place-content-center items-center border border-white bg-black text-center">3</div>
      <div className="place-content-center items-center border border-white bg-black text-center">4</div>
      <button onClick={onClick} className="absolute left-[50%] top-[50%] border border-white p-2">
        +
      </button>
    </div>
  );
}
