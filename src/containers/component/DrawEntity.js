import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { drawEntity, desDraw } from "../CesiumViewer/drawEntity";
import { Select } from 'antd';
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";

//antd标签
const Option = Select.Option;
//const viewer
let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        //addBingMapLayer(viewer)
        //开启地形
        // viewer.terrainProvider = Cesium.createWorldTerrain()
        // const positions = Cesium.Cartesian3.fromDegrees(116.30370024874621, 40.029712499715885, 1000)
        // cameraFlyto(viewer, positions, 2000)
        //模型参数
        let params = {
            tx: 116.42721600000016,//模型中心X轴坐标（经度，单位：十进制度）
            ty: 39.497370999999646,//模型中心Y轴坐标（纬度，单位：十进制度）  
            tz: -10,    //模型中心Z轴坐标（高程，单位：米） 
            rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
            ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
            rz: 7,       //Z轴（高程）方向旋转角度（单位：度）
            scale: 20.4
        }
        let tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://172.16.108.211:8082/data/ssa/tileset.json",
                debugShowBoundingVolume: false
            })
        );
        tileset.readyPromise.then((tileset) => {
            update3dtilesMaxtrix(tileset, params)
            tileset.maximumScreenSpaceError = 0.1
            tileset.dynamicScreenSpaceError = true
            tileset.maximumMemoryUsage = 2048
            //viewer.flyTo(tileset, { offset: new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 2.0) })
        })
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(116.40829604593257, 39.58908206168574, 6108.0008469542025),
            orientation: {
                heading: 3.0352744583399107,
                pitch: -0.5684489202931493
            },
            complete: () => {
                //roam(viewer)
            }
        });
    }
    handleChange(value) {
        desDraw(viewer)
        drawEntity(viewer, value)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="Click Me" className="select_1" onChange={this.handleChange.bind(this)}>
                    <Option value="point">point</Option>
                    <Option value="polyline">polyline</Option>
                    <Option value="polygon">polygon</Option>
                    <Option value="removeAll">removeAll</Option>
                </Select>
            </div>
        );
    }
}

const addPoinA = (viewer, cartesian3 = undefined, names) => {
    const point = viewer.entities.add({
        id: names,
        position: cartesian3,
        point: {
            show: true, // default
            color: Cesium.Color.RED, // default: WHITE
            pixelSize: 10, // default: 1
            outlineColor: Cesium.Color.YELLOW, // default: BLACK
            outlineWidth: 3 // default: 0
        }
    })
    return point
}
export default Map