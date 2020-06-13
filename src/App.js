import React, { useEffect, useState } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';
import nigiriMaguroA from './assets/nigiri_maguro.jpg';
import nigiriMaguroB from './assets/nigiri_maguro_b.jpg';
import nigiriMaguroC from './assets/nigiri_maguro_c.jpg';
import nigiriMaguroD from './assets/nigiri_maguro_d.png';
import nigiriSakeA from './assets/nigiri_salmon.jpg';
import nigiriSakeB from './assets/nigiri_salmon_b.jpg';
import nigiriSakeC from './assets/nigiri_salmon_c.jpg';

import './App.css';
import './table.css';
import './imageGrid.css';

const floatToPercent = (num) => (num * 100).toFixed(4);

function App() {
  let mobileNet;
  let classifier;
  let totalLoss = 0;
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasPreview, setHasPreview] = useState(false);
  const [hasTrained, setHasTrained] = useState(false);

  const setup = (p) => {
    p.setup = async () => {
      mobileNet = await ml5.featureExtractor('MobileNet');
      console.log('model ready');
      classifier = await mobileNet.classification();
      await classifier.addImage(document.getElementById('maguroA'), 'maguro');
      await classifier.addImage(document.getElementById('maguroB'), 'maguro');
      await classifier.addImage(document.getElementById('maguroC'), 'maguro');
      await classifier.addImage(document.getElementById('maguroD'), 'maguro');
      await classifier.addImage(document.getElementById('sakeA'), 'sake');
      await classifier.addImage(document.getElementById('sakeB'), 'sake');
      await classifier.addImage(document.getElementById('sakeC'), 'sake');
      console.log('images added!');
      // await train();
      // setLoading(false);
    };

    p.draw = function () {};
  };

  const train = async () => {
    setLoading(true);
    await classifier.train(whileTraining);
    setLoading(false);
    setHasTrained(true);
  };

  const whileTraining = (lossVal) => {
    if (lossVal) {
      totalLoss = lossVal;
      console.log('loss', lossVal);
    } else {
      console.log('training done! final loss', totalLoss);
    }
  };

  const handleTrainClick = async () => {
    await train();
  };

  const handlePredictClick = () => {
    const imageToPredict = document.getElementById('preview');
    if (!imageToPredict) {
      throw Error('Image to guess not avail :(');
    }
    classifier.classify(imageToPredict, (err, result) => {
      console.log('PREDICTION:', result);
      setOutput(result);
    });
  };

  const handleFileChange = (evt) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target.result) {
        document.getElementById('preview').src = e.target.result;
        setHasPreview(true);
      }
    };
    fileReader.readAsDataURL(evt.target.files[0]);
  };

  const renderOutput = () => {
    if (!output || !output.length) {
      return null;
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
    new p5(setup);
  }, []);

  return (
    <div className="App">
      <div className="datasetContainer col-50">
        <h1>Data set</h1>
        <button onClick={handleTrainClick} disabled={loading}>
          {loading ? 'Training...' : 'Train'}
        </button>
        <div className="imageGrid">
          <img src={nigiriMaguroA} id="maguroA" alt="" />
          <img src={nigiriMaguroB} id="maguroB" alt="" />
          <img src={nigiriMaguroC} id="maguroC" alt="" />
          <img src={nigiriMaguroD} id="maguroD" alt="" />
          <img src={nigiriSakeA} id="sakeA" alt="" />
          <img src={nigiriSakeB} id="sakeB" alt="" />
          <img src={nigiriSakeC} id="sakeC" alt="" />
        </div>
      </div>
      <div className="resultsContainer col-50">
        <h1>Predictions</h1>
        <div>
          <input type="file" onChange={handleFileChange} />
          <img id="preview" src="" alt="" className="img-preview" />
          <button
            onClick={handlePredictClick}
            className="bgc-secondary"
            disabled={!hasTrained || loading || !hasPreview}
          >
            Predict
          </button>
        </div>
        {renderOutput()}
      </div>
    </div>
  );
}

export default App;
