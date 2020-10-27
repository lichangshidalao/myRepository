import React, { Component } from 'react';
import * as THREE from "three";
import Orbitcontrols from 'three-orbitcontrols';
import imagess from '../img/forward.jpg'
import ThreeTemplates from './Template/ThreeTemplates'

class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        var scene = new THREE.Scene();
        let aimDiv = this.refs.map
        //设置相机（视野，显示口的宽高比，近裁剪面，远裁剪面）
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //渲染器
        var renderer = new THREE.WebGLRenderer({ antialias: true });

        //设置渲染器的高度和宽度，如果加上第三个值 false，则按场景大小显示，等比例缩放
        renderer.setSize(1614, 814, false);
        //将渲染器添加到html当中
        aimDiv.appendChild(renderer.domElement);

        //盒子模型（BoxGeometry），这是一个包含立方体所有顶点和填充面的对象。
        var geometryCube = new THREE.BoxGeometry(1, 1, 1);
        //使用网孔基础材料（MeshBasicMaterial）进行着色器，这里只绘制了一个绿色
        var materialCube = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        //使用网孔(Mesh)来承载几何模型
        var cube = new THREE.Mesh(geometryCube, materialCube);
        cube.position.set(10, 0, 0)

        //image
        var geometryCube2 = new THREE.BoxGeometry(1, 1, 1);
        let texture = new THREE.TextureLoader().load("http://localhost:8080/Apps/SampleData/globe.jpg");
        //然后创建一个phong材质来处理着色，并传递给纹理映射
        var materialCube2 = new THREE.MeshPhongMaterial({ map: texture });
        let cube2 = new THREE.Mesh(geometryCube, materialCube2)
        scene.add(cube2)

        //将模型添加到场景当中
        scene.add(cube);
        //将相机沿z轴偏移5
        camera.position.z = 5;
        //设置相机的视点
        camera.position.set(0, 0, 20);
        //设置相机的朝向
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        //定义线的基本材料，我们可以使用LineBasicMaterial（实线材料）和LineDashedMaterial（虚线材料）
        var materialLine = new THREE.LineBasicMaterial({ color: 0x0000ff });
        //设置具有几何顶点的几何（Geometry）或缓冲区几何（BufferGeometry）设置顶点位置，看名字就知道了，一个是直接将数据保存在js里面的，另一个是保存在WebGL缓冲区内的，而且肯定保存到WebGL缓冲区内的效率更高
        var geometryLine = new THREE.Geometry();
        geometryLine.vertices.push(new THREE.Vector3(-10, 0, 0));
        geometryLine.vertices.push(new THREE.Vector3(0, 10, 0));
        geometryLine.vertices.push(new THREE.Vector3(10, 0, 0));
        //使用Line方法将线初始化
        var line = new THREE.Line(geometryLine, materialLine);
        //将线添加到场景
        scene.add(line);

        //创建一个平行光光源照射到物体上
        var light = new THREE.DirectionalLight(0xffffff, 1.5);
        //设置平型光照射方向，照射方向为设置的点照射到原点
        light.position.set(0, 0, 1);
        //将灯光放到场景当中
        scene.add(light);

        let cameraZ = 5, isadd = true

        //设置一个动画函数
        var animate = function () {
            //一秒钟调用60次，也就是以每秒60帧的频率来绘制场景。
            requestAnimationFrame(animate);
            if (camera.position.z < 50 && isadd) {
                camera.position.z += 0.1;
                if (camera.position.z > 50) {
                    isadd = false
                }
            } else {
                isadd = false
                camera.position.z -= 0.1;
                if (camera.position.z < 5) {
                    isadd = true
                }
            }
            //console.log(cube.rotation);
            //每次调用模型的沿xy轴旋转0.01
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube2.rotation.x += 0.02;
            cube2.rotation.y += 0.02;
            //使用渲染器把场景和相机都渲染出来
            renderer.render(scene, camera);
        };

        animate();
    }

    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}
export default Map