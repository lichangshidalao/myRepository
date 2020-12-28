import React, { Component } from 'react';
import * as THREE from "three";
import Orbitcontrols from 'three-orbitcontrols';
import clouds from '../img/clouds.jpg'
import earth from '../img/earth.jpg'

class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        var scene = new THREE.Scene();
        let aimDiv = this.refs.map
        //设置相机（视野，显示口的宽高比，近裁剪面，远裁剪面）
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 45, 10000);
        camera.position.x = -500;
        camera.position.y = 500;
        camera.position.z = -500;
        camera.lookAt({ x: 0, y: 0, z: 0 });
        //渲染器
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        //设置渲染器的高度和宽度，如果加上第三个值 false，则按场景大小显示，等比例缩放
        renderer.setSize(1614, 814, false);
        //将渲染器添加到html当中
        aimDiv.appendChild(renderer.domElement);

        var light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(100, 100, 200);
        scene.add(light);

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


        var earthGeo = new THREE.SphereGeometry(200, 100, 100);
        var earthMater = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(earth),
            side: THREE.DoubleSide
        });
        var earthMesh = new THREE.Mesh(earthGeo, earthMater);
        scene.add(earthMesh);

        var cloudsGeo = new THREE.SphereGeometry(201, 100, 100);
        var cloudsMater = new THREE.MeshPhongMaterial({
            alphaMap: new THREE.TextureLoader().load(clouds),
            transparent: true,
            opacity: 0.2
        });
        var cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
        scene.add(cloudsMesh);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        //设置一个动画函数
        var animate = function () {
            //一秒钟调用60次，也就是以每秒60帧的频率来绘制场景。
            controls.update();
              // 地球自转
        earthMesh.rotation.y -= 0.002;

        // 漂浮的云层
        cloudsMesh.rotation.y -= 0.002;
    
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
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