import React, { useEffect, useState } from "react";

const Home = () => {
  const [counter, setCounter] = useState<number>(() => {
    const saved: string | null = localStorage.getItem("counter");
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleIncrement = () => {
    const updatedCounter:number = counter + 1;
    setCounter(updatedCounter);
    localStorage.setItem("counter",updatedCounter.toString());
  };

  return (
    <div>
      <h1>Counter Home Page</h1>
      <h2>Counter : {counter}</h2>
      <button onClick={handleIncrement}>increment</button>
    </div>
  );
};

export default Home;
