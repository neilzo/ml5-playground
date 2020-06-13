import React, { useEffect, useState } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';
import otter from './assets/otter.jpg';

import './App.css';
import './table.css';

const temp1 = [
  {
    label: 'otter',
    confidence: 0.9382053017616272,
  },
  {
    label: 'weasel',
    confidence: 0.021009963005781174,
  },
  {
    label: 'black-footed ferret, ferret, Mustela nigripes',
    confidence: 0.005373395048081875,
  },
];

const floatToPercent = (num) => (num * 100).toFixed(4);

function App() {
  let mobileNet;
  const width = 640;
  const height = 480;
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(true);

  const setup = (p) => {
    p.setup = async () => {
      p.createCanvas(width, height);
      p.background(0);
      mobileNet = await ml5.imageClassifier('MobileNet');
      console.log('model ready');
      const otterImg = p.createImg(otter, 'otter', undefined, () => {
        p.image(otterImg, 0, 0, width, height);
      });
      otterImg.hide();
      mobileNet.predict(otterImg, (err, results) => {
        if (err) {
          console.error(err);
          return;
        }
        setLoading(false);
        console.log('results', results);
        setOutput(results);
      });
    };

    p.draw = function () {};
  };

  const renderOutput = () => {
    if (loading) {
      return <div>Loading... just chill for a sec 🏖</div>;
    }
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {output.map((result, index) => (
              <tr key={`result-${index}`}>
                <th>{result.label}</th>
                <td>{floatToPercent(result.confidence)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  useEffect(() => {
    new p5(setup, 'canvasContainer');
  }, []);

  return (
    <div className="App">
      <div id="canvasContainer" className="col-50" />
      <div className="resultsContainer col-50">
        <h1>Predictions:</h1>
        {renderOutput()}
      </div>
    </div>
  );
}

export default App;
