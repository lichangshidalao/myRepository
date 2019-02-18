import Cesium from "cesium/Cesium";
import { getLonLat, GetDistance } from "./getLonLat";

let handle
const drawEntity = (viewer, type) => {
    handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    switch (type) {
        case "point":
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.position)
                addPoint(viewer, cartesian)
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
            break
        case "polyline":
            let positionArray = []
            let point1 = addPoint(viewer)
            point1.show = false
            let drawArray
            handle.setInputAction((momvent) => {
                const cartesian = viewer.scene.pickPosition(momvent.position)
                positionArray.push(cartesian)
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
                positionArray = []
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