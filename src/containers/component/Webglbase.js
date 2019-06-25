import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import './viewer.css';
import { height } from 'window-size';


//const viewer
let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        //point
        let canvas = this.refs.mapPoint
        let gl = canvas.getContext('webgl')
        //顶点着色器
        let vertexShaderSource = '' +
            'void main(){' +
            //给内置变量gl_PointSize赋值像素大小
            '   gl_PointSize=20.0;' +
            //顶点位置，位于坐标原点
            '   gl_Position =vec4(0.0,0.0,0.0,1.0);' +
            '}';

        //片元着色器源码
        let fragShaderSource = '' +
            'void main(){' +
            //定义片元颜色
            '   gl_FragColor = vec4(1.0,1.0,0.0,1.0);' +
            '}';

        //初始化着色器
        initShader(gl, vertexShaderSource, fragShaderSource);
        //开始绘制，显示器显示结果
        gl.drawArrays(gl.POINTS, 0, 1);







        //line
        let glLine = this.refs.mapLine.getContext('webgl')
        let vertexShaderSourceL = '' +
            //attribute声明vec4类型变量apos
            'attribute vec4 apos;' +
            'void main(){' +
            //顶点坐标apos赋值给内置变量gl_Position
            '   gl_Position =apos;' +
            '}';
        //片元着色器源码
        let fragShaderSourceL = '' +
            'void main(){' +
            '   gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
            '}';
        //初始化着色器
        let program = initShader(glLine, vertexShaderSourceL, fragShaderSourceL);
        //获取顶点着色器的位置变量apos              ，即aposLocation指向apos变量。
        let aposLocation = glLine.getAttribLocation(program, 'apos');

        //类型数组构造函数Float32Array创建顶点数组
        let data = new Float32Array([0.5, 0.5, -0.5, 0.6, -0.7, -0.5, 0.7, -0.8, 1]);

        //创建缓冲区对象
        let buffer = glLine.createBuffer();
        //绑定缓冲区对象
        glLine.bindBuffer(glLine.ARRAY_BUFFER, buffer);
        //顶点数组data数据传入缓冲区
        glLine.bufferData(glLine.ARRAY_BUFFER, data, glLine.STATIC_DRAW);
        //缓冲区中的数据按照一定的规律传递给位置变量apos
        glLine.vertexAttribPointer(aposLocation, 3, glLine.FLOAT, false, 0, 0);
        //允许数据传递
        glLine.enableVertexAttribArray(aposLocation);

        //开始绘制图形
        glLine.drawArrays(glLine.LINE_LOOP, 0, 3);


    }
    render() {
        return (
            <div style={{ height: "800px" }}>
                <canvas ref="mapPoint"></canvas>
                <canvas ref="mapLine"></canvas>
            </div>
        );
    }
}
export default Map

//声明初始化着色器函数
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
    //创建顶点着色器对象
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    //创建片元着色器对象
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    //创建程序对象program
    let program = gl.createProgram();
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接program
    gl.linkProgram(program);
    //使用program
    gl.useProgram(program);
    //返回程序program对象
    return program;
}