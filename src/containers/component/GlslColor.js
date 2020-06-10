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
    }
    handleChange(value) {
        viewer.scene.postProcessStages.removeAll()
        let fs
        switch (value) {
            case 'laozhaopian':
                fs =
                    'uniform sampler2D colorTexture;\n' +
                    'varying vec2 v_textureCoordinates;\n' +
                    'void main() {\n' +
                    ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' vec3 col = color.rgb;\n' +
                    ' gl_FragColor.r = 0.393*col.r+0.769*col.g+0.189*col.b;\n' +
                    ' gl_FragColor.g = 0.349*col.r+0.686*col.g+0.168*col.b;\n' +
                    ' gl_FragColor.b = 0.272*col.r+0.534*col.g+0.131*col.b;\n' +
                    ' gl_FragColor.a = 1.0;\n' +
                    '}\n';
                break;
            case 'darkgreen':
                fs =
                    'uniform sampler2D colorTexture;\n' +
                    'varying vec2 v_textureCoordinates;\n' +
                    'void main() {\n' +
                    ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' vec3 col = color.rgb;\n' +
                    ' gl_FragColor.r = pow(col.g-col.b,2.0)/0.5;\n' +
                    ' gl_FragColor.g = pow(col.r-col.b,2.0)/0.5;\n' +
                    ' gl_FragColor.b = pow(col.r-col.g,2.0)/0.5;\n' +
                    ' gl_FragColor.a = 1.0;\n' +
                    '}\n';
                break;
            case 'freeze':
                fs =
                    'uniform sampler2D colorTexture;\n' +
                    'varying vec2 v_textureCoordinates;\n' +
                    'void main() {\n' +
                    ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' vec3 col = color.rgb;\n' +
                    '   gl_FragColor.r = abs(col.r - col.g - col.b) * 3.0 / 2.0;\n' +
                    '  gl_FragColor.g = abs(col.g - col.b - col.r) * 3.0 / 2.0;\n' +
                    '  gl_FragColor.b = abs(col.b - col.r - col.g) * 3.0 / 2.0;\n' +
                    ' gl_FragColor.a = 1.0;\n' +
                    '}\n';
                break;
            case 'rongzhu':
                fs =
                    'uniform sampler2D colorTexture;\n' +
                    'varying vec2 v_textureCoordinates;\n' +
                    'void main() {\n' +
                    ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' vec3 col = color.rgb;\n' +
                    ' gl_FragColor.r = col.r*0.5/(col.g+col.b);\n' +
                    '  gl_FragColor.g = col.g*0.5/(col.r+col.b);\n' +
                    '  gl_FragColor.b = col.b*0.5/(col.r+col.g);\n' +
                    ' gl_FragColor.a = 1.0;\n' +
                    '}\n';
                break;
            case 'dark':
                fs =
                    'uniform sampler2D colorTexture;\n' +
                    'varying vec2 v_textureCoordinates;\n' +
                    'void main() {\n' +
                    ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' vec3 col = color.rgb;\n' +
                    ' gl_FragColor.r = col.r*col.r;\n' +
                    ' gl_FragColor.g = col.g*col.g;\n' +
                    ' gl_FragColor.b = col.b*col.b;\n' +
                    ' gl_FragColor.a = 1.0;\n' +
                    '}\n';
                break;
            case 'Swap':
                fs =
                    'uniform sampler2D colorTexture;\n' +
                    'varying vec2 v_textureCoordinates;\n' +
                    'void main() {\n' +
                    ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' vec3 col = color.rgb;\n' +
                    ' gl_FragColor.r = col.g*col.b;\n' +
                    ' gl_FragColor.g = col.r*col.b;\n' +
                    ' gl_FragColor.b = col.r*col.g;\n' +
                    ' gl_FragColor.a = 1.0;\n' +
                    '}\n';
                break;
            case 'gerys':
                fs = `
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                const highp vec3 W = vec3(0.2125, 0.7154, 0.0721);
                
                void main()
                {
                    lowp vec4 textureColor = texture2D(colorTexture, v_textureCoordinates);
                    float luminance = dot(textureColor.rgb, W);
                    
                    gl_FragColor = vec4(vec3(luminance), textureColor.a);
                }`
                break;
            case 'daozhi':
                fs = `
                varying vec2 colorTexture;
                uniform sampler2D v_textureCoordinates;
                void main()
                {
                    vec4 color = texture2D(colorTexture, vec2(v_textureCoordinates.x, 1.0 - v_textureCoordinates.y));
                    gl_FragColor = color;
                }`

            default:
                throw new Error('不支持的特效类型：' + value);
        }
        viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs
        }));
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" >
                <Select defaultValue="click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="laozhaopian">老照片</Option>
                    <Option value="darkgreen">碧绿</Option>
                    <Option value="freeze">冰冻</Option>
                    <Option value="rongzhu">熔铸</Option>
                    <Option value="dark">暗调</Option>
                    <Option value="Swap">对调</Option>
                    <Option value="gerys">灰度图</Option>
                    {/* <Option value="daozhi">颠倒</Option> */}
                </Select>
            </div>
        );
    }
}
export default Map