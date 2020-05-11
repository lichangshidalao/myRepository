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
            `
        uniform sampler2D colorTexture;
        varying vec2 v_textureCoordinates;
        uniform float Time;
        
        void main (void) {
            float duration = 1.1;
            float maxAlpha = 0.5;
            float maxScale = 3.0;
        
            float progress = mod(Time, duration) / duration; 
            float alpha = maxAlpha * (1.0 - progress);
            float scale = 1.0 + (maxScale - 1.0) * progress;
        
            float weakX = 0.5 + (v_textureCoordinates.x - 0.5) / scale;
            float weakY = 0.5 + (v_textureCoordinates.y - 0.5) / scale;
            vec2 weakTextureCoords = vec2(weakX, weakY);
        
            vec4 weakMask = texture2D(colorTexture, weakTextureCoords);
        
            vec4 mask = texture2D(colorTexture, v_textureCoordinates);
            if (czm_selected()) {
                gl_FragColor = mask * (1.0 - alpha) + weakMask * alpha;
                } else { 
                    gl_FragColor = mask;
               }
        }
        `
        var _time = new Date()
        var stage = viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fs,
            uniforms: {
                Time: function () {
                    return ((new Date()).getTime() - _time) / 600;
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