import Cesium from "cesium/Cesium";
import circle1 from "../img/circle1.png"
import circle2 from "../img/circle2.png"
/**
   * 创建一个动态实体弹窗
   */
function showDynamicLayer(viewer, data, callback) {
    let element = data.element, elementLine = data.elementLine, elementMain = data.elementMain, lon = parseInt(data.lon), lat = parseInt(data.lat);
    let sStartFlog = false;
    setTimeout(function () {
        sStartFlog = true;
    }, 300);
    let s1 = 0.001, s2 = s1, s3 = s1, s4 = s1;
    /* 弹窗的dom操作--默认必须*/
    element.style.opacity = 0
    elementLine.style.width = 0
    elementMain.style.display = 'none';
    /* 弹窗的dom操作--针对性操作*/
    callback();

    if (data.addEntity) {
        var rotation = Cesium.Math.toRadians(30);
        var rotation2 = Cesium.Math.toRadians(30);
        function getRotationValue() {
            rotation += 0.05;
            return rotation;
        }
        function getRotationValue2() {
            rotation2 -= 0.03;
            return rotation2;
        }
        //如果有实体存在 先清除实体;
        viewer.entities.removeById("ysDynamicLayerEntityNoNeed1");
        viewer.entities.removeById("ysDynamicLayerEntityNoNeed2");
        viewer.entities.removeById("ysDynamicLayerEntityNoNeed3");
        //构建entity
        var height = data.boxHeight, heightMax = data.boxHeightMax, heightDif = data.boxHeightDif;
        var goflog = true;
        //添加正方体
        viewer.entities.add({
            id: "ysDynamicLayerEntityNoNeed1",
            name: "立方体盒子",
            position: new Cesium.CallbackProperty(function () {
                height = height + heightDif;
                if (height >= heightMax) {
                    height = heightMax;
                }
                return Cesium.Cartesian3.fromDegrees(lon, lat, height / 2)
            }, false),
            box: {
                dimensions: new Cesium.CallbackProperty(function () {
                    height = height + heightDif;
                    if (height >= heightMax) {
                        height = heightMax;
                        if (goflog) {//需要增加判断 不然它会一直执行; 导致对div的dom操作 会一直重复
                            // addLayer();//添加div弹窗
                            goflog = false;
                        }
                    }
                    return new Cesium.Cartesian3(data.boxSide, data.boxSide, height)
                }, false),
                material: data.boxMaterial
            }
        });
        //添加底座一 外环
        viewer.entities.add({
            id: "ysDynamicLayerEntityNoNeed2",
            name: "椭圆",
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            ellipse: {
                // semiMinorAxis :data.circleSize, //直接这个大小 会有一个闪白的材质 因为cesium材质默认是白色 所以我们先将大小设置为0
                // semiMajorAxis : data.circleSize,
                semiMinorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s1 = s1 + data.circleSize / 20;
                        if (s1 >= data.circleSize) {
                            s1 = data.circleSize;
                        }
                    }
                    return s1;
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s2 = s2 + data.circleSize / 20;
                        if (s2 >= data.circleSize) {
                            s2 = data.circleSize;
                        }
                    }
                    return s2;
                }, false),
                material: circle2,
                rotation: new Cesium.CallbackProperty(getRotationValue, false),
                stRotation: new Cesium.CallbackProperty(getRotationValue, false),
                zIndex: 2,
            }
        });
        //添加底座二 内环
        viewer.entities.add({
            id: "ysDynamicLayerEntityNoNeed3",
            name: "椭圆",
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s3 = s3 + data.circleSize / 20;
                        if (s3 >= data.circleSize / 2) {
                            s3 = data.circleSize / 2;
                        }
                    }
                    return s3;
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s4 = s4 + data.circleSize / 20;
                        if (s4 >= data.circleSize / 2) {
                            s4 = data.circleSize / 2;
                        }
                    }
                    return s4;
                }, false),
                material: circle1,
                rotation: new Cesium.CallbackProperty(getRotationValue2, false),
                stRotation: new Cesium.CallbackProperty(getRotationValue2, false),
                zIndex: 3
            }
        });
    } else {
        addLayer();//添加div弹窗
    }

    function addLayer() {
        //添加div
        var divPosition = Cesium.Cartesian3.fromDegrees(lon, lat, data.boxHeightMax);
        element.style.opacity = 1
        elementLine.style.width = 50
        elementMain.style.opacity = 1


        // element.css({ opacity: 1 });
        // element.find(".line").animate({
        //     width: 50//线的宽度
        // }, 500, function () {
        //     element.find(".main").fadeIn(500)
        // });
        ysc.creatHtmlElement(viewer, element, divPosition, [10, -(parseInt(element.style.height))], true); //当为true的时候，表示当element在地球背面会自动隐藏。默认为false，置为false，不会这样。但至少减轻判断计算压力
    }
}
/**
     * 创建一个 htmlElement元素 并且，其在earth背后会自动隐藏
     */
function creatHtmlElement(viewer, element, position, arr, flog) {
    var scratch = new Cesium.Cartesian2(); //cesium二维笛卡尔 笛卡尔二维坐标系就是我们熟知的而二维坐标系；三维也如此
    var scene = viewer.scene, camera = viewer.camera;
    scene.preRender.addEventListener(function () {
        var canvasPosition = scene.cartesianToCanvasCoordinates(position, scratch);//cartesianToCanvasCoordinates 笛卡尔坐标（3维度）到画布坐标
        if (Cesium.defined(canvasPosition)) {
            element.style.left = canvasPosition.x + arr[0]
            element.style.top = canvasPosition.x + arr[1]
            // element.css({
            //     // top:canvasPosition.y,
            //     // left:canvasPosition.x
            //     left: canvasPosition.x + arr[0],
            //     top: canvasPosition.y + arr[1]
            // });
            /* 此处进行判断**/// var px_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian);
            if (flog && flog == true) {
                var e = position, i = camera.position, n = scene.globe.ellipsoid.cartesianToCartographic(i).height;
                if (!(n += 1 * scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(i, e) > n)) {
                    el.style.display = 'block'
                } else {
                    el.style.display = "none"
                }
            }
            /* 此处进行判断**/
        }
    });
}

export { showDynamicLayer, creatHtmlElement }