import React, {useState} from 'react';

import MobileNet from "./MobileNet";
import KNN from "./KNN";

import './App.css';
import './table.css';
import './imageGrid.css';

function App() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="App">
      <header>
        <a href="#" onClick={() => setActiveTab(0)}>
          MobileNet
        </a>
        <a href="#" onClick={() => setActiveTab(1)}>
          KNN
        </a>
      </header>
      {activeTab === 0 && <MobileNet />}
      {activeTab === 1 && <KNN />}
    </div>
  );
}

export default App;
