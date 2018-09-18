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

const testGetNewValue = ({
  result,
  min,
  max,
  step,
  barLength,
  gripLength,
  gripOffsetLeft,
  clientX,
  mouseDownClientX,
}) => {
  const context = {
    props: {
      min,
      max,
      step,
    },
    barRef: {
      current: {
        offsetWidth: barLength,
      },
    },
    gripRef: {
      current: {
        offsetWidth: gripLength,
      },
    },
    mouseDown: {
      clientX: mouseDownClientX,
      gripOffsetLeft,
    },
  };

  it(`ReactSlider.prototype.getNewValue() return ${result}
      for min=${min}, max=${max}, barLength=${barLength},
      gripLength=${gripLength}, clientX=${clientX}, step=${step}
      gripOffsetLeft=${gripOffsetLeft}, mouseDownClientX=${mouseDownClientX}`, () => {

    const newValue = ReactSlider.prototype.getNewValue.call(context, clientX);

    expect(newValue).toEqual(result);
  });
}

describe('ReactSlider.prototype.getNewValue works correctly', () => {
  testGetNewValue({
    result: 30,
    min: 20,
    max: 140,
    step: 10,
    barLength: 180,
    gripLength: 20,
    gripOffsetLeft: 20,
    clientX: 40,
    mouseDownClientX: 50,
  });
  testGetNewValue({
    result: 86,
    min: 50,
    max: 140,
    step: 2,
    barLength: 330,
    gripLength: 30,
    gripOffsetLeft: 150,
    clientX: 250,
    mouseDownClientX: 280,
  });

  const min = 0;
  const max = 140;
  const result = 35;
  const getNewValueProps = {
    step: 5,
    barLength: 250,
    gripLength: 50,
    gripOffsetLeft: 100,
    clientX: 250,
    mouseDownClientX: 300,
  }

  for (let distinction = -50; distinction <= 50; distinction += 10) {
    testGetNewValue({
      min: min + distinction,
      max: max + distinction,
      result: result + distinction,
      ...getNewValueProps,
    });
  };
});

const testCalcGripOffset = ({
  errorMessage,
  result,
  min,
  max,
  value,
  barLength,
  gripLength,
}) => {
  const context = {
    props: {
      min,
      max,
      value,
    },
    barRef: {
      current: {
        offsetWidth: barLength,
      },
    },
    gripRef: {
      current: {
        offsetWidth: gripLength,
      },
    },
  };

  if (!barLength) {
    it(`ReactSlider.prototype.calcGripOffset() show correct error
    when this.props.barRef.current.offsetWidth == undefined`, () => {
      expect(ReactSlider.prototype.calcGripOffset.bind(context))
        .toThrowErrorMatchingSnapshot();
    });
  } else if (!gripLength) {
    it(`ReactSlider.prototype.calcGripOffset() show correct error
    when this.props.gripRef.current.offsetWidth == undefined`, () => {
      expect(ReactSlider.prototype.calcGripOffset.bind(context))
        .toThrowErrorMatchingSnapshot();
    });
  } else {
    it(`ReactSlider.prototype.calcGripOffset() return ${result}
    for min=${min} max=${max} value=${value} barLength=${barLength} gripLength=${gripLength}`, () => {
      const newGripOffset = ReactSlider.prototype.calcGripOffset.call(context);

      expect(newGripOffset).toEqual(result);
    });
  }
}

describe('ReactSlider.prototype.calcGripOffset works correctly', () => {
  const calcGripOffsetProps = {
    result: 10,
    min: 0,
    max: 100,
    value: 10,
    barLength: 110,
    gripLength: 30,
  }

  const { result, min, max, value, barLength, gripLength } = calcGripOffsetProps;

  testCalcGripOffset({
    ...calcGripOffsetProps,
    barLength: null,
  });

  testCalcGripOffset({
    ...calcGripOffsetProps,
    gripLength: null,
  });

  for (let i = 0; i <= 10; i++) {
    for (let j = -5; j <= 5; j++) {
      testCalcGripOffset({
        result: 8 * i,
        min: min + j * 10,
        max: max + j * 10,
        value: value * i + j * 10,
        barLength: barLength + j,
        gripLength: gripLength + j,
      });
    }
  }
});
