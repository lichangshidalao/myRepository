import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addLayerW } from "../CesiumViewer/addTdtMap";
import { createAMapByUrl } from "../CesiumViewer/amapProvider";
import { TDTURL_CONFIG, tree_config, AMAP_CONFIG, tileset3dtilesUrl } from "../../config/data.config";
import { Tree, Icon, Slider, InputNumber, Row, Col } from 'antd';
import { DecimalStep } from '../antdComponent/DecimalStep'

import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import transformTileset from "../CesiumViewer/3dtiles/transformTileset";

const { TreeNode } = Tree;

//const viewer
let viewer, imageryLayers, [...treeMap] = [...tree_config], maps = new Map()
class MapLayer extends Component {
    constructor() {
        super()
        this.state = {
        }
    }
    onSelect(selectedKeys, info) {
        let key = info.node.props.eventKey
        let str = key[0] + key[1] + key[2]
        switch (str) {
            case "0-1":
                flyModel(key)
                break
        }
    }

    onCheck(checkedKeys, info) {
        let key = info.node.props.eventKey
        let str = key[0] + key[1] + key[2]
        switch (str) {
            case "0-0":
                layerList(key, info.checked)
                break
            case "0-1":
                modelManage(key, info.checked)
                break
        }
    }
    // treeNode
    trees(treeMap) {
        let arr = []
        treeMap.forEach((node) => {
            if (node.children && node.children.length > 0) {
                arr.push(
                    <TreeNode title={<span>{node.title}</span>} key={node.key}>
                        {
                            this.trees(node.children)
                        }
                    </TreeNode>
                )
            } else {
                arr.push(<TreeNode title={node.title} key={node.key}></TreeNode>)
            }
        })
        return arr
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        imageryLayers = viewer.imageryLayers
    }
    render() {
        let treenodes = this.trees(treeMap)
        return (
            //异步加载
            <div className="map-image" ref="map" id="cesiumContain">
                {treenodes ? <Tree
                    className="treeStyle"
                    checkable
                    switcherIcon={<Icon type="down" />}
                    onSelect={this.onSelect.bind(this)}
                    onCheck={this.onCheck.bind(this)}
                >
                    {treenodes}
                </Tree> : "loading..."}
            </div>
        );
    }
}

//地图地图
const layerList = (keys, checked) => {
    if (checked) {
        let layerw
        switch (keys) {
            case "0-0-0":
                layerw = addLayerW(TDTURL_CONFIG.TDT_IMG_W, "TDT_IMG_W")
                break
            case "0-0-1":
                layerw = addLayerW(TDTURL_CONFIG.TDT_VEC_W, "TDT_VEC_W")
                break
            case "0-0-3":
                layerw = addLayerW(TDTURL_CONFIG.TDT_CIA_W, "TDT_CIA_W")
                break
            //amap vec
            case "0-0-2":
                layerw = createAMapByUrl({ url: AMAP_CONFIG.Vector })
                break
            //amap road
            case "0-0-4":
                layerw = createAMapByUrl({ url: AMAP_CONFIG.Road })
                break
            //amap label
            case "0-0-5":
                layerw = createAMapByUrl({ url: AMAP_CONFIG.Label })
                break
            //amap label
            case "0-0-6":
                layerw = createAMapByUrl({ url: AMAP_CONFIG.Img })
                break
        }
        let layer = imageryLayers.addImageryProvider(layerw)
        maps.set(keys, layer)
    } else if (maps.has(keys)) {
        let layer = maps.get(keys)
        imageryLayers.remove(layer)
        maps.delete(keys)
    }
}
//3d模型
const modelManage = (keys, checked) => {
    if (checked) {
        let modes
        switch (keys) {
            case "0-1-2":
                if (maps.has(keys)) {
                    maps.get(keys).show = true
                } else {
                    modes = add3dtiles(viewer, tileset3dtilesUrl.cityModel[0].url, false)
                    const initialPosition = Cesium.Cartesian3.fromDegrees(-74.01881302800248, 40.69114333714821, 1500);
                    let headings = Cesium.Math.toRadians(40)
                    let pitchs = Cesium.Math.toRadians(-10.0)
                    cameraFlyto(viewer, initialPosition, 1000, headings, pitchs)
                    maps.set(keys, modes)
                }
                break
            case "0-1-0":
                if (maps.has(keys)) {
                    maps.get(keys).show = true
                } else {
                    modes = add3dtiles(viewer, tileset3dtilesUrl.bimModel[1].url)
                    const initialPositions = Cesium.Cartesian3.fromDegrees(119.22079894662423, 32.2419449187401, 1000);
                    transformTileset(modes, initialPositions)
                    cameraFlyto(viewer, initialPositions, 1000)
                    maps.set(keys, modes)
                }
                break
            case "0-1-1":
                if (maps.has(keys)) {
                    maps.get(keys).show = true
                } else {
                    modes = add3dtiles(viewer, tileset3dtilesUrl.photography[0].url)
                    maps.set(keys, modes)
                }
                break

        }
    } else if (maps.has(keys)) {
        maps.get(keys).show = false
    }
}

//定位模型
const flyModel = (keys) => {
    maps.has(keys) ? viewer.zoomTo(maps.get(keys)) : "loading"
}
export default MapLayer