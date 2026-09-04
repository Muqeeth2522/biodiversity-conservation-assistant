import React, { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Identify from './pages/Identify';
import MapView from './pages/MapView';
import About from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':     return <Home setPage={setCurrentPage} />;
      case 'identify': return <Identify />;
      case 'map':      return <MapView />;
      case 'about':    return <About />;
      default:         return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;