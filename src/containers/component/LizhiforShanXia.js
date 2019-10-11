import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { Select } from 'antd';
import './viewer.css';
import smoke from '../img/smoke.png';
import { Button } from 'antd';
//const viewer
const Option = Select.Option;
let viewer, tileset, startTime, stopTime
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
var cometOptions = {
    numberOfSystems: 100.0,
    iterationOffset: 0.003,
    cartographicStep: 0.0000001,
    baseRadius: 0.0005,

    colorOptions: [{
        red: 0.6,
        green: 0.6,
        blue: 0.6,
        alpha: 1.0
    }, {
        red: 0.6,
        green: 0.6,
        blue: 0.9,
        alpha: 0.9
    }, {
        red: 0.5,
        green: 0.5,
        blue: 0.7,
        alpha: 0.5
    }]
};

var rocketSystems = [];
var cometSystems = [];
class Map extends Component {
    constructor() {
        super()
        this.state = {
            buttonstatus: true
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        viewer.terrainProvider = Cesium.createWorldTerrain();

        //cameraPick()
        //addTdtMap(viewer, "TDT_VEC_W")
        startTime = new Cesium.JulianDate(2458701, 50386.178999936106);
        stopTime = Cesium.JulianDate.addSeconds(startTime, 150, new Cesium.JulianDate());
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
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(110.99108511985287, 30.800919052338482, 700.8483848774696),
            orientation: {
                heading: 0.45143324028440723,
                pitch: -0.18677209650507454
            }
        });

    }
    clockStatus() {
        this.setState({
            buttonstatus: !this.state.buttonstatus
        })
        //let positionP = [111.00264593231053, 30.82167852617643, 24.885706579556796, 111.00393501591243, 30.822875045186112, 19.359242752687436, 111.0049872970562, 30.82385172409606, 22.12041052013481]
        let position = Cesium.Cartesian3.fromDegrees(111.00466804104207, 30.822159854936658, 101.33561785899792)
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4())
        var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
            // Particle appearance
            image: smoke,
            startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7),
            endColor: Cesium.Color.WHITE.withAlpha(0.0),
            startScale: 6.0,
            endScale: 10.0,
            particleLife: 1.0,
            // minimumParticleLife: 4,
            // maximumParticleLife: 5,
            speed: 0.1,
            imageSize: new Cesium.Cartesian2(10, 10),
            lifetime: 10.0,
            emissionRate: 3000,
            //emitterModelMatrix: computeEmitterModelMatrix(),
            // Particle system parameters
            modelMatrix: m,
            updateCallback: applyGravity,
            emitter: new Cesium.CircleEmitter(200),
        }));
        //left
        let postionArray = [
            110.98868828229502, 30.80918546604266, 0,
            110.94778507144127, 30.84568699318446, 0,
            110.98877956551782, 30.87537192213377, 0,
            111.02476302708561, 30.844146544356665, 0
        ]
        viewer.entities.add({
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(postionArray),
                extrudedHeight: new Cesium.CallbackProperty((time, result) => {
                    let number = 120 - Cesium.JulianDate.secondsDifference(time, startTime) * 4;
                    return number > 50 ? number : 50
                }, false),
                perPositionHeight: true,
                //material: river,
                material: new Cesium.Color(0, 69 / 256, 107 / 256, 0.8),
                //material: new Cesium.Color(28/255, 78 / 256, 93 / 256, 0.7),
                outline: false,
                //outlineColor: Cesium.Color.BLACK,
                // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
            }
        })
        //right
        let watersp = [
            110.99447315300142, 30.814342311724936, 0,
            111.01798147753898, 30.8370376354796, 0,
            111.05096580030867, 30.841128571780164, 0,
            111.02553939188924, 30.779859535635484, 0
        ]
        viewer.entities.add({
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(watersp),
                extrudedHeight: new Cesium.CallbackProperty((time, result) => {
                    let number = 50 + Cesium.JulianDate.secondsDifference(time, startTime) * 4;
                    if (number > 100) {
                        //viewer.scene.primitives.remove(particleSystem)
                        particleSystem.loop = false
                    }
                    return number > 120 ? 120 : number
                }, false),
                perPositionHeight: true,
                //material: river,
                material: new Cesium.Color(0, 69 / 256, 107 / 256, 0.8),
                //material: new Cesium.Color(28/255, 78 / 256, 93 / 256, 0.7),
                outline: false,
                //outlineColor: Cesium.Color.BLACK,
                // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
            }
        })
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Button className="baiduButton" onClick={this.clockStatus.bind(this)} icon={this.state.buttonstatus ? "check-circle" : "stop"}>{this.state.buttonstatus ? "启动" : "暂停"}</Button>
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
var gravityScratch = new Cesium.Cartesian3();
let numbers = 0.00005
function applyGravity(p, dt) {
    // 计算每个粒子的向上向量（相对地心） 
    var position = p.position;

    Cesium.Cartesian3.normalize(position, gravityScratch);
    Cesium.Cartesian3.multiplyByScalar(gravityScratch, -100 * dt, gravityScratch);

    //p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);

    var cartographic = Cesium.Cartographic.fromCartesian(position);
    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height

    var p11 = longitudeString + numbers * Math.sin(90)
    var p12 = latitudeString + numbers * Math.sin(-90)
    p.position = height > 20 ? Cesium.Cartesian3.fromDegrees(p11, p12, height - 10) : Cesium.Cartesian3.fromDegrees(p11, p12, 20)
    //p.position = Cesium.Cartesian3.fromDegrees(longitudeString + numbers, latitudeString, height - 10)
}
function computeEmitterModelMatrix() {
    let hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0, new Cesium.HeadingPitchRoll());
    var trs = new Cesium.TranslationRotationScale();
    trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0, new Cesium.Cartesian3());
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
    return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
}

export default Map