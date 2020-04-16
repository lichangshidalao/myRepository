import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
//const viewer
let viewer, handler
var startMousePosition; //开始时鼠标位置
var mousePosition; //当前鼠标位置
var defaultConfig = {
    lookFactor: .2, //调整视角速度
    moveRate: 0.5, //移动速度
    footerHeight: 2.0, //相机距地2.0米高度
};
var flags = {
    looking: false,
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
    lookUp: false,
    lookDown: false,
    lookLeft: false,
    lookRight: false,
};
class Map extends Component {
    constructor() {
        super()
        this.state = {
            buttonstatus: true
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        let CameraPostion = [116.39736944706995, 39.91170223061354, 1.6102137456927024, 6.193730634219284, -0.03940063141270711, 0]
        viewer.scene.camera.setView({
            destination:  Cesium.Cartesian3.fromDegrees(116.39736944706995, 39.91170223061354, 1.6102137456927024),
            orientation: {
                heading: 0, //航向角
                pitch: 0, //俯仰角
                roll: 0.0 //设为默认值0.0 防止侧翻
            }
        });
        viewer.clock.onTick.addEventListener(function (clock) {
            var camera = viewer.camera;
            var lookFactor = 0.05;

            if (flags.lookUp) {
                camera.lookUp(lookFactor);
            }
            if (flags.lookDown) {
                camera.lookDown(lookFactor);
            }
            if (flags.lookLeft) {
                camera.lookLeft(lookFactor);
            }
            if (flags.lookRight) {
                camera.lookRight(lookFactor);
            }


            // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
            var cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
            var moveRate = cameraHeight / 100.0;
            var direction = new Cesium.Cartesian3();

            // var ray = new Cesium.Ray(currentCamera.position, direction);
            // drawRayHelper(viewer,ray);

            if (flags.moveForward) {
                getHorizontalDirection(camera, direction);
                camera.move(direction, moveRate);
            }
            if (flags.moveBackward) {
                getHorizontalDirection(camera, direction);
                camera.move(direction, moveRate);
            }

            // if (flags.moveForward) {
            //     camera.moveForward(moveRate);
            // }
            // if (flags.moveBackward) {
            //     camera.moveBackward(moveRate);
            // }
            if (flags.moveUp) {
                camera.moveUp(moveRate);
            }
            if (flags.moveDown) {
                camera.moveDown(moveRate);
            }
            if (flags.moveLeft) {
                camera.moveLeft(moveRate);
            }
            if (flags.moveRight) {
                camera.moveRight(moveRate);
            }
        });
        document.addEventListener('keydown', function (e) {
            var flagName = getFlagForKeyCode(e.keyCode);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = true;
            }
        }, false);

        document.addEventListener('keyup', function (e) {
            var flagName = getFlagForKeyCode(e.keyCode);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = false;
            }
        }, false);
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}
export default Map

function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
        case 'W'.charCodeAt(0):
            return 'moveForward';
        case 'S'.charCodeAt(0):
            return 'moveBackward';
        case 'Q'.charCodeAt(0):
            return 'moveUp';
        case 'E'.charCodeAt(0):
            return 'moveDown';
        case 'D'.charCodeAt(0):
            return 'moveRight';
        case 'A'.charCodeAt(0):
            return 'moveLeft';
        case 38:
            return 'lookUp';
        case 40:
            return 'lookDown';
        case 37:
            return 'lookLeft';
        case 39:
            return 'lookRight';
        default:
            return undefined;
    }
}
const setCamera = (camera, position, heading, pitch) => {
    camera.setView({
        destination: position,
        orientation: {
            heading: Cesium.Math.toRadians(heading), //航向角
            pitch: Cesium.Math.toRadians(pitch), //俯仰角
            roll: 0.0 //设为默认值0.0 防止侧翻
        }
    });
}

/**
    * 获取相机水平面上投影朝向
    * @param {Cesium.Camera} camera 相机
    * @param {Cesium.Cartesian3} result [可选]相机水平面上投影朝向,（已转为单位向量）
    */
function getHorizontalDirection(camera, result) {
    if (!Cesium.defined(camera)) {
        console.error("camera must not be null.");
        return null;
    }

    if (!Cesium.defined(result)) {
        result = new Cesium.Cartesian3();
    }

    var direction = camera.direction.clone();
    var position = camera.position.clone();
    var pitch = camera.pitch;
    var right = camera.right.clone();

    var lookScratchQuaternion = new Cesium.Quaternion();
    var lookScratchMatrix = new Cesium.Matrix3();

    var turnAngle = Cesium.defined(pitch) ? pitch : camera.defaultLookAmount;
    var quaternion = Cesium.Quaternion.fromAxisAngle(right, -turnAngle, lookScratchQuaternion);
    var rotation = Cesium.Matrix3.fromQuaternion(quaternion, lookScratchMatrix);

    Cesium.Matrix3.multiplyByVector(rotation, direction, result);

    Cesium.Cartesian3.normalize(result, result);
    // console.log(direction, result);
    return result;
}