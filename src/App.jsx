import React, { Component } from 'react';
import ReactSlider from './ReactSlider';
import ReactSliderElement from './ReactSlider/ReactSliderElement';
import './App.css';

class App extends Component {
  defaultState = {
    value: 10,
  }

  state = this.defaultState

  handleChange = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    const { value } = this.state;
    const { value: defaultValue } = this.defaultState;
    return (
      <div className="App">
        <ReactSlider
          min={0}
          max={100}
          step={5}
          defaultValue={defaultValue}
          onChange={this.handleChange}
        >
          {({
            getBarProps,
            getGripProps,
          }) => (
            <div className="react-slider">
              <ReactSliderElement
                {...getBarProps({
                  tagName: 'div',
                  className: 'react-slider__bar',
                })}
              >
                <ReactSliderElement
                  {...getGripProps({
                    tagName: 'button',
                    type: 'button',
                    className: 'react-slider__handle',
                  })}
                />
              </ReactSliderElement>
            </div>
          )}
        </ReactSlider>
        { value }
      </div>
    );
  }
}

export default App;
