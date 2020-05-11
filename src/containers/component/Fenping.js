import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import Cesium from "cesium/Cesium";
import { Select } from 'antd';

const Option = Select.Option;
let viewer
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
        this.fs = null
        this.viewer = null;
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        var fs =
            'uniform sampler2D colorTexture;\n' +
            'varying vec2 v_textureCoordinates;\n' +
            'uniform float vibrance;\n' +
            'void main() {\n' +
            ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
            'float average = (color.r + color.g + color.b) / 3.0;\n' +
            'float mx = max(color.r, max(color.g, color.b));\n' +
            'float amt = (mx - average) * (-vibrance * 3.0);\n' +
            'color.rgb = mix(color.rgb, vec3(mx), amt);\n' +
            'gl_FragColor = color;\n' +
            '}\n';
        viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                vibrance: 1
            }
        }));
        var fragmentShaderSource = `
 uniform sampler2D colorTexture;
 varying vec2 v_textureCoordinates;

 uniform float horizontal;  // (1)
 uniform float vertical;

 void main (void) {
    float horizontalCount = max(horizontal, 1.0);  // (2)
    float verticalCount = max(vertical, 1.0);

    float ratio = verticalCount / horizontalCount;  // (3)

    vec2 originSize = vec2(1.0, 1.0);
    vec2 newSize = originSize;

    if (ratio > 1.0) {
        newSize.y = 1.0 / ratio;
    } else {
        newSize.x = ratio;
    }

    vec2 offset = (originSize - newSize) / 2.0;  // (4)
    vec2 position = offset + mod(v_textureCoordinates * min(horizontalCount, verticalCount), newSize);  // (5)

    gl_FragColor = texture2D(colorTexture, position);  // (6)
 }`;
        viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fragmentShaderSource,
            uniforms: {
                horizontal: 2,
                vertical: 3
            }
        }));
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" >
            </div>
        );
    }
}
export default Map