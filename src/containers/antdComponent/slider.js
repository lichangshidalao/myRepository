import { Slider, InputNumber, Row, Col } from 'antd';
import React, { Component } from 'react';

class IntegerStep extends React.Component {
    constructor() {
        super()
        this.state = {
            inputValue: 1,
        }
    }

    onChange(value) {
        this.setState({
            inputValue: value,
        });
        this.props.getColor(this.state.inputValue)
    };

    render() {
        const { inputValue } = this.state;
        return (
            <Row>
                <Col span={12}>
                    <Slider
                        min={1}
                        max={255}
                        onChange={this.onChange.bind(this)}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={1}
                        max={255}
                        style={{ marginLeft: 16 }}
                        value={inputValue}
                        onChange={this.onChange.bind(this)}
                    />
                </Col>
            </Row>
        );
    }
}
export { IntegerStep }