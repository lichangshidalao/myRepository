import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import * as Cesium from "cesium/Cesium";
import { Select } from 'antd';
import waters from '../img/water.png';
import yun from '../img/yun.png';

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
        let fs, imagesProcess = waters, timeHz = 600
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
            case 'heart':
                timeHz = 600
                fs = `
                    uniform sampler2D colorTexture;
                    varying vec2 v_textureCoordinates;
                    uniform float Time;
                    void main(){ 
                        vec2 resolution = czm_viewport.zw;
                        vec2 p=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
                        vec4 bcol = texture2D(colorTexture, v_textureCoordinates);            
                        // animate
                        float tt = mod(Time,1.5)/1.5;
                        float ss = pow(tt,.2)*0.5 + 0.5;
                        ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
                        p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);
                    
                        // shape
                    #if 0
                        p *= 0.5;
                        p.y = -0.1 - p.y*1.2 + abs(p.x)*(1.0-abs(p.x));
                        float r = length(p);
                        float d = 0.5;
                    #else
                        p.y -= 0.25;
                        float a = atan(p.x,p.y)/3.141593;
                        float r = length(p);
                        float h = abs(a);
                        float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
                    #endif
                        
                        // color
                        float s = 0.75 + 0.75*p.x;
                        s *= 1.0-0.4*r;
                        s = 0.3 + 0.7*s;
                        s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
                        vec3 hcol = vec3(1.0,0.5*r,0.3)*s;
                        vec3 col = mix(bcol.rgb,hcol, smoothstep( -0.01, 0.01, d-r));
                        gl_FragColor = vec4(col,1.0);
                    }`
                break;
            case 'image':
                imagesProcess = waters
                timeHz = 9000
                fs = `
                    uniform sampler2D colorTexture;
                    varying vec2 v_textureCoordinates;
                    uniform sampler2D Images;
                    uniform sampler2D depthTexture;
                    uniform float Heights;
                    uniform float Time;
                    void main(){             
                        vec4 bcol = texture2D(colorTexture, v_textureCoordinates);
                        float depth = czm_readDepth(depthTexture, v_textureCoordinates);
                        vec4 scol = texture2D(Images, vec2(fract(v_textureCoordinates.x - Time), v_textureCoordinates.y));
                        if(depth<1.0 - 0.000001 && Heights>140000.0 &&scol.a>0.3){
                            gl_FragColor = mix(bcol,scol,0.5);
                        }else{
                            gl_FragColor = bcol;
                        }
                    }`
                break;
            case 'image2':
                imagesProcess = yun
                timeHz = 29000
                fs = `
                        uniform sampler2D colorTexture;
                        varying vec2 v_textureCoordinates;
                        uniform sampler2D Images;
                        uniform sampler2D depthTexture;
                        uniform float Heights;
                        uniform float Time;
                        void main(){             
                            vec4 bcol = texture2D(colorTexture, v_textureCoordinates);
                            float depth = czm_readDepth(depthTexture, v_textureCoordinates);
                            vec4 scol = texture2D(Images, vec2(fract(v_textureCoordinates.x - Time), v_textureCoordinates.y));
                            if(depth<1.0 - 0.000001 && Heights>140000.0 &&scol.a>0.3){
                                gl_FragColor = mix(bcol,scol,0.5);
                            }else{
                                gl_FragColor = bcol;
                            }
                        }`
                break;
            default:
                throw new Error('不支持的特效类型：' + value);
        }
        var _time = new Date()
        let postStage = new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                Time: function () {
                    return ((new Date()).getTime() - _time) / timeHz;
                },
                Images: imagesProcess,
                Heights: function () {
                    let position = viewer.scene.camera.position
                    let p = Cesium.Cartographic.fromCartesian(position);
                    return p.height
                }
            }
        })
        viewer.scene.postProcessStages.add(postStage);
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
                    <Option value="heart">跳动的心</Option>
                    <Option value="image">图片混合</Option>
                    <Option value="image2">图片混合2</Option>
                </Select>
            </div>
        );
    }
}
export default Map
