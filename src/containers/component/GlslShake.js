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
        viewer.scene.primitives.add(Cesium.createOsmBuildings());
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
                        uniform sampler2D czm_idTexture;
                        uniform float Time;
                        void main(){             
                            vec4 bcol = texture2D(czm_idTexture, v_textureCoordinates);
                            float depth = czm_readDepth(depthTexture, v_textureCoordinates);
                            vec4 scol = texture2D(Images, vec2(fract(v_textureCoordinates.x - Time), v_textureCoordinates.y));
                            if(depth<1.0 - 0.000001 && Heights>140000.0 &&scol.a>0.3){
                                gl_FragColor = mix(bcol,scol,0.5);
                            }else{
                                gl_FragColor = bcol;
                            }
                        }`
                break;
            case 'image3':
                imagesProcess = waters
                timeHz = 1000
                fs = `
                            #define TAU 6.28318530718
                            #define MAX_ITER 5
                            uniform sampler2D colorTexture;
                            varying vec2 v_textureCoordinates;
                            uniform sampler2D depthTexture;
                            uniform float Time;
                            void main(){
                                vec2 iResolution = czm_viewport.zw;             
                                float time = Time * .5+23.0;
                              // uv should be the 0-1 uv of texture...
                                vec2 uv = gl_FragCoord.xy / iResolution.xy;  
                                #ifdef SHOW_TILING
                                vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
                                #else
                                vec2 p = mod(uv*TAU, TAU)-250.0;
                                #endif
                                vec2 i = vec2(p);
                                float c = 1.0;
                                float inten = .005;
        
                                for (int n = 0; n < MAX_ITER; n++) 
                                {
                                    float t = time * (1.0 - (3.5 / float(n+1)));
                                    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                                    c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
                                }
                                c /= float(MAX_ITER);
                                c = 1.17-pow(c, 1.4);
                                vec3 colour = vec3(pow(abs(c), 8.0));
                                colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
            
        
                                #ifdef SHOW_TILING
                                // Flash tile borders...
                                vec2 pixel = 2.0 / iResolution.xy;
                                uv *= 2.0;
        
                                float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
                                vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
                                uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
                                colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
            
                                #endif
                                vec4 bcol = texture2D(colorTexture, v_textureCoordinates);
                                float depth = czm_readDepth(depthTexture, v_textureCoordinates);
                                if(depth<1.0 - 0.000001){
                                    gl_FragColor = vec4(mix(bcol.rgb,colour,0.5),1);
                                }else{
                                    gl_FragColor = bcol;
                                }
                            }`
                break;
            case 'scaning':
                imagesProcess = waters
                timeHz = 1000
                fs = `
                         
                            uniform sampler2D colorTexture;
                            varying vec2 v_textureCoordinates;
                            uniform sampler2D depthTexture;
                            uniform vec4 Colors;
                            float RGB2Luminance(in vec3 rgb)
                            {
                                return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
                            }
                            uniform float Time;
                            void main(){
                                vec2 iResolution = czm_viewport.zw;             
                              
                                vec2 uv = gl_FragCoord.xy / iResolution.xy;  
                                vec2 pixelSize = vec2(1.0) / iResolution.xy;
                                
    // sobel stuff
    float tl = RGB2Luminance(texture2D(colorTexture, uv + -pixelSize.xy).rgb);
    float t = RGB2Luminance(texture2D(colorTexture, uv + vec2(0.0, -pixelSize.y)).rgb);
    float tr = RGB2Luminance(texture2D(colorTexture, uv + vec2(pixelSize.y, -pixelSize.x)).rgb);

    float cl = RGB2Luminance(texture2D(colorTexture, uv + vec2(-pixelSize.y, 0.0)).rgb);
	float c = RGB2Luminance(texture2D(colorTexture, uv).rgb);
    float cr = RGB2Luminance(texture2D(colorTexture, uv + vec2(pixelSize.y, 0.0)).rgb);

    float bl = RGB2Luminance(texture2D(colorTexture, uv + vec2(-pixelSize.y, pixelSize.x)).rgb);
	float b = RGB2Luminance(texture2D(colorTexture, uv + vec2(0.0, pixelSize.y)).rgb);
    float br = RGB2Luminance(texture2D(colorTexture, uv + vec2(pixelSize.y, pixelSize.x)).rgb);

    float sobelX = tl * -1.0 + tr * 1.0 + cl * -2.0 + cr * 2.0 + bl * -1.0 + br * 1.0;
    float sobelY = tl * -1.0 + t * -2.0 + tr * -1.0 + bl * 1.0 + b * 2.0 + br * 1.0;

    float sobel = sqrt(sobelX * sobelX + sobelY * sobelY);

    // scanline stuff
    float scanlineX = sin(Time * 2.0) * 0.5 + 0.5;
    vec4 textureColor = texture2D(colorTexture, uv);
    float pixelWidth = 1.0 / iResolution.y;
    float fragCoordX = gl_FragCoord.y / float(iResolution.y);

    const float scanWindowsWidthInPixels = 200.0;

    float distanceToScanline = clamp(0.0, pixelWidth * scanWindowsWidthInPixels, distance(scanlineX, fragCoordX)) / (pixelWidth * scanWindowsWidthInPixels);
    float depth = czm_readDepth(depthTexture, v_textureCoordinates);
    if(depth<1.0 - 0.000001){
        if (scanlineX > fragCoordX - pixelWidth * scanWindowsWidthInPixels && scanlineX < fragCoordX + pixelWidth * scanWindowsWidthInPixels)
    {
        if (sobel < 0.5)
        {
            gl_FragColor = vec4(mix(vec3(c), textureColor.rgb, smoothstep(0.4, 0.6, distanceToScanline)), 1.0);
        }
        else
        {
            gl_FragColor = vec4(mix(vec3(1.0, 140.0/255.0, 10.0/255.0), textureColor.rgb, smoothstep(0.1, 0.9, distanceToScanline)), 1.0);
        }
    }
    else
    {
		gl_FragColor = vec4(vec3(textureColor), 1.0);
    }
    }else{
        gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
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
                },
                Colors: Cesium.Color.POWDERBLUE
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
                    <Option value="image3">纹理混合</Option>
                    <Option value="scaning">扫描</Option>
                </Select>
            </div>
        );
    }
}
export default Map
