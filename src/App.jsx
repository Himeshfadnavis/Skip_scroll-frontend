import { useState } from 'react';
import Hero from './Hero';
import SecondPage from './SecondPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('hero');

  const handleStartVibe = () => {
    setCurrentPage('second');
  };

  return (
    <>
      {currentPage === 'hero' && <Hero onStart={handleStartVibe} />}
      {currentPage === 'second' && <SecondPage onBack={() => setCurrentPage('hero')} />}
    </>
  );
}

export default App;
