import * as Cesium from "cesium/Cesium";
import { getLonLat } from "../getLonLat"

//位置
const transformTileset = (tileset, position) => {
    const LonLatArray = getLonLat(position)
    tileset.readyPromise.then(function (argument) {
        const positions = Cesium.Cartesian3.fromDegrees(LonLatArray[0], LonLatArray[1], 0)
        var mat = Cesium.Transforms.eastNorthUpToFixedFrame(positions);
        var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0)));
        Cesium.Matrix4.multiply(mat, rotationX, mat);
        tileset._root.transform = mat;
    });
}


//示例数据
let params = {
    tx: 110.5,  //模型中心X轴坐标（经度，单位：十进制度）
    ty: 30,     //模型中心Y轴坐标（纬度，单位：十进制度）  
    tz: 1120,    //模型中心Z轴坐标（高程，单位：米） 
    rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
    ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
    rz: 0,       //Z轴（高程）方向旋转角度（单位：度）
    scale: 1
};


//平移、贴地、旋转模型
const update3dtilesMaxtrix = (tileset, params) => {
    let Pmat = Cesium.Matrix4.fromArray(tileset._root.transform);
    //旋转
    let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
    let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
    let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
    let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
    let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
    let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    //平移   
    let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
    let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

    //缩放 x,y,z轴缩放
    //let mZoom = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(2.0, 1.0, 1.0));
    //等比例缩放
    let mZoom = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(params.scale, params.scale, params.scale));

    //旋转、平移、缩放矩阵相乘  缩放
    Cesium.Matrix4.multiply(m, rotationX, m);
    Cesium.Matrix4.multiply(m, rotationY, m);
    Cesium.Matrix4.multiply(m, rotationZ, m);
    Cesium.Matrix4.multiply(m, mZoom, m);
    //赋值给tileset 
    //tileset.root.transform = m;
    let mss = tileset.modelMatrix
    tileset.root.transform = Cesium.Matrix4.multiply(m, mss, m);
    //tileset.modelMatrix = m
    return [Pmat, tileset.root.transform]
}


//
//矩阵方位角互转，参考https://blog.csdn.net/qq_40043761/article/details/81020823
// 假设当前模型的经纬度坐标为{114, 30, 1000} 方位角{heading: 30, pitch: 20, roll: 10} 都是角度来计算 
// 1. 根据坐标, 方位角计算模型矩阵
// var position = Cesium.Cartesian3.fromDegrees(114, 30, 1000);
// var heading = Cesium.Math.toRadians(30);
// var pitch = Cesium.Math.toRadians(20);
// var roll = Cesium.Math.toRadians(10);
// var headingPitchRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);

// var m = Cesium.Transforms.headingPitchRollToFixedFrame(position, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());
// console.log(m);

// // 2. 根据模型的矩阵求方位角
// // 计算当前模型中心处的变换矩阵
// var m1 = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(114, 30, 1000), Cesium.Ellipsoid.WGS84, new Cesium.Matrix4());
// // 模型的矩阵
// var m2 = m;
// // 矩阵相除
// var m3 = Cesium.Matrix4.multiply(Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()), m2, new Cesium.Matrix4());
// // 得到旋转矩阵
// var mat3 = Cesium.Matrix4.getRotation(m3, new Cesium.Matrix3());
// // 计算四元数
// var q = Cesium.Quaternion.fromRotationMatrix(mat3);
// // 计算旋转角(弧度)
// var hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);
// // 得到角度
// var heading = Cesium.Math.toDegrees(hpr.heading);
// var pitch = Cesium.Math.toDegrees(hpr.pitch);
// var roll = Cesium.Math.toDegrees(hpr.roll);
// console.log('heading : ' + heading, 'pitch : ' + pitch, 'roll : ' + roll);
export default transformTileset
export { update3dtilesMaxtrix }