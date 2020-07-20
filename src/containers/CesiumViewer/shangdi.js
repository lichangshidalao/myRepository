import * as Cesium from "cesium/Cesium";
import { shequ, xiaoqu, community_build } from "../../data/community";
import { tileset3dtilesUrl } from "../../config/data.config";
import xiaoqupoi from "../img/xiaoqupoi.png"
import poi33 from "../img/poi33.png"
let viewer
const communityInit = (viewers, shequidCommunity) => {
    viewer = viewers
    //创建楼体
    const scene = viewer.scene
    const tilesetShangdi = scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: tileset3dtilesUrl.cityModel[2].url
        })
    );
    tilesetShangdi.tileVisible.addEventListener(function (tile) {
        var content = tile.content;
        var featuresLength = content.featuresLength;
        for (var i = 0; i < featuresLength; i++) {
            content.getFeature(i).color = new Cesium.Color(1, 1, 1, 0.8);
        }
    });
    for (let i in shequ) {
        if (shequ[i].id === shequidCommunity) {
            //添加社区区域
            addCommunityArea(shequ[i].area)
            let positions = Cesium.Cartesian3.fromDegrees(116.3036888623059, 40.03126771677825, 999.9216131558068)
            let headings = Cesium.Math.toRadians(253.1756118610816)
            cameraFlyto(positions, 1000, headings)
            let shequPoi = shequ[i].poi
            let shequPoiPosition = Cesium.Cartesian3.fromDegrees(shequPoi[0], shequPoi[1])
            const shequPois = billboardLabelImage(shequPoiPosition, shequ[i].name, xiaoqupoi)
            shequPois.label.fillColor = new Cesium.Color(0, 112 / 256, 192 / 256, 1)
            shequPois.billboard.width = 50
            shequPois.billboard.height = 50
            shequPois.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(3000, 15000)
            shequPois.label.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(3000, 15000)
            //获取小区数据
            let xiaoquid = shequ[i].xiaoquid
            const xiaoqudata = getxiaoqu(xiaoquid)
            for (let j = 0; j < xiaoqudata.length; j++) {
                let positonsArray = xiaoqudata[j].poi
                let position = Cesium.Cartesian3.fromDegrees(positonsArray[0], positonsArray[1], 20)
                //添加小区点位
                const billEntitys = billboardLabelImage(position, xiaoqudata[j].name, poi33)
                billEntitys.shequId = shequidCommunity
                billEntitys.xiaoquId = xiaoqudata[j].id
                billEntitys.isSelect = false
                billEntitys.billboard.width = 50
                billEntitys.billboard.height = 50
                billEntitys.label.fillColor = new Cesium.Color(0, 112 / 256, 192 / 256, 1)
            }
            const maptest = new Map()
            xiaoqudata.forEach((key, value) => {
                maptest.set(value, key)
            })
            handclickBillboard()
        }
    }
}


//获取小区数据
const getxiaoqu = (xiaoquidArray) => {
    let xiaoquDataArray = []
    for (let i in xiaoquidArray) {
        for (let j in xiaoqu) {
            if (xiaoquidArray[i] === xiaoqu[j].id) {
                xiaoquDataArray.push(xiaoqu[j])
            }
        }
    }
    return xiaoquDataArray
}
//创建区域
const addCommunityArea = (position, materials = Cesium.Color.RED) => {
    const AreaEntity = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(position),
            width: 3,
            material: materials
        }
    })
    return AreaEntity
}
const addCommunityArea2 = (position, materials = Cesium.Color.RED) => {
    const AreaEntity = viewer.entities.add({
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(position),
            material: materials,
            outline: true,
            outlineColor: new Cesium.Color(0 / 256, 112 / 256, 192 / 256),
            outlineWidth: 5,
            height: 0,
        }
    })
    return AreaEntity
}
//创建poi
const billboardLabelImage = (position, text, url = "./img/poi.png") => {
    const entitys = viewer.entities.add({
        position: position,
        billboard: {
            image: url,
            //scaleByDistance: new Cesium.NearFarScalar(200, 2, 700, 0.5),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 3000),
            pixelOffset: new Cesium.Cartesian2(0, -25),
        },
        label: {
            backgroundColor: new Cesium.Color(0, 0, 0, 0),
            //showBackground: true,
            //font: "14px sans-serif",
            text: text,
            fillColor: Cesium.Color.SKYBLUE,
            pixelOffset: new Cesium.Cartesian2(0, -80),
            //scaleByDistance: new Cesium.NearFarScalar(200, 2, 700, 0.5),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 3000)
        }
    })
    return entitys
}

//绑定billboard点击事件
const handclickBillboard = () => {
    let entityArray = []
    let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    pickhandle.setInputAction((momvent) => {
        let entity = viewer.scene.pick(momvent.position)
        console.log(entity)
        //entity.id.buildId ===undefined &&
        if (Cesium.defined(entity) && entity.id.buildId === undefined && entity.id.shequId !== undefined && entity.id.xiaoquId !== undefined && entity.id.isSelect === false) {
            entity.id.isSelect = true
            const buildData = getCommunityBuild(entity.id.shequId, entity.id.xiaoquId)
            const areaData = getCommunityArea(entity.id.shequId, entity.id.xiaoquId)
            for (let i = 0; i < buildData.length; i++) {
                let buildDataPoi = buildData[i].poi
                let position = Cesium.Cartesian3.fromDegrees(buildDataPoi[0], buildDataPoi[1], 13)
                let billLabel = viewer.entities.add({
                    buildId: buildData[i].id,
                    position: position,
                    label: {
                        backgroundColor: new Cesium.Color(0, 0, 0, 0),
                        showBackground: true,
                        font: "18px sans-serif",
                        text: buildData[i].name,
                        fillColor: Cesium.Color.WHITE,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 3000)
                    }
                })
                entityArray.push(billLabel)
            }

            for (let j = 0; j < areaData.length; j++) {
                //小区边界
                const material = new Cesium.Color(204 / 256, 211 / 256, 230 / 256, 0.5)
                const areaentity = addCommunityArea2(areaData[j].area, material)
                entityArray.push(areaentity)
            }
        } else if (Cesium.defined(entity) && entity.id.buildId === undefined && entity.id.shequId !== undefined && entity.id.xiaoquId !== undefined && entity.id.isSelect === true) {
            entity.id.isSelect = false
            for (let i = 0; i < entityArray.length; i++) {
                viewer.entities.remove(entityArray[i])
            }
        } else if (Cesium.defined(entity) && entity.id.buildId !== undefined) {
            let build = entity.id.buildId;
            //houseDialog(build);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

//根据id获取建筑数据
const getCommunityBuild = (shequid, xiaoquid) => {
    let buildData = []
    for (let i = 0; i < community_build.length; i++) {
        if (community_build[i].shequid === shequid && community_build[i].xiaoquid === xiaoquid) {
            buildData.push(community_build[i])
        }
    }
    return buildData
}
//根据id获取小区数据
const getCommunityArea = (shequid, xiaoquid) => {
    let AreaData = []
    for (let i = 0; i < xiaoqu.length; i++) {
        if (xiaoqu[i].shequid === shequid && xiaoqu[i].id === xiaoquid) {
            AreaData.push(xiaoqu[i])
        }
    }
    return AreaData
}

let positions = Cesium.Cartesian3.fromDegrees(-73.98580932617188, 40.74843406689482, 363.34038727246224)
let headings = Cesium.Math.toRadians(0)
const cameraFlyto = (positon = positions, height = 1000, heading = headings) => {
    const LonLatArray = getLonLat(positon)
    const camera = viewer.scene.camera;
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(LonLatArray[0], LonLatArray[1], LonLatArray[2] + height),
        complete: function () {
            setTimeout(function () {
                camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(LonLatArray[0], LonLatArray[1], height),
                    orientation: {
                        heading: heading
                    },
                    easingFunction: Cesium.EasingFunction.LINEAR_NONE
                });
            }, 1000);
        }
    });
}

const getLonLat = (cartesian) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height
    return [longitudeString, latitudeString, height]
}


export { communityInit }