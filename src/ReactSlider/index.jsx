import React, { Component } from 'react';
import { func, number } from 'prop-types';

export default class ReactSlider extends Component {
  static propTypes = {
    min: number,
    max: number,
    step: number,
    defaultValue: number,
    children: func.isRequired,
    onChange: func,
  }

  static defaultProps = {
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    onChange: () => 0,
  }

  constructor(props) {
    super(props);

    this.mouseDownCords = null;
    this.barRef = React.createRef();
    this.gripRef = React.createRef();
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

  getNewValue(clientX) {
    const { max, min, step } = this.props;

    const barLength = this.barRef.current.offsetWidth;
    const gripLength = this.gripRef.current.offsetWidth;
    const scrollableLength = barLength - gripLength;
    const valuePerOffset = max / scrollableLength;

    const offset = this.mouseDownOffset + clientX - this.mouseDownCursorCords.x;

    let newValue = valuePerOffset * offset;
    newValue = Math.round(newValue / step) * step;
    newValue = Math.min(Math.max(newValue, min), max);

    return newValue;
  }

  getBarProps = customProps => ({
    ...customProps,
    style: {
      position: 'relative',
      ...customProps.style,
    },
    innerRef: this.barRef,
    forceUpdateReactSlider: this.forceUpdateReactSlider,
  })

  getGripProps = customProps => ({
    ...customProps,
    style: this.getGripStyle(customProps.style),
    onMouseDown: this.handleGripMouseDown(customProps.onMouseDown),
    innerRef: this.gripRef,
    forceUpdateReactSlider: this.forceUpdateReactSlider,
  })

  forceUpdateReactSlider = () => this.forceUpdate();

  handleDocumentMouseUp = () => {
    this.removeDocumentListeners();
    this.mouseDownCords = null;
  }

  handleDocumentMouseMove = (e) => {
    const {
      state: { value },
      props: { onChange },
    } = this;

    const newValue = this.getNewValue(e.clientX);

    if (newValue === value) {
      return;
    }

    this.setState({
      value: newValue,
    }, () => {
      onChange(newValue);
    });
  }

  handleGripMouseDown(customOnMouseDown) {
    return (e) => {
      if (customOnMouseDown) {
        customOnMouseDown(e);
      }

      this.mouseDownCursorCords = {
        x: e.clientX,
        y: e.clientY,
      };

      const barRect = this.barRef.current.getBoundingClientRect();
      const gripRect = this.gripRef.current.getBoundingClientRect();
      this.mouseDownOffset = gripRect.left - barRect.left;

      document.addEventListener('mousemove', this.handleDocumentMouseMove);
      document.addEventListener('mouseup', this.handleDocumentMouseUp);
    };
  }

  removeDocumentListeners() {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  calcGripOffset() {
    const {
      state: { value },
      props: { max, min },
    } = this;

    if (!this.barRef.current || !this.gripRef.current) {
      return 0;
    }

    const barLength = this.barRef.current.offsetWidth;
    const gripLength = this.gripRef.current.offsetWidth;
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
