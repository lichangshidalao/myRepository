import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { Select } from 'antd';
import './viewer.css';
import smoke from '../img/smoke.png';
//const viewer
const Option = Select.Option;
let viewer, tileset
//示例数据
let params = {
    rx: 0,
    ry: 0,
    rz: 1,
    scale: 1,
    tx: 111.0031011243053,
    ty: 30.823530721441738,
    tz: 101.00875082991314,
}
let viewModel = {
    emissionRate: 44,
    gravity: 0.0,
    minimumParticleLife: 1,
    maximumParticleLife: 2,
    minimumSpeed: 5,
    maximumSpeed: 5,
    startScale: 6.0,
    endScale: 1.0,
    particleSize: 12.0
};
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        cameraPick()
        //addTdtMap(viewer, "TDT_VEC_W")
        var startTime = new Cesium.JulianDate(2458701, 50386.178999936106);
        var stopTime = Cesium.JulianDate.addSeconds(startTime, 150, new Cesium.JulianDate());
        viewer.clock.startTime = startTime.clone();  // 开始时间
        viewer.clock.stopTime = stopTime.clone();     // 结速时间
        viewer.clock.currentTime = startTime.clone(); // 当前时间
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 行为方式
        viewer.clock.multiplier = 1
        viewer.clock.shouldAnimate = true

        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[13].url, false)
        tileset.readyPromise.then(function (tileset) {
            update3dtilesMaxtrix(tileset, params)
            tileset.maximumScreenSpaceError = 0.1
            tileset.maximumMemoryUsage = 2048
        })
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(111.03078136912833, 30.79941581911459, 1572.731311696497),
            orientation: {
                heading: 5.482060686307038,
                pitch: -0.40006260338313404
            }
        });
        let positionP = [111.00264593231053, 30.82167852617643, 24.885706579556796, 111.00393501591243, 30.822875045186112, 19.359242752687436, 111.0049872970562, 30.82385172409606, 22.12041052013481]

        let scene = viewer.scene;
        let Matrix42 = new Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.fromDegrees(positionP[0], positionP[1], positionP[2] + 1000))
        // let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(180));
        // let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(180));
        // let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(50));
        // let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        // let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        // let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        // Cesium.Matrix4.multiply(Matrix42, rotationZ, Matrix42);
        let particleSystem = scene.primitives.add(new Cesium.ParticleSystem({
            modelMatrix: Matrix42,
            image: smoke,

            startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7),
            endColor: Cesium.Color.WHITE.withAlpha(0.0),

            startScale: viewModel.startScale,
            endScale: viewModel.endScale,

            minimumParticleLife: viewModel.minimumParticleLife,
            maximumParticleLife: viewModel.maximumParticleLife,

            minimumSpeed: viewModel.minimumSpeed,
            maximumSpeed: viewModel.maximumSpeed,

            imageSize: new Cesium.Cartesian2(viewModel.particleSize, viewModel.particleSize),

            emissionRate: viewModel.emissionRate,

            // bursts: [
            //     // these burst will occasionally sync to create a multicolored effect
            //     new Cesium.ParticleBurst({ time: 5.0, minimum: 10, maximum: 100 }),
            //     new Cesium.ParticleBurst({ time: 10.0, minimum: 50, maximum: 100 }),
            //     new Cesium.ParticleBurst({ time: 15.0, minimum: 200, maximum: 300 })
            // ],

            lifetime: 16.0,

            emitter: new Cesium.CircleEmitter(2.0),

            emitterModelMatrix: computeEmitterModelMatrix(),

            updateCallback: applyGravity
        }));

        viewer.scene.preUpdate.addEventListener(function (scene, time) {

            let ss = Cesium.JulianDate.secondsDifference(time, startTime)/1000
            console.log(ss)
            let position = Cesium.Cartesian3.fromDegrees(positionP[0]-ss, positionP[1], positionP[2] + 1000);
            let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

            particleSystem.modelMatrix = m;

            // Account for any changes to the emitter model matrix.
            particleSystem.emitterModelMatrix = computeEmitterModelMatrix();

            // Spin the emitter if enabled.
            if (viewModel.spin) {
                viewModel.heading += 1.0;
                viewModel.pitch += 1.0;
                viewModel.roll += 1.0;
            }
        });

    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}
const cameraPick = () => {
    //添加相机位置改变事件
    let camera = viewer.scene.camera;
    camera.percentageChanged = 0.1;
    let cameraArray = []
    camera.changed.addEventListener(function () {
        cameraArray = []
        var p = Cesium.Cartographic.fromCartesian(camera.position);
        let cameraLongitude = Cesium.Math.toDegrees(p.longitude)
        let cameraLatitude = Cesium.Math.toDegrees(p.latitude)
        let cameraHeight = p.height
        cameraArray.push(cameraLongitude)
        cameraArray.push(cameraLatitude)
        cameraArray.push(cameraHeight)
        cameraArray.push(camera.heading)
        cameraArray.push(camera.pitch)
        //cameraArray.push(camera.roll)
    });
    let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    let pickArray = []
    pickhandle.setInputAction((momvent) => {
        let cartesian = viewer.scene.pickPosition(momvent.position)
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height
        pickArray.push(longitudeString)
        pickArray.push(latitudeString)
        pickArray.push(height)
        console.log(pickArray)
        console.log(cameraArray)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
let gravityScratch = new Cesium.Cartesian3();
function applyGravity(p, dt) {
    // We need to compute a local up vector for each particle in geocentric space.
    var position = p.position;

    Cesium.Cartesian3.normalize(position, gravityScratch);
    Cesium.Cartesian3.multiplyByScalar(gravityScratch, viewModel.gravity * dt, gravityScratch);

    p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
}
var emitterModelMatrix = new Cesium.Matrix4();
var translation = new Cesium.Cartesian3();
var rotation = new Cesium.Quaternion();
var hpr = new Cesium.HeadingPitchRoll();
var trs = new Cesium.TranslationRotationScale();
function computeEmitterModelMatrix() {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
    trs.translation = Cesium.Cartesian3.fromElements(-4.0, 0.0, 1.4, translation);
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

    return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
}
export default Map