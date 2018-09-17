import React from 'react';
import { shallow } from 'enzyme';
import ReactSlider from './index.jsx';
import ReactDOM from 'react-dom';

const props = {
  onChange: jest.fn(),
  value: 0,
}

it('ReactSlider rendered without errors', () => {
  shallow(
    <ReactSlider {...props}>
      {() => 0}
    </ReactSlider>
  );
});

it('ReactSlider getBarProps provides correct props', () => {
  const div = document.createElement('div');

  let barProps;
   ReactDOM.render(
    <ReactSlider {...props}>
      {({ getBarProps }) => {
        barProps = getBarProps();
        return <div {...barProps}></div>;
      }}
    </ReactSlider>,
    div
  );

  const barRef = document.createElement('div');
  barRef.style.cssText = "position: relative";

  expect(barProps).toEqual({
    ref: {
      current: barRef,
    },
    style: {
      position: 'relative',
    }
  });
});

it('ReactSlider getBarProps provides correct props with custom props', () => {
  const div = document.createElement('div');
  let topContextBarRef = null;
  const className = 'bar';
  const content = 'content';
  const style = {
    width: 100,
    height: 20,
    position: 'absolute',
  }
  const onClick = jest.fn();
  const onMouseDown = jest.fn();

  let barProps;
   ReactDOM.render(
    <ReactSlider {...props}>
      {({ getBarProps }) => {

        barProps = getBarProps({
          style,
          ref: (ref) => topContextBarRef = ref,
          className,
          onClick,
          onMouseDown,
        });

        return (
          <div {...barProps}>{content}</div>
        );
      }}
    </ReactSlider>,
    div
  );

  const barRef = document.createElement('div');
  barRef.textContent = content;
  barRef.style.position = style.position;
  barRef.style.width = `${style.width}px`;
  barRef.style.height = `${style.height}px`;
  barRef.className = className;

  expect(topContextBarRef).toEqual(barRef);
  expect(barProps).toEqual({
    ref: {
      current: barRef,
    },
    style,
    className,
    onClick,
    onMouseDown,
  });
});

it('ReactSlider getGripProps provides correct props', () => {
  const div = document.createElement('div');

  let gripProps;
   ReactDOM.render(
    <ReactSlider {...props}>
      {({ getGripProps }) => {
        gripProps = getGripProps();
        return <button {...gripProps}></button>;
      }}
    </ReactSlider>,
    div
  );

  const gripRef = document.createElement('button');
  gripRef.style.cssText = "position: absolute; top: 50%; left: 0px;";

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

it('ReactSlider getGripProps provides correct props with custom props', () => {
  const div = document.createElement('div');
  let topContextGripRef = null;
  const className = 'grip';
  const content = 'content';
  const style = {
    width: 20,
    height: 20,
  }
  const onClick = jest.fn();
  const onMouseDown = jest.fn();

  let gripProps;
   ReactDOM.render(
    <ReactSlider {...props}>
      {({ getGripProps }) => {

        gripProps = getGripProps({
          style,
          ref: (ref) => topContextGripRef = ref,
          className,
          onClick,
          onMouseDown,
        });

        return <button {...gripProps}>{content}</button>;
      }}
    </ReactSlider>,
    div
  );

  const gripRef = document.createElement('button');
  gripRef.textContent = content;
  gripRef.className = className;
  gripRef.style.cssText = "position: absolute; top: 50%; left: 0px";
  gripRef.style.width = `${style.width}px`;
  gripRef.style.height = `${style.height}px`;

  expect(topContextGripRef).toEqual(gripRef);
  expect(gripProps).toEqual({
    onClick,
    onMouseDown: expect.any(Function),
    ref: {
      current: gripRef,
    },
    style: {
      left: 0,
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      ...style,
    },
    className,
  });
});

// it('ReactSlider gripProps.style.left=20 when value=40, min=20, max=140, barWidth=100, gripWidth=20 ', () => {
//
// });
