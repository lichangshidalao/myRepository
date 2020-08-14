import * as Cesium from "cesium/Cesium";

/**
   *圆形扩大扫描圈
   * */
function AddCircleScanPostStage(viewer, cartographicCenter, maxRadius, scanColor, duration) {
    var ScanSegmentShader = `
    const int   NUM_CIRCLES = 37;
    const float TIME_MULTIPLIER = 3.0;
    const float CIRCLE_RADIUS = 0.04;
    const float CONSTANT_N = 3.0;
    #define SHOW_LINES
    float N = CONSTANT_N;
    #define iTime czm_frameNumber * 0.01
    #define TWO_PI 6.28318530718
    #define TWO_THIRDS_PI 2.09439510239
    vec3 drawCircle(vec2 p, vec2 center, float radius, float edgeWidth, vec3 color) {
        return color * (1.0 - smoothstep(radius, radius + edgeWidth, length(p - center)));
    }
    uniform sampler2D colorTexture;
    uniform sampler2D depthTexture;
    varying vec2 v_textureCoordinates;
    uniform vec4 u_scanCenterEC;
    uniform vec3 u_scanPlaneNormalEC;
    uniform float u_radius;
    uniform vec4 u_scanColor;
    vec4 toEye(in vec2 uv, in float depth)
    {
        vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));
        vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);
        posInCamera = posInCamera / posInCamera.w;
        return posInCamera;
    }
    vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)
    {
        vec3 v01 = point - planeOrigin;
        float d = dot(planeNormal, v01);
        return (point - planeNormal * d);
    }
    float getDepth(in vec4 depth)
    {
        float z_window = czm_unpackDepth(depth);
        z_window = czm_reverseLogDepth(z_window);
        float n_range = czm_depthRange.near;
        float f_range = czm_depthRange.far;
        return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
    }
    void main()
    {
        gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
        float depth = getDepth(texture2D(depthTexture, v_textureCoordinates));
        vec4 viewPos = toEye(v_textureCoordinates, depth);
        vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);
        float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);
        #ifdef LET_N_GO_NUTS
        float N = sin(iTime) * 2.0 + 3.0; 
        #endif
        vec2 iResolution = czm_viewport.zw;
        vec2 uv = v_textureCoordinates.xy;
        uv-=0.5;

        vec3 color = vec3(0.0);
        float angleIncrement = TWO_PI / float(NUM_CIRCLES);
        for (int i = 0; i < NUM_CIRCLES; ++i) {
            float t = angleIncrement*(float(i));
            float r = sin(float(N)*t+iTime*TIME_MULTIPLIER);
            vec2 p = vec2(r*cos(t), r*sin(t));
    #ifdef COLORIZE
            vec3 circleColor = vec3(sin(t),
                                    sin(t+TWO_THIRDS_PI),
                                    sin(t+2.0*TWO_THIRDS_PI))*0.5+0.5;
    #else
            vec3 circleColor = vec3(1.0);
            
    #endif
            color += drawCircle(uv, p, CIRCLE_RADIUS, 0.01, circleColor);
        }
           
        gl_FragColor = vec4(mix(gl_FragColor.rgb, color, 0.5), 1.0);
        
    }` ;

    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);
    var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);
    var _time = (new Date()).getTime();
    var _scratchCartesian4Center = new Cesium.Cartesian4();
    var _scratchCartesian4Center1 = new Cesium.Cartesian4();
    var _scratchCartesian3Normal = new Cesium.Cartesian3();
    var ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;

            },
            u_radius: function () {
                return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
            },
            u_scanColor: scanColor
        }
    });
    viewer.scene.postProcessStages.add(ScanPostStage);
    return (ScanPostStage);

}
function addRotation(viewer, data) {
    //防止移动、放大缩小会视觉偏移depthTestAgainstTerrain
    //设置该属性为true之后，标绘将位于地形的顶部；如果设为false（默认值），那么标绘将位于平面上。
    //缺陷：开启该属性有可能在切换图层时会引发标绘消失的bug。
    viewer.scene.globe.depthTestAgainstTerrain = true;
    var CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(data.lon), Cesium.Math.toRadians(data.lat), 0); //中心位子
    return AddCircleScanPostStage(viewer, CartographicCenter, data.r, data.scanColor, data.interval);
}

/**
   *测试用例
   * */
// const circleScan = ysc.addCircleScan(viewer, {
//     lon: 117.217124,//经度
//     lat: 31.809777, //纬度
//     scanColor: new Cesium.Color(0.5, 0.5, 0.5, 1),
//     r: 1500,//扫描半径
//     interval: 4000//时间间隔
// });
export { addRotation }
