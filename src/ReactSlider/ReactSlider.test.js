import React from 'react';
import { shallow } from 'enzyme';
import ReactSlider from './index.jsx';
import ReactDOM from 'react-dom';

const props = {
  onChange: jest.fn(),
  value: 0,
}

it('ReactSlider renders without errors', () => {
  shallow(
    <ReactSlider {...props}>
      {() => 0}
    </ReactSlider>
  );
});

it('ReactSlider getBarProps works fine', () => {
  const div = document.createElement('div');

  let currentGetBarProps;
   ReactDOM.render(
    <ReactSlider {...props}>
      {({ getBarProps }) => {
        currentGetBarProps = getBarProps;
        return <div {...getBarProps()}></div>;
      }}
    </ReactSlider>,
    div
  );

  const barProps = currentGetBarProps();

  const barRef = document.createElement('div');
  barRef.style = "position: relative";

  expect(barProps).toEqual({
    ref: {
      current: barRef,
    },
    style: {
      position: 'relative',
    }
  });
});

it('ReactSlider getGripProps works fine', () => {
  const div = document.createElement('div');

  let currentGetGripProps;
   ReactDOM.render(
    <ReactSlider {...props}>
      {({ getGripProps }) => {
        currentGetGripProps = getGripProps;
        return <button {...getGripProps()}></button>;
      }}
    </ReactSlider>,
    div
  );

  const gripProps = currentGetGripProps();
  const gripRef = document.createElement('button');
  gripRef.style = "position: absolute; top: 50%; left: 0px;";

  expect(gripProps).toEqual({
    onMouseDown: expect.any(Function),
    ref: {
      current: gripRef,
    },
    style: {
      left: 0,
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    }
  })
});
