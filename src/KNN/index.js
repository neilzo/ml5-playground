import React, { useEffect, useState } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';

import './KNN.css';

let video;
let featureExtractor;
const knnClassifier = ml5.KNNClassifier();

function KNN() {
  const [counts, setCounts] = useState({});
  const [results, setResults] = useState({});
  const [predicting, setPredicting] = useState(false);
  let animationFrame;


  const setup = (p) => {
    p.setup = async () => {
      featureExtractor = await ml5.featureExtractor('MobileNet');
      p.noCanvas();
      // Create a video element
      video = p.createCapture(p.VIDEO);
      // Append it to the videoContainer DOM element
      video.parent('videoContainer');

      const buttonRock = p.select('#btnRock');
      const buttonFist = p.select('#btnFist');
      buttonRock.mousePressed(() => {
        addExample('Rock');
      });
      buttonFist.mousePressed(() => {
        addExample('Fist');
      });
    };

    p.draw = function () {};
  };

  const addExample = (label) => {
    const features = featureExtractor.infer(video);
    knnClassifier.addExample(features, label);
    setCounts(knnClassifier.getCountByLabel());
  };

  const classify = async () => {
    const features = featureExtractor.infer(video);

    // Use knnClassifier to classify which label do these features belong to
    // You can pass in a callback function `gotResults` to knnClassifier.classify function
    try {
      const results = await knnClassifier.classify(features);
      setResults(results);
    } catch (err) {
      console.error(err);
    }
  };

  const startPredicting = () => {
    const cb = () => {
        animationFrame = requestAnimationFrame(cb);
        classify();
    };
    setPredicting(true);
    animationFrame = requestAnimationFrame(cb);
  };

  const stopPredicting = () => {
    setPredicting(false);
    cancelAnimationFrame(animationFrame);
  };

  useEffect(() => {
    new p5(setup);
  }, []);

  const confidences = results.confidencesByLabel;

  return (
    <div className="KNN d-flex">
      <div className="col-50">
        <div id="videoContainer" />
      </div>
      <div className="col-50">
        <div>
          <button id="btnFist">Add ✊ Example</button>
          <span>Power: {counts.Fist}</span>
          <p>Confidence Level: {confidences && confidences.Fist}</p>
        </div>
        <div>
          <button id="btnRock">Add 🤘 Example</button>
          <span>Let's Rock: {counts.Rock}</span>
          <p>Confidence Level: {confidences && confidences.Rock}</p>
        </div>
        <div>
          <button onClick={startPredicting} className="bgc-secondary">Start Predicting</button>
          <button onClick={stopPredicting}>Stop</button>
        </div>
        <div>
          <p>
            {results.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default KNN;
