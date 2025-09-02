import React, { useState } from 'react'

const Home = () => {
  const [counter,setCounter] = useState<number>(0);

  const handleIncrement = () => {
    setCounter(counter+1);
  };
  return (
    <div>
      <h1>Counter Home Page</h1>
      <h2>Counter : {counter}</h2>
      <button onClick={handleIncrement}>increment</button>
    </div>
  )
}

export default Home