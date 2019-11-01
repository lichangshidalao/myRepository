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

            let common = [116.38986027409541, 39.52310573955045, 120, 116.3975033815267, 39.523839084641345, 120, 116.40307436055758, 39.52855682633197, 120, 116.40010456590026, 39.52097888231222, 120, 116.41606743126782, 39.5290036116147, 120, 116.41996356414624, 39.52355994808833, 120, 116.42222353125614, 39.522808187136576, 120, 116.44194555363605, 39.52381017258125, 120, 116.41611858729487, 39.51662586549929, 120, 116.4021915780379, 39.51609463050298, 120, 116.40822194204387, 39.512886718488424, 120, 116.41198586050596, 39.51325174368666, 120, 116.41571352307673, 39.51234181653961, 120, 116.41282037952678, 39.510752304015625, 120, 116.41533787700568, 39.507845083549995, 120, 116.40589277791396, 39.506622293901906, 120, 116.40488543816736, 39.511223276530885, 120, 116.39845626289261, 39.50719600070591, 120, 116.39917247342152, 39.50240951824449, 120, 116.40672417218816, 39.502298793186775, 120, 116.42655690891465, 39.5099536767987, 120, 116.42846042270126, 39.51146537116999, 120, 116.40104041119875, 39.49068698655428, 120, 116.42911979636683, 39.49107202246619, 120, 116.43105915091246, 39.49030260666523, 120, 116.43619558038246, 39.49408248590792, 120, 116.39003859427106, 39.52192928110374, 120, 116.39328462949359, 39.522256864934725, 120, 116.39342229645139, 39.52162383213382, 120, 116.39879292567102, 39.522152619580424, 120, 116.39852657642837, 39.52397799873816, 120, 116.39806343298933, 39.52653219313505, 120, 116.39981473051871, 39.52226745908407, 120, 116.40157412659366, 39.528476487948275, 120, 116.40180622504501, 39.526875488299524, 120, 116.4067691861109, 39.527305219570984, 120, 116.4134920085509, 39.5279741560025, 120, 116.41623721296234, 39.528236118800955, 120, 116.40271560175655, 39.52113779811811, 120, 116.4024273182464, 39.522474627875525, 120, 116.40934336140654, 39.52314534346988, 120, 116.41419102941732, 39.52363119688448, 120, 116.41916815966741, 39.52412993804431, 120, 116.41986918192137, 39.52419783417904, 120, 116.41927611562397, 39.52349063863606, 120, 116.42235470784209, 39.522298971164616, 120, 116.4194803141793, 39.52203970832583, 120, 116.4144893353677, 39.5216308975895, 120, 116.44306147198768, 39.5235863938343, 120, 116.44164787641365, 39.523081362400376, 120, 116.41848074308209, 39.528418462088716, 120, 116.41514877715373, 39.5165483722782, 120, 116.41478562380657, 39.51939278634325, 120, 116.41529163723152, 39.515521706917205, 120, 116.41754014238201, 39.51347403545915, 120, 116.41856157971296, 39.50823550433453, 120, 116.42052604562775, 39.50551998649063, 120, 116.42241060669717, 39.493982854882404, 120, 116.42615588833912, 39.49444006543567, 120, 116.42697723800805, 39.490906709984536, 120, 116.42640861780639, 39.49294110492275, 120, 116.43046221676633, 39.493400593767795, 120, 116.43763425929232, 39.492897040437896, 120, 116.43737163466712, 39.494113090011446, 120, 116.43642236452064, 39.50292496223419, 120, 116.43206396635745, 39.50735951348849, 120, 116.4251448292837, 39.52256398675867, 120, 116.42951324547462, 39.51157474005195, 120, 116.43008391329893, 39.51172200597045, 120, 116.43011055437229, 39.51163856266711, 120, 116.42741574213726, 39.5113250147608, 120, 116.42791810522078, 39.50917173113139, 120, 116.42628375436273, 39.51118558341921, 120, 116.40104765778285, 39.48972382093833, 120, 116.40327162228857, 39.49003418913402, 120, 116.40274122118709, 39.493139740157375, 120, 116.39979140167925, 39.4928833985124, 120, 116.39733840811994, 39.51247375627781, 120, 116.39750551858266, 39.51251811787159, 120, 116.39626834147447, 39.51919308656463, 120, 116.39576525021816, 39.521834603452106, 120, 116.3981931750998, 39.50846550457693, 120, 116.39735916138663, 39.5084234102875, 120, 116.39731210067214, 39.508367561264066, 120, 116.39831554458195, 39.502283739304474, 120, 116.39781827366639, 39.50532196519571, 120, 116.39899321635191, 39.503018215990075, 120, 116.39903126385978, 39.50303597970726, 120, 116.40066028976807, 39.50326447606909, 120, 116.40018424057324, 39.50558363136877, 120, 116.40268678360788, 39.521132207913325, 120, 116.40358532829771, 39.51624631151196, 120, 116.40402320958424, 39.51379771751694, 120, 116.40286655843225, 39.5118260814712, 120, 116.40304465963244, 39.51101331442543, 120, 116.4036580866463, 39.50770491126901, 120, 116.40453237745787, 39.50637768546525, 120, 116.40549966867857, 39.50217924212621, 120, 116.40470327640395, 39.50210200486679, 120, 116.40062404385195, 39.50315804128638, 120, 116.4036440438627, 39.50342213878354, 120, 116.4032439409095, 39.489921814555956, 120, 116.4033340064009, 39.489934290409664, 120, 116.42335373295083, 39.52886962009994, 120, 116.42456931036317, 39.52464747742897, 120, 116.42769991776973, 39.531385840997665, 120, 116.42252992556725, 39.53114629349481, 120, 116.4239976311578, 39.52689881481928, 120, 116.41879963422076, 39.52639444360378, 120, 116.41383961510826, 39.525955865439244, 120, 116.42784257977752, 39.52495407174325, 120, 116.43104601058336, 39.524837282937256, 120, 116.41694896113978, 39.51402462266212, 120, 116.41269853530126, 39.51140734965208, 120, 116.41153424320856, 39.511342100500734, 120, 116.41153884070188, 39.51126221694205, 120, 116.41196722194464, 39.5091853425058, 120, 116.40925329116351, 39.508785067024824, 120, 116.40893059096203, 39.51033310377502, 120, 116.40904995064932, 39.510314666571475, 120, 116.40410207292581, 39.51112390573343, 120, 116.4071877817587, 39.524806222215, 120, 116.40215448852138, 39.524350119867066, 120, 116.40962447972217, 39.52171343091896, 120, 116.41152444756163, 39.51557769101501, 120, 116.40609307589337, 39.515070798865196, 120, 116.43065942800291, 39.49211105365596, 120, 116.42897224647552, 39.49191247556593, 120, 116.42685477996332, 39.49093786037089, 120, 116.4268318718476, 39.490882338240105, 120, 116.42876529333392, 39.493244688942156, 120, 116.43081641621158, 39.492108982746565, 120, 116.43060426229768, 39.49344413043151, 120, 116.43058356899415, 39.49337977264107, 120, 116.43757840982057, 39.49283876274148, 120, 116.43733219034324, 39.494211574967906, 120, 116.42613634880041, 39.494356707426284, 120, 116.42606728668225, 39.49433500186738, 120, 116.42606795337247, 39.494294770773834, 120, 116.42616029773046, 39.494276031265564, 120, 116.4280481647475, 39.49100882860379, 120, 116.4277282008808, 39.49319219183518, 120, 116.42771413194163, 39.49314432374184, 120, 116.43720446329885, 39.49534789526838, 120, 116.42744471859581, 39.494245039120344, 120, 116.42765355380222, 39.494220045544076, 120, 116.42755337715462, 39.49420882094504, 120, 116.42764522145617, 39.49421550703496, 120, 116.40584899992616, 39.49350251740846, 120, 116.4063644412077, 39.49355515902946, 120, 116.4067021894147, 39.49357078585379, 120, 116.42779822730525, 39.509179359975114, 120]

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