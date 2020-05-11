import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import Cesium from "cesium/Cesium";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import { tileset3dtilesUrl } from "../../config/data.config";
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
            'uniform vec3 offset;\n' +
            'uniform vec4 highlight;\n' +
            'void main() {\n' +
            '    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
            '    if (czm_selected()) {\n' +
            '        vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;\n' +
            '        gl_FragColor = vec4(offset, 1.0);\n' +
            '    } else { \n' +
            '        gl_FragColor = color;\n' +
            '    }\n' +
            '}\n';
        var _time = (new Date()).getTime();
        var stage = viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                highlight: function () {
                    return new Cesium.Color(0.8, 0.5, 0.0, 0.5);
                },
                offset: function () {
                    return new Cesium.Cartesian3((((new Date()).getTime() - _time) % 2000) / 2000, 0.2, 0.3);
                }
            }
        }));
        stage.selected = [];
        viewer.scene.globe.depthTestAgainstTerrain = true;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            var pickedFeature = viewer.scene.pick(movement.endPosition);
            if (Cesium.defined(pickedFeature)) {
                stage.selected = [pickedFeature]
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // Set the initial camera view to look at Manhattan
        // var initialPosition = Cesium.Cartesian3.fromDegrees(-74.01881302800248, 40.69114333714821, 753);
        // var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(21.27879878293835, -21.34390550872461, 0.0716951918898415);
        // viewer.scene.camera.setView({
        //     destination: initialPosition,
        //     orientation: initialOrientation,
        //     endTransform: Cesium.Matrix4.IDENTITY
        // });

        add3dtiles(viewer, tileset3dtilesUrl.cityModel[0].url, false)
        const initialPosition = Cesium.Cartesian3.fromDegrees(-74.01881302800248, 40.69114333714821, 1500);
        let headings = Cesium.Math.toRadians(40)
        let pitchs = Cesium.Math.toRadians(-10.0)
        cameraFlyto(viewer, initialPosition, 1000, headings, pitchs)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map