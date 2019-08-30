import Cesium from "cesium/Cesium";
import { getLonLat, GetDistance } from "./getLonLat";

let handle
let pointA = []
const drawEntity = (viewer, type) => {
    handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    switch (type) {
        case "point":
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.position)
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                let height = cartographic.height
                let positions = Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, height + 10)
                addPoint(viewer, positions)
                pointA.push(longitudeString)
                pointA.push(latitudeString)
                pointA.push(120)
                console.log(pointA)
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handle.setInputAction((momvent) => {
                console.log("pointA:" + pointA)
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
            break
        case "polyline":
            //开站点 -----------------------------------------------
            let zhandian = [116.40293473725988, 39.528628505207564, 120, 116.3973423503579, 39.52383355043809, 120, 116.38993700175324, 39.52296507923209, 120,
                116.41602027355256, 39.52901938521199, 120, 116.44193759456795, 39.523894486369066, 120, 116.4220869318186, 39.5226740132718, 120,
                116.40205112686951, 39.51619780884389, 120, 116.41602982203673, 39.5163963257311, 120, 116.41197184191651, 39.513173796629175, 120,
                116.40816091229159, 39.51265105022373, 120, 116.4045764769018, 39.51109190842442, 120, 116.41564677451404, 39.51225247293868, 120,
                116.41636959372178, 39.507199765400124, 120, 116.4056300857476, 39.50627653483678, 120, 116.39843461571182, 39.50710914277392, 120,
                116.42634114382794, 39.509820458378634, 120, 116.42826851501844, 39.51152603133732, 120, 116.39896280294676, 39.50242672572544, 120,
                116.40669032079403, 39.50230408840448, 120, 116.40112756551879, 39.49054390281587, 120,
                116.42922440789496, 39.49107539658436, 120, 116.43096732737507, 39.490416365032864, 120, 116.43619017445461, 39.49404885545458, 120]
            for (let i = 0; i < zhandian.length / 3; i++) {
                addPoinA(viewer, Cesium.Cartesian3.fromDegrees(zhandian[i * 3], zhandian[i * 3 + 1], zhandian[i * 3 + 2]), "开电站" + i)
            }

            let biandianZhanArray = [116.39989253531809, 39.5210730439786, 120, 116.41994650103588, 39.52359342391267, 120]
            for (let i = 0; i < biandianZhanArray.length / 3; i++) {
                addPoinA(viewer, Cesium.Cartesian3.fromDegrees(biandianZhanArray[i * 3], biandianZhanArray[i * 3 + 1], biandianZhanArray[i * 3 + 2]), "变电站" + i)
            }

            let common = [116.40176065180539,39.52687340654235,120,116.40327433482766,39.527016416652394,120,116.41347609076925,39.52799289011744,120,116.41614623754536,39.52824137475214,120,116.41844946354695,39.52843221318411,120,116.41917934006554,39.52408907880395,120,116.4198347934292,39.52416390219577,120,116.4194694416567,39.522027337411316,120,116.42226041012394,39.52229707850838,120,116.40254008301966,39.52248866046273,120,116.39978944240451,39.52221426694827,120,116.39880854166307,39.522136094195275,120,116.39763463291246,39.522046582972244,120,116.39005431589419,39.52134858775293,120,116.40289837985792,39.51973284538842,120,116.40343355497188,39.5162161637204,120,116.41418218560061,39.52364399101275,120,116.41479062472874,39.519437986083304,120,116.41982097454724,39.519886232004566,120,116.4201490286291,39.51704044596012,120,116.42096559491324,39.51241265789318,120,116.42149345581493,39.509493646635335,120,116.42394633682193,39.507253348571275,120,116.42441650050627,39.503190844990854,120,116.42511546844638,39.49740458577485,120,116.42515750931794,39.52259642913552,120,116.4257644859727,39.520436560641954,120,116.42979479881667,39.520787921049696,120,116.43206128240811,39.51182261896263,120,116.43256696316068,39.50784921758337,120,116.43698970327426,39.50386310643008,120,116.43759902516713,39.4999850190509,120,116.43865935644669,39.4943682207184,120,116.43892922542616,39.49092301552936,120,116.40375434781438,39.51378069965567,120,116.40211301451434,39.51241506036683,120,116.40238422107272,39.5101885921706,120,116.40253568465938,39.50866449657894,120,116.40358518038074,39.50789236859779,120,116.4043210331413,39.50311079793722,120,116.40489882140915,39.49985605429008,120,116.40649880068973,39.48913769365837,120,116.40585177128962,39.49163149702704,120,116.42456751494356,39.52463815350288,120]
            for (let i = 0; i < common.length / 3; i++) {
                addPoinA(viewer, Cesium.Cartesian3.fromDegrees(common[i * 3], common[i * 3 + 1], common[i * 3 + 2]), "公共点" + i)
            }

            let positionArray = []
            let polylinedata = []
            let point1 = addPoint(viewer)
            point1.show = false
            let drawArray
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.position)
                positionArray.push(cartesian)
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                let height = cartographic.height
                polylinedata.push(longitudeString)
                polylinedata.push(latitudeString)
                polylinedata.push(120)
                //添加点
                addPoint(viewer, cartesian)
                //画线
                positionArray.length > 1 ? drawArray = getArray(positionArray) : console.log(positionArray)
                drawArray ? addPolyline(viewer, drawArray, true) : console.log(drawArray)
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.endPosition)
                let LonLatH = getLonLat(cartesian)
                point1.show = true
                point1.position = Cesium.Cartesian3.fromDegrees(LonLatH[0], LonLatH[1], LonLatH[2] + 1)

            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
            //每个右键停止一次绘制
            handle.setInputAction((momvent) => {
                viewer.trackedEntity = false
                console.log("polylinedata:" + polylinedata)
                positionArray = []
                console.log("polylinedata:" + pointA)
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
            break
        case "polygon":
            let gonArray = []
            let point2 = addPoint(viewer)
            point2.show = false
            let drawgonArray
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.position)
                gonArray.push(cartesian)
                //添加点
                addPoint(viewer, cartesian)
                //画线
                gonArray.length > 1 ? drawgonArray = getArray(gonArray) : console.log(gonArray)
                drawgonArray ? addPolyline(viewer, drawgonArray) : console.log(drawgonArray)
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.endPosition)
                let LonLatH = getLonLat(cartesian)
                point2.show = true
                point2.position = Cesium.Cartesian3.fromDegrees(LonLatH[0], LonLatH[1], LonLatH[2] + 1)

            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
            //每个右键停止一次绘制并记录面积
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.position)
                gonArray.push(cartesian)
                if (gonArray.length > 2) {
                    addPoint(viewer, cartesian)
                    addPolyline(viewer, getArray(gonArray))
                    addPolygon(viewer, gonArray)
                }
                gonArray = []
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
            break
        case "removeAll":
            handle.destroy()
            viewer.entities.removeAll()
            break
    }
}

const desDraw = (viewer) => {
    handle === undefined ? viewer.entities.removeAll() : handle = handle && handle.destroy();
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
const getArray = (positionArray) => {
    let lengths = positionArray.length
    let pArray = []
    if (lengths > 1) {
        pArray.push(positionArray[lengths - 2])
        pArray.push(positionArray[lengths - 1])
    }
    return pArray
}
const addPolyline = (viewer, carArray, ismeasure = false) => {
    let positionArray = []
    for (let i of carArray) {
        let LonLatH = getLonLat(i)
        positionArray.push(LonLatH[0])
        positionArray.push(LonLatH[1])
    }
    //let LonLatH = getLonLat(cartesian3)
    const polyline = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positionArray),
            width: 8,
            material: Cesium.Color.SKYBLUE,
            clampToGround: true
        }
    })
    if (ismeasure) {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees((positionArray[0] + positionArray[2]) / 2, (positionArray[1] + positionArray[3]) / 2),
            label: {
                text: GetDistance(positionArray[0], positionArray[1], positionArray[2], positionArray[3]) + "km",
                backgroundColor: new Cesium.Color(0, 0, 0, 0),
                showBackground: true,
                fillColor: Cesium.Color.SKYBLUE,
                pixelOffset: new Cesium.Cartesian2(0, -40),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            }
        });
    }
    return polyline
}
const addPoint = (viewer, cartesian3 = undefined) => {
    let LonLatH = cartesian3 ? getLonLat(cartesian3) : [0, 0, 0]
    //let LonLatH = getLonLat(cartesian3)
    const point = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(LonLatH[0], LonLatH[1], LonLatH[2] + 1),
        point: {
            show: true, // default
            color: Cesium.Color.SKYBLUE, // default: WHITE
            pixelSize: 10, // default: 1
            outlineColor: Cesium.Color.YELLOW, // default: BLACK
            outlineWidth: 3 // default: 0
        }
    })
    return point
}

const addPolygon = (viewer, carArray, ismeasure = false) => {
    let positionArray = []
    for (let i of carArray) {
        let LonLatH = getLonLat(i)
        positionArray.push(LonLatH[0])
        positionArray.push(LonLatH[1])
    }
    const polygon = viewer.entities.add({
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(positionArray),
            material: Cesium.Color.CYAN.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
    })
    return polygon
}

export { drawEntity, desDraw }