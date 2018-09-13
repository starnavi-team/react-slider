import React, { Component } from 'react';
import ReactSlider from './ReactSlider';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ReactSlider
          min={0}
          max={100}
          defaultValue={20}
        >
          {({
            getBarProps,
            getHandleProps,
          }) => {
            return (
              <div className="react-slider">
                <div
                  {...getBarProps({
                    className: 'react-slider__bar',
                  })}
                >
                  <button
                    {...getHandleProps({
                      className: 'react-slider__handle',
                    })}
                  />
                </div>
              </div>
            );
          }}
        </ReactSlider>
      </div>
    );
  }
}

export default App;
