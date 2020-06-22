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
        var position = Cesium.Cartesian3.fromDegrees(116.2317, 39.5427);
        var url = "http://localhost:8080/Apps/SampleData/models/CesiumMan/Cesium_Man.glb";
        var entity = viewer.entities.add({
            name: url,
            position: position,
            model: {
                uri: url,
            },
        });
        viewer.trackedEntity = entity
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
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                void main()
                {
                    vec4 color = texture2D(colorTexture, vec2(v_textureCoordinates.x, 1.0 - v_textureCoordinates.y));
                    gl_FragColor = color;
                }`
                break;
            case 'Vignette':
                fs = `
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                    void main()
                    {
                        vec2 uv = v_textureCoordinates;

                        uv *=  1.0 - uv.yx;   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !
    
                        float vig = uv.x*uv.y * 15.0; // multiply with sth for intensity
    
                        vig = pow(vig, 0.25); // change pow for modifying the extend of the  vignette

                        vec4 color = texture2D(colorTexture, v_textureCoordinates);

                        gl_FragColor = vec4(vig) * color;
                    }`
                break;
            case 'FrostedGlass':
                fs = `
                    uniform sampler2D colorTexture;
                    varying vec2 v_textureCoordinates;
                    float rand(vec2 uv) {
                        float a = dot(uv, vec2(92.0, 80.0));
                        float b = dot(uv, vec2(41.0, 62.0));
                        float x = (sin(a) + cos(b)) * 51.0;
                        return fract(x);
                    }
                        void main()
                        {
                            vec2 uv = v_textureCoordinates;
                            vec2 rnd = vec2(rand(uv), rand(uv));
                            uv += rnd * 0.05;
                            gl_FragColor = texture2D(colorTexture, uv);
                        }`
                break;
            default:
                throw new Error('不支持的特效类型：' + value);
        }
        var stage = viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
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
                    <Option value="Vignette">Vignette</Option>
                    <Option value="daozhi">颠倒</Option>
                    <Option value="FrostedGlass">Frosted Glass</Option>
                </Select>
            </div>
        );
    }
}
export default Map