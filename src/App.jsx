import React from 'react';
import ReactSlider from './ReactSlider';
import './App.css';

const App = () => (
  <div className="App">
    <ReactSlider
      min={0}
      max={100}
      defaultValue={100}
    >
      {({
        getBarProps,
        getGripProps,
      }) => (
        <div className="react-slider">
          <div
            {...getBarProps({
              className: 'react-slider__bar',
            })}
          >
            <button
              type="button"
              {...getGripProps({
                className: 'react-slider__handle',
              })}
            />
          </div>
        </div>
      )}
    </ReactSlider>
  </div>
);

export default App;
