import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { getLonLat } from "../CesiumViewer/getLonLat";
import { Select } from 'antd';
import './viewer.css';
import smoke from '../img/smoke.png';
import { cameraPosition } from "../CesiumViewer/cameraPosition";

//const viewer
const Option = Select.Option;
let viewer, tileset, startTime, stopTime
//示例数据
// let params = {
//     tx: 116.42721600000016,//模型中心X轴坐标（经度，单位：十进制度）
//     ty: 39.497370999999646,//模型中心Y轴坐标（纬度，单位：十进制度）  
//     tz: 10,    //模型中心Z轴坐标（高程，单位：米） 
//     rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
//     ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
//     rz: 7,       //Z轴（高程）方向旋转角度（单位：度）
//     scale: 20.4
// }

let params = {
    rx: 0,
    ry: 0,
    rz: 1,
    scale: 1.1,
    tx: 105.80625727758714,
    ty: 26.38174529195763,
    tz: 1184,
}
let originalParam
//南北方向1米等于：360 / 40075016.68557849 =0.000008983152841195214 度（注：任意经度地球周长 40075016.68557849米）
//东西方向1米等于：360 / 38274592.22115159 =0.000009405717451407729 度（注：38纬度地球周长 38274592.22115159  米）
//速度取10m
let speed = 0.0001
let degree = 1
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        viewer.terrainProvider = Cesium.createWorldTerrain()
        cameraPosition(viewer)

        var start = Cesium.JulianDate.fromDate(new Date(2019, 2, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(start, 12, new Cesium.JulianDate());

        //Make sure viewer is at the desired time.
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        viewer.clock.multiplier = 1;
        viewer.clock.shouldAnimate = true;
        //viewer.timeline.zoomTo(start, stop);



        let position = Cesium.Cartesian3.fromDegrees(105.80589974816479, 26.382073529857415, 1178)

        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(105.8103888677324, 26.38181795232038, 1308),
            orientation: {
                heading: Cesium.Math.toRadians(275.05087058030415), // east, default value is 0.0 (north)
                pitch: -0.4352287296658752,    // default value (looking down)
                roll: 6.280253701770263                          // default value
            }
        });
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4())

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
        var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
            // Particle appearance
            image: smoke,
            startColor: Cesium.Color.WHITE.withAlpha(0.7),
            endColor: Cesium.Color.WHITE.withAlpha(0.0),
            startScale: 8.0,
            endScale: 10.0,
            particleLife: 2.0,
            // minimumParticleLife: 4,
            // maximumParticleLife: 5,
            speed: 4,
            imageSize: new Cesium.Cartesian2(10, 10),
            lifetime: 20.0,
            emissionRate: 5,
            //emitterModelMatrix: computeEmitterModelMatrix(),
            // Particle system parameters
            modelMatrix: m,
            updateCallback: applyGravity,
            emitter: new Cesium.CircleEmitter(1.0),
            //emitterModelMatrix: computeEmitterModelMatrix(),
        }));
        // viewer.scene.preUpdate.addEventListener(function (scene, time) {
        //     let numbers = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, start)
        //     console.log(numbers)
        //     particleSystem.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(105.80589974816479, 26.382073529857415, 1178 + numbers*0.000000001), undefined, new Cesium.Matrix4())
        //     particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
        // });



        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[15].url)
        tileset.readyPromise.then(function (tileset) {
            //深拷贝
            originalParam = JSON.parse(JSON.stringify(params))
            update3dtilesMaxtrix(tileset, params)
            let shadowMap = viewer.shadowMap;
            viewer.shadows = false
            shadowMap.maxmimumDistance = 10000.0;
            viewer.clock.startTime = new Cesium.JulianDate.fromIso8601('2013-12-25');
            viewer.clock.multiplier = 6000.0;
            //viewer.clock.shouldAnimate = true
            viewer.scene.globe.enableLighting = true;
            //tileset.maximumScreenSpaceError = 0.1
            tileset.dynamicScreenSpaceError = true
            tileset.maximumMemoryUsage = 2048
            tileset.preferLeaves = true
            tileset.immediatelyLoadDesiredLevelOfDetail = true
        })
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
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)



        document.addEventListener('keydown', (e) => {
            setFlagStatus(e, true);
            update3dtilesMaxtrix(tileset, params)
        });
    }
    handleChange(value) {
        switch (value) {
            case "restart":
                update3dtilesMaxtrix(tileset, originalParam)
                params = JSON.parse(JSON.stringify(originalParam))
                break
            case "confirm":
                console.log(params)
                break
        }
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="Click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="restart">还原</Option>
                    <Option value="confirm">打印</Option>
                </Select>
            </div>
        );
    }
}

//添加键盘监听事件
// 根据键盘按键返回标志
const setFlagStatus = (key, value) => {
    let numX = params.tx
    let numY = params.ty
    let numZ = params.tz
    let rx = params.rx
    let ry = params.ry
    let rz = params.rz
    let scale = params.scale
    switch (key.keyCode) {
        case 37:
            // 左
            numX -= speed
            break;
        case 38:
            // 上
            numY += speed
            break;
        case 39:
            // 右
            numX += speed
            break;
        case 40:
            // 下
            numY -= speed
            break;
        case 65:
            // A
            rx -= degree
            break;
        case 83:
            // S
            ry -= degree
            break;
        case 87:
            // W
            ry += degree
            break;
        case 68:
            // D
            rx += degree
            break;
        case 69:
            // E
            rz += degree
            break;
        case 81:
            // Q
            rz -= degree
            break;
        case 82:
            // -
            scale = scale > 0.1 ? scale - 0.1 : scale
            break;
        case 84:
            // +
            scale += 0.1
            break;
        case 88:
            // +
            numZ += 1
            break;
        case 90:
            // +
            numZ -= 1
            break;
    }
    params.tx = numX
    params.ty = numY
    params.tz = numZ
    params.rx = rx
    params.ry = ry
    params.rz = rz
    params.scale = scale
}

const add3dtiles = (viewer, url, focus = true) => {
    const scene = viewer.scene
    const tileset = scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: url,
            debugShowBoundingVolume: false,
            //classificationType: Cesium.ClassificationType.BOTH  
        })
    );
    // tileset.readyPromise.then((tileset) => {
    //     focus ? viewer.flyTo(tileset, { offset: new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 2.0) }) : console.log(focus)
    // })
    return tileset
}

var gravityScratch = new Cesium.Cartesian3();

function applyGravity(p, dt) {
    // We need to compute a local up vector for each particle in geocentric space.
    var position = p.position;

    Cesium.Cartesian3.normalize(position, gravityScratch);
    Cesium.Cartesian3.multiplyByScalar(gravityScratch, -20 * dt, gravityScratch);

    p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);

    var cartographic = Cesium.Cartographic.fromCartesian(position);
    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height
    let numbers = 0.005
    var p11 = longitudeString + numbers
    var p12 = latitudeString + numbers
    p.position = height > 20 ? Cesium.Cartesian3.fromDegrees(p11, p12, height - 50) : Cesium.Cartesian3.fromDegrees(p11, p12, 20)
}

export default Map