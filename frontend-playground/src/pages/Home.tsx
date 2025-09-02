import React, { useState } from 'react'

const Home = () => {
  const [counter,setCounter] = useState<number>(0);
  return (
    <div>
      <h1>Counter Home Page</h1>
      <h2>Counter : {counter}</h2>
      <button>increment</button>
    </div>
  )
}

export default Home