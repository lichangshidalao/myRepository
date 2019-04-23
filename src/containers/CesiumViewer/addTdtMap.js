import Cesium from "cesium/Cesium";
import { TDTURL_CONFIG } from "../../config/data.config";


const addTdtMap = (viewer, style = "TDT_IMG_W") => {
    let baseLayer, labelLayer
    switch (style) {
        case "TDT_IMG_W":
            baseLayer = addLayerW(TDTURL_CONFIG.TDT_IMG_W, "TDT_IMG_W")
            labelLayer = addLayerW(TDTURL_CONFIG.TDT_CIA_W, "TDT_CIA_W")
            break
        case "TDT_VEC_W":
            baseLayer = addLayerW(TDTURL_CONFIG.TDT_VEC_W, "TDT_VEC_W")
            labelLayer = addLayerW(TDTURL_CONFIG.TDT_CVA_W, "TDT_CVA_W")
            break
        case "TDT_IMG_C":
            baseLayer = addLayerC(TDTURL_CONFIG.TDT_IMG_C, "TDT_IMG_C")
            labelLayer = addLayerC(TDTURL_CONFIG.TDT_CIA_C, "TDT_CIA_C")
            break
        case "TDT_VEC_C":
            baseLayer = addLayerC(TDTURL_CONFIG.TDT_VEC_C, "TDT_VEC_C")
            labelLayer = addLayerC(TDTURL_CONFIG.TDT_CVA_C, "TDT_CVA_C")
            break
    }
    viewer.imageryLayers.addImageryProvider(baseLayer)
    viewer.imageryLayers.addImageryProvider(labelLayer)
}

const addLayerC = (url, layer) => {
    return new Cesium.WebMapTileServiceImageryProvider({
        url: url,
        layer: layer,
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
        maximumLevel: 18,
        show: false
    })
}
const addLayerW = (url, layer) => {
    return new Cesium.WebMapTileServiceImageryProvider({
        url: url,
        layer: layer,
        style: "default",
        format: "tiles",
        tileMatrixSetID: "w",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        maximumLevel: 18,
        show: false
    })
}

export { addTdtMap, addLayerC, addLayerW }