import React, { Component } from 'react';
import '../component/viewer.css';
import forward from "../img/forward.jpg"
import { Matrix4 } from "./cuon-matrix"

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
const drawTriangles = (glTriangles) => {

    //顶点着色器
    var vertexShaderSourceL = "" +
        "attribute vec4 a_Position;\n" +
        "attribute vec4 a_Color;\n" +
        "uniform mat4 u_ModelViewMatrix;\n" +
        "varying vec4 v_Color;\n" +
        "void main(){" +
        "   gl_Position = u_ModelViewMatrix * a_Position;\n" +
        "   v_Color = a_Color;\n" +
        "}\n";

    //片元着色器
    var fragShaderSourceL = "" +
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "varying vec4 v_Color;\n" +
        "void main(){" +
        "   gl_FragColor = v_Color;\n" +
        "}\n";
    //初始化着色器
    let program = initShader(glTriangles, vertexShaderSourceL, fragShaderSourceL);

    //获取顶点位置变量位置
    var a_Position = glTriangles.getAttribLocation(program, "a_Position");
    if (a_Position < 0) {
        console.log("无法获取顶点位置的存储变量");
        return -1;
    }
    //获取顶点颜色的变量
    var a_Color = glTriangles.getAttribLocation(program, "a_Color");
    if (a_Color < 0) {
        console.log("无法获取顶点位置的存储变量");
        return -1;
    }
    //类型数组构造函数Float32Array创建顶点数组
    var verticesColors = new Float32Array([
        // 设置顶点和颜色（偷的顶点代码位置）
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0 White
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // v1 Magenta
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,  // v2 Red
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // v3 Yellow
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0,  // v4 Green
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // v5 Cyan
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,  // v6 Blue
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7 Black
    ]);
    //顶点索引
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // 前
        0, 3, 4, 0, 4, 5,    // 右
        0, 5, 6, 0, 6, 1,    // 上
        1, 6, 7, 1, 7, 2,    // 左
        7, 4, 3, 7, 3, 2,    // 下
        4, 7, 6, 4, 6, 5     // 后
    ]);

    //创建缓冲区对象
    var vertexColorBuffer = glTriangles.createBuffer();
    var indexBuffer = glTriangles.createBuffer();
    if (!vertexColorBuffer || !indexBuffer) {
        console.log("无法创建缓冲区对象");
        return -1;
    }

    //绑定缓冲区对象并写入数据
    glTriangles.bindBuffer(glTriangles.ARRAY_BUFFER, vertexColorBuffer);
    glTriangles.bufferData(glTriangles.ARRAY_BUFFER, verticesColors, glTriangles.STATIC_DRAW);

    //获取数组中一个元素所占的字节数
    var fsize = verticesColors.BYTES_PER_ELEMENT;

    //对位置的顶点数据进行分配，并开启
    glTriangles.vertexAttribPointer(a_Position, 3, glTriangles.FLOAT, false, fsize * 6, 0);
    glTriangles.enableVertexAttribArray(a_Position);


    //对位置的顶点数据进行分配，并开启
    glTriangles.vertexAttribPointer(a_Color, 3, glTriangles.FLOAT, false, fsize * 6, fsize * 3);
    glTriangles.enableVertexAttribArray(a_Color);

    //将顶点索引数据写入缓冲区对象
    glTriangles.bindBuffer(glTriangles.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glTriangles.bufferData(glTriangles.ELEMENT_ARRAY_BUFFER, indices, glTriangles.STATIC_DRAW);


    //设置视角矩阵的相关信息
    let u_ModelViewMatrix = glTriangles.getUniformLocation(program, "u_ModelViewMatrix");


    //设置视角矩阵的相关信息（视点，视线，上方向）
    let viewMatrix = new Matrix4();
    viewMatrix.setLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    //设置模型矩阵的相关信息
    let modelMatrix = new Matrix4();
    modelMatrix.setRotate(0, 0, 0, 1);

    //设置透视投影矩阵
    let projMatrix = new Matrix4();
    projMatrix.setPerspective(30, 1, 1, 100);

    //计算出模型视图矩阵 viewMatrix.multiply(modelMatrix)相当于在着色器里面u_ViewMatrix * u_ModelMatrix
    let modeViewMatrix = projMatrix.multiply(viewMatrix.multiply(modelMatrix));

    //将试图矩阵传给u_ViewMatrix变量
    glTriangles.uniformMatrix4fv(u_ModelViewMatrix, false, modeViewMatrix.elements);



    glTriangles.clearColor(0.0, 0.0, 0.0, 1.0);

    glTriangles.clear(glTriangles.COLOR_BUFFER_BIT);
    //开始绘制图形
    glTriangles.drawElements(glTriangles.TRIANGLES, indices.length, glTriangles.UNSIGNED_BYTE, 0);
}