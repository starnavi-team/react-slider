import { Component } from 'react';

export default class ReactSlider extends Component {
  getBarProps = (customProps) => {
    return {
      style: {
        position: 'relative',
      },
      ...customProps,
    }
  }

  getHandleProps = (customProps) => {
    return {
      style: {
        position: 'absolute',
      },
      ...customProps,
    }
  }

  render() {
    const {
      getBarProps,
      getHandleProps,
    } = this;

    return this.props.children({
      getBarProps,
      getHandleProps
    });
  }
}
