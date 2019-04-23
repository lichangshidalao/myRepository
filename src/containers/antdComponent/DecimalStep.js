import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';


class DecimalStep extends React.Component {
  constructor() {
    super()
    this.state = {
      inputValue: 0,
    }
  }
  onChange(value) {
    if (Number.isNaN(value)) {
      return;
    }
    this.setState({
      inputValue: value,
    });
  }

  render() {
    const { inputValue } = this.state;
    return (
      <Row>
        <Col span={0.5}>
          <Slider
            min={0}
            max={1}
            onChange={this.onChange.bind(this)}
            value={typeof inputValue === 'number' ? inputValue : 0}
            step={0.01}
          />
        </Col>
        <Col span={0.3}>
          <InputNumber
            min={0}
            max={1}
            style={{ marginLeft: 16 }}
            step={0.01}
            value={inputValue}
            onChange={this.onChange.bind(this)}
          />
        </Col>
      </Row>
    );
  }
}

export { DecimalStep }
