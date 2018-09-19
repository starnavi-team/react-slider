import React, { Component } from 'react';
import styled from 'styled-components';
import ReactSlider from './ReactSlider';
// import './App.css';

const Slider = styled.div`
  width: 180px;
  height: 20px;
  padding: 10px;
  border: 1px solid black;
`;

const SliderBar = styled.div`
  width: 180px;
  background: #ccc;
  height: 100%;
`;

const SliderGrip = styled.button.attrs({
  type: 'button',
})`
  width: 20px;
  height: 20px;
`;

class App extends Component {
  state = {
    value: 50,
  }

  handleChange = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    const { value } = this.state;
    return (
      <div className="App">
        <ReactSlider
          min={40}
          max={120}
          step={7}
          value={value}
          onChange={this.handleChange}
        >
          {({ getBarProps, getGripProps }) => (
            <Slider>
              <SliderBar
                {...getBarProps({
                  provideRefAs: 'innerRef',
                })}
              >
                <SliderGrip
                  {...getGripProps({
                    provideRefAs: 'innerRef',
                  })}
                />
              </SliderBar>
            </Slider>
          )}
        </ReactSlider>
        { value }
      </div>
    );
  }
}

export default App;
