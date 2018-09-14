import { Component } from 'react';
import { func, number } from 'prop-types';

export default class ReactSlider extends Component {
  static propTypes = {
    minValue: number,
    maxValue: number,
    children: func.isRequired,
    defaultValue: number,
  }

  static defaultProps = {
    defaultValue: 0,
    minValue: 0,
    maxValue: 100,
  }

  constructor(props) {
    super(props);

    this.barLength = 180;
    this.gripLength = 20;

    this.state = {
      value: props.defaultValue,
    };
  }

  getGripStyle(style) {
    return {
      position: 'absolute',
      top: '50%',
      left: this.calcGripOffset(),
      transform: 'translateY(-50%)',
      ...style,
    };
  }

  getBarProps = customProps => ({
    ...customProps,
    style: {
      position: 'relative',
      ...customProps.style,
    },
  })

  getGripProps = customProps => ({
    ...customProps,
    style: this.getGripStyle(customProps.style),
  })

  calcGripOffset() {
    const {
      barLength,
      gripLength,
      state: { value },
      props: { maxValue, minValue },
    } = this;

    return (value - minValue) / (maxValue - minValue) * (barLength - gripLength);
  }

  render() {
    const {
      getBarProps,
      getGripProps,
      props: { children },
    } = this;

    return children({
      getBarProps,
      getGripProps,
    });
  }
}
