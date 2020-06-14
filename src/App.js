import React, {useEffect, useState} from 'react';

import MobileNet from "./MobileNet";
import KNN from "./KNN";

import './App.css';
import './table.css';
import './imageGrid.css';

function App() {
  const hash = window.location.hash;
  const tab = hash === '#mobilenet' ? 0 : 1;
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#mobilenet';
      setActiveTab(0);
    }
  }, []);

  return (
    <div className="App">
      <header>
        <a href="#mobilenet" onClick={() => setActiveTab(0)}>
          MobileNet
        </a>
        <a href="#knn" onClick={() => setActiveTab(1)}>
          KNN
        </a>
      </header>
      {activeTab === 0 && <MobileNet />}
      {activeTab === 1 && <KNN />}
    </div>
  );
}

export default App;
