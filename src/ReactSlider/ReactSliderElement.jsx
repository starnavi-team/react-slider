import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ReactSliderElement extends Component {
  static propTypes = {
    forceUpdateReactSlider: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { forceUpdateReactSlider } = this.props;
    forceUpdateReactSlider();
  }

  render() {
    const {
      children,
      innerRef,
      forceUpdateReactSlider,
      tagName,
      ...newProps
    } = this.props;

    const Element = tagName || 'div';
    return (
      <Element {...newProps} ref={innerRef}>
        {children}
      </Element>
    );
  }
}
