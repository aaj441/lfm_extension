import React, { useState } from 'react';
import Button from '../components/Button';
import { Rocket } from 'lucide-react';

const Home: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-4">
        <Rocket className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Welcome to your Prototype</h1>
      </div>
      <p className="text-gray-700 mb-6">
        This is a minimal React + TypeScript app with Tailwind and React Router.
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={() => setCount((c) => c + 1)}>Click me</Button>
        <span className="text-gray-600">Clicked {count} times</span>
      </div>
    </div>
  );
};

export default Home;