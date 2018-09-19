# react-slider

Simple slider for React apps based on [render prop](https://reactjs.org/docs/render-props.html)

## Installing

Via [npm](https://www.npmjs.com/)
```bash
npm i @starnavi/react-slider
```
Via [yarn](https://yarnpkg.com/)
```bash
yarn add @starnavi/react-slider
```

## Usage

All this libarary provide only one component `ReactSlider` which just calculate position of `Grip` relative of `Bar` (using css positioning), handle `Grip` drag'n'drop and return new value. To implement such behavior `ReactSlider` use its single children props function as v and provide getBarProps() and getGripProps() functions to it. It's meen that rendering and styling of component is up to you, you can nest structure as deep as you want and have full controll on component childrens and their props. `ReactSlider` just provide behavior.
 
### Example

```js
import React, { Component } from 'react';
import ReactSlider from '@starnavi/react-slider';

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
            <div>
              <div
                {...getBarProps()}
              >
                <button
                  {...getGripProps({
                    type: 'button',
                  })}
                />
              </div>
            </div>
          )}
        </ReactSlider>
        { value }
      </div>
    );
  }
}

export default App;
```
## ReactSlider props

### children: func.isRequired
[render prop](https://reactjs.org/docs/render-props.html) responsible for component rendering
### value: number.isRequired
current slider value
### onChange: func.isRequired
function called with new value as first argument 
### min: number
min value of slider 
> default `0`
### max: number
max value of slider
> default `100`
### step: number
The value will be only a multiple of this number
> default `1`

## Getting refs on Elements
if you need to get `refs` of ReactElement with getProp* function you need just to privide [callback refs](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) as a props for getProp* function
### Example
```js
<div
  {...getBarProps({
    ref: yourCallbackRef,
  })}
>
```
   
## Simple rules for component correct work, check this if you have problems

1) Provide all your custom props for Bar and Grip to its getProp* function as single first argument object. 
2) Don't change Grip positioning by hands, this component can use `position: absolute` and `left, right, top, bottom` css props for Grip and `position: relative` for Bar.
3) This component use `refs` of DOM element so getProp* functions should be called for getting props of React.CreateElement function with first argument `string` (for example `div`), it used [React.createRef API](https://reactjs.org/docs/glossary.html#refs) and forward it as `ref` by default. If you want to forward it with another name (for example for [style-components](https://www.styled-components.com/) with version < 4) use `provideRefAs` prop in getProp* function with `string`(name for `ref` you want for example `innerRef` for [style-components](https://www.styled-components.com/) with version < 4)
