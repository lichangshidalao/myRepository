import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import Cesium from "cesium/Cesium";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        //console.log('2019/1/2 果然一写就是一下午')
        const viewer = viewerInit(this.refs.map)
        var fs =
            'uniform sampler2D colorTexture;\n' +
            'varying vec2 v_textureCoordinates;\n' +
            'uniform float scale;\n' +
            'uniform vec3 offset;\n' +
            'void main() {\n' +
            '    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
            '    gl_FragColor = vec4(color.rgb * scale + offset, 1.0);\n' +
            '}\n';
        viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                scale: 1.1,
                offset: function () {
                    return new Cesium.Cartesian3(0.1, 0.2, 0.35);
                }
            }
        }));
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map