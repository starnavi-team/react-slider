import React, { Component } from 'react';
import { func, number } from 'prop-types';

export default class ReactSlider extends Component {
  static propTypes = {
    min: number,
    max: number,
    step: number,
    value: number.isRequired,
    children: func.isRequired,
    onChange: func.isRequired,
  }

  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
  }

  constructor(props) {
    super(props);

    this.mouseDownCords = null;
    this.barRef = React.createRef();
    this.gripRef = React.createRef();
  }

  componentDidMount() {
    this.forceUpdate();
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

  getBarProps = (customProps = {}) => {
    const {
      provideRefAs,
      style: customStyle,
      ref,
      ...extraProps
    } = customProps;

    if (ref) {
      ref(this.barRef.current);
    }

    return {
      style: {
        position: 'relative',
        ...customStyle,
      },
      [provideRefAs || 'ref']: this.barRef,
      ...extraProps,
    };
  }

  getGripProps = (customProps = {}) => {
    const {
      provideRefAs,
      style: customStyle,
      onMouseDown: customOnMouseDown,
      ref,
      ...extraProps
    } = customProps;

    if (ref) {
      ref(this.gripRef.current);
    }

    return {
      style: this.getGripStyle(customStyle),
      onMouseDown: this.handleGripMouseDown(customOnMouseDown),
      [provideRefAs || 'ref']: this.gripRef,
      ...extraProps,
    };
  }

  handleDocumentMouseUp = () => {
    this.removeDocumentListeners();
    this.mouseDownCords = null;
  }

  handleDocumentMouseMove = (e) => {
    const { onChange, value } = this.props;

    const newValue = this.getNewValue(e.clientX);

    if (newValue === value) {
      return;
    }

    onChange(newValue);
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
    const { max, min, value } = this.props;

    if (!this.barRef.current || !this.gripRef.current) {
      return 0;
    }

    if (!this.barRef.current.offsetWidth) {
      throw new ReferenceError(`"react-slider" instance barRef.current.offsetWidth is undefined,
        maybe you forgot to provide "provideRefAs" prop inside getBarProps().
        Take a look to "provideRefAs" in "react-slider" doc.`);
    }
    if (!this.gripRef.current.offsetWidth) {
      throw new ReferenceError(`"react-slider" instance barRef.current.offsetWidth is undefined,
        maybe you forgot to provide "provideRefAs" prop inside getBarProps().
        Take a look to "provideRefAs" in "react-slider" doc.`);
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
