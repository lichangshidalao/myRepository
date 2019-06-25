import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import './viewer.css';
import forward from "../img/forward.jpg"


//const viewer
let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        //triangles
        let glTriangles = this.refs.Triangles1.getContext('webgl')
        drawTriangles(glTriangles)
        
        //矩形
        let imgObj = new Image();
        let rectangleCanvas = this.refs.rectangle1
        imgObj.src = forward;
        //待图片加载完后，将其显示在canvas上
        imgObj.onload = function () { //onload必须使用
            drawRectangle(rectangleCanvas, this)
        }

    }
    render() {
        return (
            <div style={{ height: "800px" }}>
                <canvas ref="Triangles1" style={{ width: "350px", height: "350px" }}></canvas>
                <canvas ref="rectangle1" style={{ width: "350px", height: "350px" }}></canvas>
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
const drawRectangle = (canvas, cvs) => {
    //rectangle
    //let glRectangle = this.refs.rectangle1.getContext('webgl')
    let glRectangle = canvas.getContext('webgl')
    let vertexShaderSourceLRectangle = '' +
        //attribute声明vec4类型变量apos
        'attribute vec4 a_Position;' +
        'attribute vec2 a_TexCoord;' +
        'varying vec2 v_TexCoord;' +
        'void main() {' +
        '  gl_Position = a_Position;' +
        '  v_TexCoord = a_TexCoord;' +
        '}';
    //片元着色器源码
    let fragShaderSourceLRectangle = '' +
        'precision mediump float;' +
        'uniform sampler2D u_Sampler;' +
        'varying vec2 v_TexCoord;' +
        'void main() {' +
        '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);' +
        '}';
    //初始化着色器
    let programRectangle = initShader(glRectangle, vertexShaderSourceLRectangle, fragShaderSourceLRectangle);
    //获取顶点着色器的位置变量a_Position
    let PLocation = glRectangle.getAttribLocation(programRectangle, 'a_Position');

    //类型数组构造函数Float32Array创建顶点数组
    let positions = new Float32Array(
        [
            -0.5, 0.5,
            -0.5, -0.5,
            0.5, 0.5,
            0.5, -0.5
        ]
    )
    let texCoords = new Float32Array([
        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,
    ]);
    //创建缓冲区对象
    let bufferRectangle = glRectangle.createBuffer();
    //绑定缓冲区对象
    glRectangle.bindBuffer(glRectangle.ARRAY_BUFFER, bufferRectangle);
    //顶点数组data数据传入缓冲区
    glRectangle.bufferData(glRectangle.ARRAY_BUFFER, positions, glRectangle.STATIC_DRAW);
    //缓冲区中的数据按照一定的规律传递给位置变量a_Position
    glRectangle.vertexAttribPointer(PLocation, 2, glRectangle.FLOAT, false, 0, 0);
    //允许数据传递
    glRectangle.enableVertexAttribArray(PLocation);

    //a_TexCoord
    let TLocation = glRectangle.getAttribLocation(programRectangle, 'a_TexCoord');
    //创建缓冲区对象
    let tbuffer = glRectangle.createBuffer();
    //绑定缓冲区对象
    glRectangle.bindBuffer(glRectangle.ARRAY_BUFFER, tbuffer);
    //顶点数组data数据传入缓冲区
    glRectangle.bufferData(glRectangle.ARRAY_BUFFER, texCoords, glRectangle.STATIC_DRAW);
    //缓冲区中的数据按照一定的规律传递给位置变量a_Position
    glRectangle.vertexAttribPointer(TLocation, 2, glRectangle.FLOAT, false, 0, 0);
    //允许数据传递
    glRectangle.enableVertexAttribArray(TLocation);


    // 创建纹理
    var samplerLoc = glRectangle.getUniformLocation(programRectangle, 'u_Sampler');
    var texture = glRectangle.createTexture();
    glRectangle.bindTexture(glRectangle.TEXTURE_2D, texture);
    glRectangle.pixelStorei(glRectangle.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate

    // 设置参数，让我们可以绘制任何尺寸的图像
    glRectangle.texParameteri(glRectangle.TEXTURE_2D, glRectangle.TEXTURE_WRAP_S, glRectangle.CLAMP_TO_EDGE);
    glRectangle.texParameteri(glRectangle.TEXTURE_2D, glRectangle.TEXTURE_WRAP_T, glRectangle.CLAMP_TO_EDGE);
    glRectangle.texParameteri(glRectangle.TEXTURE_2D, glRectangle.TEXTURE_MIN_FILTER, glRectangle.NEAREST);
    glRectangle.texParameteri(glRectangle.TEXTURE_2D, glRectangle.TEXTURE_MAG_FILTER, glRectangle.NEAREST);


    // 将图像上传到纹理
    glRectangle.texImage2D(glRectangle.TEXTURE_2D, 0, glRectangle.RGBA, glRectangle.RGBA, glRectangle.UNSIGNED_BYTE, cvs);
    glRectangle.uniform1i(samplerLoc, 0);

    glRectangle.clearColor(0.0, 0.0, 0.0, 1.0);

    glRectangle.clear(glRectangle.COLOR_BUFFER_BIT);
    glRectangle.drawArrays(glRectangle.TRIANGLE_STRIP, 0, 4)
}

const drawTriangles = (glTriangles) => {
    let vertexShaderSourceL = '' +
        //attribute声明vec4类型变量apos
        'attribute vec4 a_Position;' +
        'attribute vec4 a_color;' +
        'varying vec4 v_color;' +
        'void main(){' +
        //顶点坐标apos赋值给内置变量gl_Position
        'gl_Position =a_Position;' +
        'v_color=a_color;' +
        '}';
    //片元着色器源码
    let fragShaderSourceL = '' +
        'precision mediump float;' +
        'varying vec4 v_color;' +
        'void main(){' +
        '   gl_FragColor = v_color;' +
        '}';
    //初始化着色器
    let program = initShader(glTriangles, vertexShaderSourceL, fragShaderSourceL);
    //获取顶点着色器的位置变量a_Position
    let aposLocation = glTriangles.getAttribLocation(program, 'a_Position');

    //类型数组构造函数Float32Array创建顶点数组
    let data = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);
    let sizes = data.BYTES_PER_ELEMENT
    //创建缓冲区对象
    let buffer = glTriangles.createBuffer();
    //绑定缓冲区对象
    glTriangles.bindBuffer(glTriangles.ARRAY_BUFFER, buffer);
    //顶点数组data数据传入缓冲区
    glTriangles.bufferData(glTriangles.ARRAY_BUFFER, data, glTriangles.STATIC_DRAW);
    //缓冲区中的数据按照一定的规律传递给位置变量a_Position
    glTriangles.vertexAttribPointer(aposLocation, 2, glTriangles.FLOAT, false, sizes * 5, 0);
    //允许数据传递
    glTriangles.enableVertexAttribArray(aposLocation);

    //获取顶点着色器的位置变量a_color
    let colorLocation = glTriangles.getAttribLocation(program, 'a_color');
    //缓冲区中的数据按照一定的规律传递给位置变量apos
    glTriangles.vertexAttribPointer(colorLocation, 3, glTriangles.FLOAT, false, sizes * 5, sizes * 2);
    //允许数据传递
    glTriangles.enableVertexAttribArray(colorLocation);

    glTriangles.clearColor(0.0, 0.0, 0.0, 1.0);

    glTriangles.clear(glTriangles.COLOR_BUFFER_BIT);
    //开始绘制图形
    glTriangles.drawArrays(glTriangles.TRIANGLES, 0, 3);

}