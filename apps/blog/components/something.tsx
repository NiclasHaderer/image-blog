import { useState } from 'react';

export const Something = () => {
  return (
    <>
      <div>
        I am very important
        <h2>I am a subheading</h2>
        <code>I am code</code>
      </div>
      <Counter />
    </>
  );
};

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>You clicked {count} times</p>
    </div>
  );
};
