import React, { useEffect, useState } from "react";

const Counter = () => {
  const [counter, setCounter] = useState<number>(() => {
    const saved: string | null = localStorage.getItem("counter");
    return saved ? parseInt(saved, 10) : 0;
  });
  const handleIncrement = () => {
    handleCounterChange(setCounter, counter + 1);
  };
  const handleReset = () => {
    handleCounterChange(setCounter,0);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4">
      <h5 className="text-4xl font-medium max-w-[850px] text-center">
        So what you counting?
      </h5>
      <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center my-20">
        Counter : {counter}
      </h5>
      <div className="flex flex-row space-x-1">
        <button
          className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition"
          onClick={handleIncrement}
        >
          Increment
        </button>
        <button
          className="bg-orange-800 hover:bg-orange text-white px-6 py-3 rounded-full font-medium transition"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;
function handleCounterChange(
  setCounter: React.Dispatch<React.SetStateAction<number>>,
  updatedCounter: number
) {
  setCounter(updatedCounter);
  localStorage.setItem("counter", updatedCounter.toString());
}
