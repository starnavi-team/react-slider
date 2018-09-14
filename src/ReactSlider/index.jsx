import { Component } from 'react';
import { func, number } from 'prop-types';

export default class ReactSlider extends Component {
  static propTypes = {
    min: number,
    max: number,
    step: number,
    children: func.isRequired,
    defaultValue: number,
  }

  static defaultProps = {
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
  }

  constructor(props) {
    super(props);

    this.barLength = 180;
    this.gripLength = 20;

    this.state = {
      value: props.defaultValue,
    };
  }

  componentWillUnmount() {
    this.removeDocumentListeners();
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
    onMouseDown: this.handleGripMouseDown(customProps.onMouseDown),
  })

  removeDocumentListeners = () => {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.removeDocumentListeners);
  }

  handleDocumentMouseMove = (e) => {
    console.log(e.clientX);
  }

  handleGripMouseDown(customOnMouseDown) {
    return (e) => {
      if (customOnMouseDown) {
        customOnMouseDown(e);
      }

      document.addEventListener('mousemove', this.handleDocumentMouseMove);
      document.addEventListener('mouseup', this.removeDocumentListeners);
    };
  }

  calcGripOffset() {
    const {
      barLength,
      gripLength,
      state: { value },
      props: { max, min },
    } = this;

    return (value - min) / (max - min) * (barLength - gripLength);
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
