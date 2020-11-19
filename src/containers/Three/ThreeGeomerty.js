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
        let aimDiv = this.refs.map
        let ex = new ThreeTemplates()
        ex.init()
        aimDiv.appendChild(ex.dom);
        //通过加载图片生成一个纹理
        var map = new THREE.TextureLoader().load(imagess);
        //定义纹理在水平和垂直方向简单的重复到无穷大。
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        //定义纹理的各向异性
        map.anisotropy = 16;

        //定义兰伯特网孔材质
        var material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide });
        let sphere = new THREE.Mesh( new THREE.SphereGeometry(75,20,10), material);
        sphere.position.set( -400, 0, 200 );
        ex.scene.add(sphere);
        ex.renderer.render(ex.scene, ex.camera);
    }

    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}
export default Map