import Cesium from "cesium/Cesium";
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
}

export default transformTileset
export { update3dtilesMaxtrix }