import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import * as Cesium from "cesium/Cesium";
import { Button } from 'antd';
//const viewer

let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
        this.viewer = null
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        var fs =
            'uniform sampler2D colorTexture;\n' +
            'varying vec2 v_textureCoordinates;\n' +
            'uniform float scale;\n' +
            'uniform vec3 offset;\n' +
            'void main() {\n' +
            '    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
            '    gl_FragColor = vec4(color.rgb * scale + offset, 1.0);\n' +
            '}\n';

        var _time = (new Date()).getTime();
        viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                scale: 1.1,
                offset: function () {
                    return new Cesium.Cartesian3((((new Date()).getTime() - _time) % 10000) / 10000, 0.2, 0.3);
                }
            }
        }));
    }
    handleClick() {
        viewer.scene.postProcessStages.removeAll()
        let fs = `
        uniform sampler2D colorTexture;
        varying vec2 v_textureCoordinates;
        uniform float vigScale;
            void main()
            {
                vec2 uv = v_textureCoordinates;

                uv *=  1.0 - uv.yx;   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !

                float vig = uv.x*uv.y * 15.0; // multiply with sth for intensity

                vig = pow(vig, vigScale); // change pow for modifying the extend of the  vignette

                vec4 color = texture2D(colorTexture, v_textureCoordinates);

                gl_FragColor = vec4(vig) * color;
            }`

        let startVig = 0.25, shrink = true
        viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                vigScale: function () {
                    if (shrink) {
                        startVig += 0.1
                        
                    } else {
                        startVig -= 0.1
                    }
                    if (startVig > 10) {
                        shrink = false
                    }
                    if (startVig < 0.25) {
                        shrink = true
                    }
                    return startVig
                }
            }
        }));
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" >
                <Button className="baiduButton" onClick={this.handleClick}>动态收缩</Button>
            </div>
        );
    }
}
export default Map