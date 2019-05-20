import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import XLSX from 'xlsx';
import Cesium from "cesium/Cesium"

import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
//const viewer
let params = {
    rx: -88,
    ry: 3,
    rz: -1,
    scale: 2,
    tx: 119.0910393016583,
    ty: 32.26718715540471,
    tz: 62
}
let modelID = [], viewer, tileset, tilesetId = new Set()
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        addTdtMap(viewer, "TDT_VEC_W")
        tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: tileset3dtilesUrl.bimModel[7].url,
                debugShowBoundingVolume: false
            })
        );
        tileset.readyPromise.then((tileset) => {
            update3dtilesMaxtrix(tileset, params)
            viewer.zoomTo(tileset)
        })
    }
    importExcel(e) {
        var files = e.target.files;
        var name = files.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            const { result } = event.target;
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' });
            // 存储获取到的数据
            let data = [];
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
                // esline-disable-next-line
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    // 利用 sheet_to_json 方法将 excel 转成 json 数据
                    let datas = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                    data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
            // 最终获取到并且格式化后的 json 数据
            for (let i of data) {
                modelID.push(i.ID)
            }
            plays(modelID)
        };
        reader.readAsBinaryString(files[0]);
    }

    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <input className="baiduButton" type="file" id="excel-file" onChange={this.importExcel} />
            </div>
        );
    }
}

let days = 0, setInter
const plays = (modelID) => {
    tileset.tileVisible.addEventListener((tile) => {
        var content = tile.content;
        var featuresLength = content.featuresLength;
        for (var i = 0; i < featuresLength; i++) {
            tilesetId.add(content.getFeature(i).getProperty('name'))
            content.getFeature(i).show = false
        }
    });
    setInter = setInterval(() => {
        let values = [...tilesetId]
        playFeature(values[days])
        days++
        if (days > values.length) {
            clearInterval(setInter)
        }
    }, 1)
}
const playFeature = (name) => {
    tileset.tileVisible.addEventListener((tile) => {
        let content = tile.content;
        let featuresLength = content.featuresLength;
        for (var i = 0; i < featuresLength; i++) {
            let featureName = content.getFeature(i).getProperty('name')
            if (featureName.indexOf(name) != -1) {
                content.getFeature(i).show = true
                content.getFeature(i).color = new Cesium.Color(0.8, 0.5, 0.5, 0.8)
            }
        }
    });
}

export default Map