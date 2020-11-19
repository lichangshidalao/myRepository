
import * as THREE from "three";
class ThreeTemplates {
    constructor() {
        this.dom = document.createElement('div')
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.defaultParam = {
            width: 1614,
            height: 814,
            fov: 45,                            //— 摄像机视锥体垂直视野角度,
            aspect: 1614 / 814,                 // — 摄像机视锥体长宽比,
            near: 1,                            //— 摄像机视锥体近端面,
            far: 1000,                          //— 摄像机视锥体远端面,
            lightColor: 0xFF0000,
            lightIntensity: 1,
            lightPosition: [100, 100, 100]

        }
    }
    initDom(width = this.defaultParam.width, height = this.defaultParam.height) {
        this.dom.style.width = width + "px"
        this.dom.style.height = height + "px"
    }
    initRender() {
        this.renderer.setSize(this.defaultParam.width, this.defaultParam.height);
        this.renderer.setClearColor(0xffffff, 1.0);
    }
    initCamera(perspective = [this.defaultParam.fov, this.defaultParam.aspect, this.defaultParam.near, this.defaultParam.far]) {
        this.camera = new THREE.PerspectiveCamera(...perspective);
    }
    initScene() {
        this.scene = new THREE.Scene();
    }
    //平行光
    initLight() {
        this.light = new THREE.DirectionalLight(this.defaultParam.lightColor, this.defaultParam.lightIntensity);
        this.light.position.set(...this.defaultParam.lightPosition);
    }
    init() {
        this.initDom()
        this.initRender()
        this.initCamera()
        this.initScene()
        this.initLight()
    }
}

export default ThreeTemplates