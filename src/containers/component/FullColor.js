import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
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
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map