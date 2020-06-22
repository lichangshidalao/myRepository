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
        viewer.shouldAnimate = true
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
        var position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706);
        var url = "http://localhost:8080/Apps/SampleData/models/CesiumMan/Cesium_Man.glb";
        viewer.trackedEntity = viewer.entities.add({
            name: url,
            position: position,
            model: {
                uri: url,
            },
        });
    }
    handleChange(value) {
        viewer.scene.postProcessStages.removeAll()
        let fs
        switch (value) {
            case 'laozhaopian':
                fs =
                    `
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                uniform float Time;
                
                void main (void) {
                    float duration = 0.7;
                    float maxAlpha = 0.4;
                    float maxScale = 1.8;
                
                    float progress = mod(Time, duration) / duration; // 0~1
                    float alpha = maxAlpha * (1.0 - progress);
                    float scale = 1.0 + (maxScale - 1.0) * progress;
                
                    float weakX = 0.5 + (v_textureCoordinates.x - 0.5) / scale;
                    float weakY = 0.5 + (v_textureCoordinates.y - 0.5) / scale;
                    vec2 weakTextureCoords = vec2(weakX, weakY);
                
                    vec4 weakMask = texture2D(colorTexture, weakTextureCoords);
                
                    vec4 mask = texture2D(colorTexture, v_textureCoordinates);
                
                    gl_FragColor = mask * (1.0 - alpha) + weakMask * alpha;
                }`
                break;
            case 'darkgreen':
                fs =
                    `
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                uniform float Time;
                
                void main (void) {
                    float duration = 0.7;
                    float maxScale = 1.1;
                    float offset = 0.02;
                
                    float progress = mod(Time, duration) / duration; // 0~1
                    vec2 offsetCoords = vec2(offset, offset) * progress;
                    float scale = 1.0 + (maxScale - 1.0) * progress;
                
                    vec2 ScaleTextureCoords = vec2(0.5, 0.5) + (v_textureCoordinates - vec2(0.5, 0.5)) / scale;
                
                    vec4 maskR = texture2D(colorTexture, ScaleTextureCoords + offsetCoords);
                    vec4 maskB = texture2D(colorTexture, ScaleTextureCoords - offsetCoords);
                    vec4 mask = texture2D(colorTexture, ScaleTextureCoords);
                
                    gl_FragColor = vec4(maskR.r, mask.g, maskB.b, mask.a);
                }`
                break;
            case 'freeze':
                fs =
                    `
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                
                uniform float Time;
                
                const float PI = 3.1415926;
                
                float rand(float n) {
                    return fract(sin(n) * 43758.5453123);
                }
                
                void main (void) {
                    float maxJitter = 0.06;
                    float duration = 0.3;
                    float colorROffset = 0.01;
                    float colorBOffset = -0.025;
                
                    float time = mod(Time, duration * 2.0);
                    float amplitude = max(sin(time * (PI / duration)), 0.0);
                
                    float jitter = rand(v_textureCoordinates.y) * 2.0 - 1.0; // -1~1
                    bool needOffset = abs(jitter) < maxJitter * amplitude;
                
                    float textureX = v_textureCoordinates.x + (needOffset ? jitter : (jitter * amplitude * 0.006));
                    vec2 textureCoords = vec2(textureX, v_textureCoordinates.y);
                
                    vec4 mask = texture2D(colorTexture, textureCoords);
                    vec4 maskR = texture2D(colorTexture, textureCoords + vec2(colorROffset * amplitude, 0.0));
                    vec4 maskB = texture2D(colorTexture, textureCoords + vec2(colorBOffset * amplitude, 0.0));
                
                    gl_FragColor = vec4(maskR.r, mask.g, maskB.b, mask.a);
                }`
                break;
            case 'rongzhu':
                fs =
                    `
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                
                uniform float Time;
                
                const float PI = 3.1415926;
                
                void main (void) {
                    float duration = 0.6;
                
                    float time = mod(Time, duration);
                
                    vec4 whiteMask = vec4(1.0, 1.0, 1.0, 1.0);
                    float amplitude = abs(sin(time * (PI / duration)));
                
                    vec4 mask = texture2D(colorTexture, v_textureCoordinates);
                
                    gl_FragColor = mask * (1.0 - amplitude) + whiteMask * amplitude;
                }`
                break;
            case 'shendu':
                fs = `
                uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                uniform sampler2D depthTexture;
                float near = 0.1; 
                float far  = 100.0; 
                float getDepth(in vec4 depth){
                float z_window = czm_unpackDepth(depth);
                    z_window = czm_reverseLogDepth(z_window);
                    float n_range = czm_depthRange.near;
                    float f_range = czm_depthRange.far;
                    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
                }
                float LinearizeDepth(float depth) {
                    float z = depth * 2.0 - 1.0; // back to NDC 
                    return (2.0 * near * far) / (far + near - z * (far - near));    
                }
                void main(){             
                    float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));
                    float depth2 = LinearizeDepth(depth) / far; 
                    gl_FragColor = vec4(vec3(depth2), 1.0);
                }`
                break;
            default:
                throw new Error('不支持的特效类型：' + value);
        }
        var _time = new Date()
        viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                Time: function () {
                    return ((new Date()).getTime() - _time) / 600;
                }
            }
        }));
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" >
                <Select defaultValue="click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="shendu">深度图</Option>
                    <Option value="laozhaopian">灵魂出窍</Option>
                    <Option value="darkgreen">抖动</Option>
                    <Option value="freeze">毛刺</Option>
                    <Option value="rongzhu">闪白</Option>
                </Select>
            </div>
        );
    }
}
export default Map
