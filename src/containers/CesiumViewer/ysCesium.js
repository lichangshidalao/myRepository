/**
 * @author 跃焱邵隼
 * @time 2019
 * @host:www.wellyyss.cn
 * qq group: 169470811
 */

;const YsCesium = (function (W,D,U) {
    let app ;
    function YsCesium(container,options) {
        if(!options) options = {}
        //cesium资源ion
        options.defaultAccessToken =  options.defaultAccessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNDhhYmQxOC1mYzMwLTRhYmEtOTI5Ny1iNGExNTQ3ZTZhODkiLCJpZCI6NTQ1NCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MzM3Mzc0NH0.RU6ynAZcwQvdfygt_N_j2rb2lpsuyyROzdaLQg0emAg'
        Cesium.Ion.defaultAccessToken = options.defaultAccessToken
        const args = ["geocoder","homeButton","sceneModePicker","baseLayerPicker","navigationHelpButton","animation","timeLine","fullscreenButton","vrButton","infoBox","selectionIndicator"]

        args.forEach(e => options[e] = options[e] || false )
        this.viewer = new Cesium.Viewer(container,options)

        //取消双击选中事件。(这个作用不大)
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        //全球光照
        this.viewer.scene.globe.enableLighting = options.globeLight
        //大气层
        this.viewer.scene.globe.showGroundAtmosphere = options.showGroundAtmosphere

        app = this
    }

    /**
     * 开启自传
     * maxHeight：当高度低于此 不再自传
     */
    YsCesium.prototype.autoRotate = function (maxHeight) {
        let i = Date.now()
        const viewer = this.viewer
        function rotate() {
            let t = Date.now()
            let n = (t - i) / 1e3
            i = t
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.1 * n)
        }
        viewer.clock.onTick.addEventListener(rotate)

        // // 监听鼠标，当高度小于多少的时候 取消自转
        // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        // handler.setInputAction(function(wheelment) {
        //     const height = Math.ceil(viewer.camera.positionCartographic.height);//取整数
        //     if(height<maxHeight){
        //         viewer.clock.onTick.removeEventListener(rotate);
        //     }else{
        //         viewer.clock.onTick.addEventListener(rotate);
        //     }
        // }, Cesium.ScreenSpaceEventType.WHEEL);

        //监听视角变化，来判断
        viewer.camera.changed.addEventListener(function () {
            const height = Math.ceil(viewer.camera.positionCartographic.height);//取整数
            if(height<maxHeight){
                viewer.clock.onTick.removeEventListener(rotate);
            }else{
                viewer.clock.onTick.addEventListener(rotate);
            }
        });//监听视角移动/变化
    }
    function addCircleScanPostStage(viewer, cartographicCenter, maxRadius, scanColor, duration) {
        const ScanSegmentShader =
            "uniform sampler2D colorTexture;" +
            "uniform sampler2D depthTexture;" +
            "varying vec2 v_textureCoordinates;" +
            "uniform vec4 u_scanCenterEC;" +
            "uniform vec3 u_scanPlaneNormalEC;" +
            "uniform float u_radius;" +
            "uniform vec4 u_scanColor;" +
            "vec4 toEye(in vec2 uv, in float depth)" +
            " {" +
            " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));" +
            " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);" +
            " posInCamera =posInCamera / posInCamera.w;" +
            " return posInCamera;" +
            " }" +
            "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)" +
            "{" +
            "vec3 v01 = point -planeOrigin;" +
            "float d = dot(planeNormal, v01) ;" +
            "return (point - planeNormal * d);" +
            "}" +
            "float getDepth(in vec4 depth)" +
            "{" +
            "float z_window = czm_unpackDepth(depth);" +
            "z_window = czm_reverseLogDepth(z_window);" +
            "float n_range = czm_depthRange.near;" +
            "float f_range = czm_depthRange.far;" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);" +
            "}" +
            "void main()" +
            "{" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);" +
            "if(dis < u_radius)" +
            "{" +
            "float f = 1.0 -abs(u_radius - dis) / u_radius;" +
            "f = pow(f, 4.0);" +
            "gl_FragColor = mix(gl_FragColor, u_scanColor, f);" +
            "}" +
            "}";

        const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
        const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);
        const _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
        const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
        const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);
        const _time = (new Date()).getTime();
        const _scratchCartesian4Center = new Cesium.Cartesian4();
        const _scratchCartesian4Center1 = new Cesium.Cartesian4();
        const _scratchCartesian3Normal = new Cesium.Cartesian3();
        const ScanPostStage = new Cesium.PostProcessStage({
            fragmentShader: ScanSegmentShader,
            uniforms: {
                u_scanCenterEC: function () {
                    return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                },
                u_scanPlaneNormalEC: function () {
                    const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
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
        viewer.scene.postProcessStages.add(ScanPostStage)
        return ScanPostStage
    }
    /**
     * 添加圆区 扫描
     */
    YsCesium.prototype.addCircleScan = function(data) {
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //防止移动、放大缩小会视觉偏移depthTestAgainstTerrain // 设置该属性为true之后，标绘将位于地形的顶部；如果设为false（默认值），那么标绘将位于平面上。缺陷：开启该属性有可能在切换图层时会引发标绘消失的bug。
        const CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(data.lon), Cesium.Math.toRadians(data.lat), 0); //中心位子
        return  addCircleScanPostStage(this.viewer, CartographicCenter,data.r,data.scanColor,data.interval);
    }
    function addRadarScanPostStage(viewer, cartographicCenter, radius, scanColor, duration) {
        const ScanSegmentShader =
            "uniform sampler2D colorTexture;" +
            "uniform sampler2D depthTexture;" +
            "varying vec2 v_textureCoordinates;" +
            "uniform vec4 u_scanCenterEC;" +
            "uniform vec3 u_scanPlaneNormalEC;" +
            "uniform vec3 u_scanLineNormalEC;" +
            "uniform float u_radius;" +
            "uniform vec4 u_scanColor;" +
            "vec4 toEye(in vec2 uv, in float depth)" +
            " {" +
            " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));" +
            " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);" +
            " posInCamera =posInCamera / posInCamera.w;" +
            " return posInCamera;" +
            " }" +
            "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)" +
            "{" +
            "vec3 v01 = testPt - ptOnLine;" +
            "normalize(v01);" +
            "vec3 temp = cross(v01, lineNormal);" +
            "float d = dot(temp, u_scanPlaneNormalEC);" +
            "return d > 0.5;" +
            "}" +
            "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)" +
            "{" +
            "vec3 v01 = point -planeOrigin;" +
            "float d = dot(planeNormal, v01) ;" +
            "return (point - planeNormal * d);" +
            "}" +
            "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)" +
            "{" +
            "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);" +
            "return length(tempPt - ptOnLine);" +
            "}" +
            "float getDepth(in vec4 depth)" +
            "{" +
            "float z_window = czm_unpackDepth(depth);" +
            "z_window = czm_reverseLogDepth(z_window);" +
            "float n_range = czm_depthRange.near;" +
            "float f_range = czm_depthRange.far;" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);" +
            "}" +
            "void main()" +
            "{" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);" +
            "float twou_radius = u_radius * 2.0;" +
            "if(dis < u_radius)" +
            "{" +
            "float f0 = 1.0 -abs(u_radius - dis) / u_radius;" +
            "f0 = pow(f0, 64.0);" +
            "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;" +
            "float f = 0.0;" +
            "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))" +
            "{" +
            "float dis1= length(prjOnPlane.xyz - lineEndPt);" +
            "f = abs(twou_radius -dis1) / twou_radius;" +
            "f = pow(f, 3.0);" +
            "}" +
            "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);" +
            "}" +
            "}";

        const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
        const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);
        const _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
        const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
        const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);
        const _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
        const _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
        const _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
        const _RotateQ = new Cesium.Quaternion();
        const _RotateM = new Cesium.Matrix3();
        const _time = (new Date()).getTime();
        const _scratchCartesian4Center = new Cesium.Cartesian4();
        const _scratchCartesian4Center1 = new Cesium.Cartesian4();
        const _scratchCartesian4Center2 = new Cesium.Cartesian4();
        const _scratchCartesian3Normal = new Cesium.Cartesian3();
        const _scratchCartesian3Normal1 = new Cesium.Cartesian3();
        const ScanPostStage = new Cesium.PostProcessStage({
            fragmentShader: ScanSegmentShader,
            uniforms: {
                u_scanCenterEC: function () {
                    return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                },
                u_scanPlaneNormalEC: function () {
                    const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;
                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                    return _scratchCartesian3Normal;

                },
                u_radius: radius,
                u_scanLineNormalEC: function () {
                    const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    const temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);
                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;
                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                    _scratchCartesian3Normal1.x = temp2.x - temp.x;
                    _scratchCartesian3Normal1.y = temp2.y - temp.y;
                    _scratchCartesian3Normal1.z = temp2.z - temp.z;
                    const tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                    Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                    Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                    Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                    return _scratchCartesian3Normal1;
                },
                u_scanColor: scanColor
            }
        });
        viewer.scene.postProcessStages.add(ScanPostStage);
        return (ScanPostStage);

    }
    /**
     * 区域雷达 扫描
     */
    YsCesium.prototype.addRadarScan = function(data) {
        this.viewer.scene.globe.depthTestAgainstTerrain = true
        const CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(data.lon), Cesium.Math.toRadians(data.lat),0)
        return  addRadarScanPostStage(this.viewer, CartographicCenter,data.r,data.scanColor,data.interval);
    }
    /**
     *两个圆扩散纹理
     * */
    YsCesium.prototype.addDoubleCircleRipple = function(data) {
        let r1 = data.minR, r2=data.minR
        const viewer = this.viewer
        function changeR1() {
            r1 = r1 + data.deviationR
            if(r1 >= data.maxR){
                r1 = data.minR
            }
            return r1;
        }
        function changeR2() {
            r2 = r2 + data.deviationR
            if(r2 >= data.maxR){
                r2 = data.minR
            }
            return r2
        }
        viewer.entities.add({
            name: "",
            id: data.id[0],
            position: Cesium.Cartesian3.fromDegrees(data.lon,data.lat,data.height),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(changeR1,false),
                semiMajorAxis: new Cesium.CallbackProperty(changeR1,false),
                height: data.height,
                material: new Cesium.ImageMaterialProperty({
                    image: data.imageUrl,
                    repeat: new Cesium.Cartesian2(1.0, 1.0),
                    transparent: true,
                    color: new Cesium.CallbackProperty(function () {
                        return Cesium.Color.WHITE.withAlpha(1-r1/data.maxR)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
                    },false)
                })
            }
        })
        setTimeout(() => {
            viewer.entities.add( {
                name: "",
                id: data.id[1],
                position: Cesium.Cartesian3.fromDegrees(data.lon,data.lat,data.height),
                ellipse: {
                    semiMinorAxis: new Cesium.CallbackProperty(changeR2,false),
                    semiMajorAxis: new Cesium.CallbackProperty(changeR2,false),
                    height: data.height,
                    material: new Cesium.ImageMaterialProperty({
                        image: data.imageUrl,
                        repeat: new Cesium.Cartesian2(1.0, 1.0),
                        transparent: true,
                        color: new Cesium.CallbackProperty(function () {
                            return Cesium.Color.WHITE.withAlpha(1-r1/data.maxR)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
                        },false)
                    })
                }
            })
        },data.eachInterval)
    }

    /**
     * 流动特效
     */
//定义流动线
    function initPolylineTrailLinkMaterialProperty(data) {
        function PolylineTrailLinkMaterialProperty(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = U;
            this._colorSubscription = U;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }
        Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
            isConstant: {
                get: function () {
                    return false;
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged;
                }
            },
            color: Cesium.createPropertyDescriptor('color')
        });
        PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
            return 'PolylineTrailLink';
        }
        PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
            result.image = Cesium.Material.PolylineTrailLinkImage;
            result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
            return this === other || (other instanceof PolylineTrailLinkMaterialProperty && Property.equals(this._color, other._color))
        };
        Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
        Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
        Cesium.Material.PolylineTrailLinkImage = data.flowImage;//图片
        Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                       {\n\
                                                            czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                            vec2 st = materialInput.st;\n\
                                                            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                            material.alpha = colorImage.a * color.a;\n\
                                                            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                            return material;\n\
                                                        }";
// material.alpha:透明度;material.diffuse：颜色;
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
            fabric: {
                type: Cesium.Material.PolylineTrailLinkType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: Cesium.Material.PolylineTrailLinkImage,
                    time: 0
                },
                source: Cesium.Material.PolylineTrailLinkSource
            },
            translucent: function (material) {
                return true;
            }
        })
    }
//抛物线方程
    function parabolaEquation(options, resultOut) {
        //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
        const h = options.height && options.height > 5000 ? options.height : 5000;
        const L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
        const num = options.num && options.num > 50 ? options.num : 50;
        const result = [];
        let dlt = L / num;
        if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
            const delLat = (options.pt2.lat - options.pt1.lat) / num;
            if (options.pt1.lon - options.pt2.lon > 0) {
                dlt = -dlt;
            }
            for (let i = 0; i < num; i++) {
                const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                const lon = options.pt1.lon + dlt * i;
                const lat = options.pt1.lat + delLat * i;
                result.push([lon, lat, tempH]);
            }
        } else {//以lat为基准
            let delLon = (options.pt2.lon - options.pt1.lon) / num;
            if (options.pt1.lat - options.pt2.lat > 0) {
                dlt = -dlt;
            }
            for (let i = 0; i < num; i++) {
                const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                const lon = options.pt1.lon + delLon * i;
                const lat = options.pt1.lat + dlt * i;
                result.push([lon, lat, tempH]);
            }
        }
        if (resultOut !== U) {
            resultOut = result;
        }
        // 落地
        result.push([options.pt2.lon,options.pt2.lat,options.pt2.height || 0])
        return result;
    }
    /**
     * 折线
     * @param data
     */
    YsCesium.prototype.addPolyline = function(data) {
        if(data.flowing){
            initPolylineTrailLinkMaterialProperty(data)
            data.options.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(data.options.polyline.material,data.options.polyline.interval);
        }
        this.viewer.entities.add(data.options)
    }
    /**
     * 抛物线
     * @param data
     */
    YsCesium.prototype.addParabola = function(data) {
        let center = data.center;//起始点
        let cities = data.points;//可以为多组哦！
        if(data.flowing){
            initPolylineTrailLinkMaterialProperty(data);
            data.options.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(data.options.polyline.material,data.options.polyline.interval);
        }
        for (let j = 0; j < cities.length; j++) {
            let points = parabolaEquation({ pt1: center, pt2: cities[j], height: data.height, num: 100 });
            let pointArr = [];
            for (let i = 0; i < points.length; i++) {
                pointArr.push(points[i][0],points[i][1],points[i][2]);
            }
            data.options.polyline.positions=Cesium.Cartesian3.fromDegreesArrayHeights(pointArr)
            this.viewer.entities.add(data.options);
        }
    }
    /**
     * 墙体
     * @param data
     */
    YsCesium.prototype.addWall = function(data) {
        if(data.flowing){
            initPolylineTrailLinkMaterialProperty(data)
            data.options.wall.material = new Cesium.PolylineTrailLinkMaterialProperty(data.options.wall.material,data.options.wall.interval);
        }
        this.viewer.entities.add(data.options)
    }
    /**
     * 添加飞线和点
     * @param data
     * @param callback
     * */
    YsCesium.prototype.addFlyLinesAndPoints = function(data,callback) {
        const viewer = this.viewer
        viewer.scene.globe.depthTestAgainstTerrain =false; // 设置该属性为true之后，标绘将位于地形的顶部；如果设为false（默认值），那么标绘将位于平面上。缺陷：开启该属性有可能在切换图层时会引发标绘消失的bug。
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //取消双击事件 ，双击的话，会视角直接切到该实体，且无法拖拽

        //创建线
        this.addParabola(data)
        //创建点
        const center = data.center;
        const cities = data.points;
        /*   ***********  这个可以修改成其他实体  *********** **/
        //中心点
        viewer.entities.add({
            id:center.id,
            position: Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 0),
            point: {
                pixelSize: center.size,
                color: center.color,
            }
        });
        //散点
        for (let i = 0; i < cities.length; i++) {
            viewer.entities.add({
                id: cities[i].id,
                position: Cesium.Cartesian3.fromDegrees(cities[i].lon, cities[i].lat, 1),
                point: {
                    pixelSize: cities[i].size,
                    color:cities[i].color
                }
            });
        }
        /*   ***********  这个可以修改成其他实体  *********** **/
        this.handleEvent('LEFT_CLICK',callback)
    }
    /**
     * 鼠标事件监听
     * @param name
     * @param callback
     */
    YsCesium.prototype.handleEvent = function(name,callback) {
        if(callback && typeof callback === 'function'){
            const viewer = this.viewer
            new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas).setInputAction(function (e) {
                const obj = viewer.scene.pick(e.position);
                if (Cesium.defined(obj)) {
                    if(obj.id._name !== "yscNoNeedEntity"){
                        callback(obj.id._id)
                    }
                }
            },Cesium.ScreenSpaceEventType[name])
        }
    }
    /**
     * 通过czml添加飞行线
     * @param data
     * @returns {Array}
     */
    YsCesium.prototype.addFlyLinesByCZML = function (data) {
        const viewer = this.viewer
        viewer.shouldAnimate = true
        const center = data.center,cities = data.points;
        const dsArr=[];
        for (let j = 0; j < cities.length; j++) {
            const czml =[
                {
                    "id" : "document",
                    "name" : "CZML Path",
                    "version" : "1.0",
                    "clock": { //定时
                        "interval": "2019-05-27T10:00:00Z/2019-05-27T10:16:50Z", // 990/60=16.5
                        "currentTime": "2019-05-27T10:00:00Z",//当前时间
                        "multiplier": data.multiplier //动画的速度倍数
                    }
                },
                {
                    "id" : "path",
                    "name" : "path with GPS flight data",
                    "description" : "<p>Hang gliding flight log data from Daniel H. Friedman.<br>Icon created by Larisa Skosyrska from the Noun Project</p>",
                    "availability" : "2019-05-27T10:00:00Z/2019-05-27T10:16:50Z",
                    "path" : {
                        "material" : { //线的材质
                            "polylineOutline" : {
                                "color" : {
                                    "rgba" : data.lineColor
                                },
                                "outlineColor" : {
                                    "rgba" : [0, 0, 0, 0]
                                },
                                "outlineWidth" : 0
                            }
                        },//路线的材质
                        "width" : 2, //线的宽度
                        "leadTime" :990,
                        "trailTime" : 990,
                        "resolution" : 5 //分辨率
                    },
                    "billboard" : { //加billboard 也可以加载其他entity cesium会自己解析
                        "image":data.image,
                        "scale": 0.5,
                        "eyeOffset": {
                            "cartesian": [ 0.0, 0.0, -10.0]
                        }
                    },
                    "position" : {
                        "epoch" : "2019-05-27T10:00:00Z",//动画起始时间
                        "cartographicDegrees" :[],
                    }
                }];
            const points = parabolaEquation({ pt1: center, pt2: cities[j],height:data.height,num: 100 });//100个点
            const pointArr =[];
            for (let i = 0;i < points.length; i++) {
                pointArr.push(i*10,points[i][0],points[i][1],points[i][2]);//0+i*10;表示距离
            }
            czml[1].position.cartographicDegrees=pointArr;
            if(cities[j].image){
                czml[1].billboard.image=cities[j].image;
            }
            viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function(ds) {
                dsArr.push(ds);
            });
        }

        return dsArr;
    }

    /**
     * 添加css3 html元素
     * @param elements
     * @param isBackHide
     * @constructor
     */
    YsCesium.prototype.Css3Renderer = function(elements,isBackHide) {
        const scratch = new Cesium.Cartesian2()
        const scene =  app.viewer.scene
        const camera = app.viewer.camera
        const that = this
        that.app = app
        that.container = null
        that.elements = elements
        that.isBackHide =  isBackHide
        this.__proto__.init = function () {
            const container = D.createElement('div')
            container.className = `ys-css3-container`
            D.body.appendChild(container)
            that.container = container
            that.elements.forEach(e => {
                container.insertAdjacentHTML('beforeend', e.element);
            })
            scene.preRender.addEventListener(function() {
                for (let i = 0; i < container.children.length; i++) {
                    const p = Cesium.Cartesian3.fromDegrees(that.elements[i].position[0],that.elements[i].position[1], that.elements[i].position[2] || 0)
                    const canvasPosition = scene.cartesianToCanvasCoordinates(p, scratch)
                    if (Cesium.defined(canvasPosition)) {
                        container.children[i].style.left = parseFloat(canvasPosition.x) + parseFloat( that.elements[i].offset[0]) + 'px'
                        container.children[i].style.top =  parseFloat(canvasPosition.y) +  parseFloat( that.elements[i].offset[1]) + 'px'
                        if(that.isBackHide){
                            let j = camera.position, n = scene.globe.ellipsoid.cartesianToCartographic(j).height;
                            if (!(n += 1 * scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(j, p) > n)) {
                                container.children[i].style.display = 'block'
                            } else {
                                container.children[i].style.display = 'none'
                            }
                        }
                    }
                }
            })
        }
        this.__proto__.remove = function (id) {
            that.elements = that.elements.filter(e => e.id !== id )
            that.container.removeChild(D.getElementById(id))
        }
        this.__proto__.append = function (object) {
            that.elements.push(object)
            that.container.insertAdjacentHTML('beforeend', object.element)
        }
        this.__proto__.removeEntityLayer = function (id) {
            that.app.viewer.entities.removeById(id+"_1")
            that.app.viewer.entities.removeById(id+"_2")
            that.app.viewer.entities.removeById(id+"_3")
            that.remove(id)
        }
        this.__proto__.addEntityLayer = function (object) {
            let lon = object.position[0],
                lat = object.position[1],
                sStartFlog = false,
                that = this,
                s1 = 0.001,
                s2 = s1,
                s3 = s1,
                s4 = s1
            setTimeout(() => sStartFlog = true,300)
            let rotation = Cesium.Math.toRadians(30);
            let rotation2 = Cesium.Math.toRadians(30);

            //构建entity
            let height = object.boxHeight,heightMax = object.boxHeightMax,heightDif = object.boxHeightDif;
            let goflog = true
            //添加正方体
            that.app.viewer.entities.add({
                id: object.id + "_1",
                name: "立方体盒子",
                position: new Cesium.CallbackProperty(function () {
                    height = height + heightDif;
                    if(height >= heightMax){
                        height = heightMax
                    }
                    return Cesium.Cartesian3.fromDegrees(lon,lat,height/2)
                },false),
                box: {
                    dimensions:  new Cesium.CallbackProperty(function () {
                        height = height + heightDif
                        if(height >= heightMax){
                            height = heightMax
                            if( goflog ){ //需要增加判断 不然它会一直执行; 导致对div的dom操作 会一直重复
                                goflog = false
                                that.append(object,true)
                            }
                        }
                        return  new Cesium.Cartesian3(object.boxSide,object.boxSide, height)
                    },false),
                    material: object.boxMaterial
                }
            });
            //添加底座一 外环
            viewer.entities.add({
                id: object.id+"_2",
                name: "椭圆",
                position:  Cesium.Cartesian3.fromDegrees(lon,lat),
                ellipse: {
                    // semiMinorAxis : object.circleSize, //直接这个大小 会有一个闪白的材质 因为cesium材质默认是白色 所以我们先将大小设置为0
                    // semiMajorAxis : object.circleSize,
                    semiMinorAxis:new Cesium.CallbackProperty(function () {
                        if(sStartFlog){
                            s1 = s1 + object.circleSize / 20;
                            if(s1 >= object.circleSize){
                                s1 = object.circleSize;
                            }
                        }
                        return s1;
                    },false),
                    semiMajorAxis:new Cesium.CallbackProperty(function () {
                        if(sStartFlog) {
                            s2 = s2 + object.circleSize / 20;
                            if (s2 >= object.circleSize) {
                                s2 = object.circleSize
                            }
                        }
                        return s2;
                    },false),
                    material: "../../plugins/ysCesium/images/circle2.png",
                    rotation: new Cesium.CallbackProperty(function () {
                        rotation += 0.05;
                        return rotation;
                    }, false),
                    stRotation: new Cesium.CallbackProperty(function () {
                        rotation += 0.05;
                        return rotation;
                    }, false),
                    zIndex: 2,
                }
            });
            //添加底座二 内环
            viewer.entities.add({
                id:object.id+"_3",
                name:"椭圆",
                position :  Cesium.Cartesian3.fromDegrees(lon,lat),
                ellipse : {
                    semiMinorAxis:new Cesium.CallbackProperty(function () {
                        if(sStartFlog){
                            s3=s3+object.circleSize/20;
                            if(s3>=object.circleSize/2){
                                s3=object.circleSize/2;
                            }}
                        return s3;
                    },false),
                    semiMajorAxis:new Cesium.CallbackProperty(function () {
                        if( sStartFlog ) {
                            s4 = s4 + object.circleSize / 20;
                            if (s4 >= object.circleSize / 2) {
                                s4 = object.circleSize / 2;
                            }
                        }
                        return s4;
                    },false),
                    material:"../../plugins/ysCesium/images/circle1.png",
                    rotation: new Cesium.CallbackProperty(function () {
                        rotation2 -= 0.03
                        return rotation2
                    }, false),
                    stRotation: new Cesium.CallbackProperty(function () {
                        rotation2 -= 0.03
                        return rotation2
                    }, false),
                    zIndex: 3
                }
            })
        }
        this.init()
    }

    /**
     * 添加自定义灯光扫描;
     */
    /*
    * 求圆周上等分点的坐标
    * ox,oy为圆心坐标
    * r为半径
    * count为等分个数
    */
    function createLightScan_getCirclePoints(r, ox, oy, count){
        let point = []; //结果
        let radians = (Math.PI / 180) * Math.round(360 / count), //弧度
            i = 0;
        for(; i < count; i++){
            let x = ox + r * Math.sin(radians * i),
                y = oy + r * Math.cos(radians * i);
            point.unshift({x:x,y:y}); //为保持数据顺时针
        }
        return point
    }
//生成 entityCList面--形成圆锥
    function createLightScan_entityCList(viewer,point,data) {
        const lon = data.observer[0],lat= data.observer[1],h = data.observer[2];
        const entityCList=[];
        //创建 面
        for(let i=0;i<point.length;i++){
            let  hierarchy;
            if(i===(point.length-1)){
                hierarchy=new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                    [
                        lon,lat,h,
                        point[i].x,point[i].y,0,
                        point[0].x,point[0].y,0
                    ]))
            }else{
                hierarchy=new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                    [
                        lon,lat,h,
                        point[i].x,point[i].y,0,
                        point[i+1].x,point[i+1].y,0
                    ]))
            }

            const entityC = viewer.entities.add({
                name:"三角形",
                polygon : {
                    hierarchy:hierarchy,
                    outline : false,
                    perPositionHeight:true,//允许三角形使用点的高度
                    material :data.material
                }
            });
            entityCList.push(entityC);
        }

        return entityCList
    }
//改变每个面的位置
    function createLightScan_changeOnePosition(data,entity,arr){
        const positionList = data.positionList;
        let x,y,x0,y0,X0,Y0,n=0,a=0;//x代表差值 x0代表差值等分后的值，X0表示每次回调改变的值。a表示回调的循环窜次数，n表示扫描的坐标个数
        function f(i){
            x= positionList[i+1][0]-positionList[i][0];//差值
            y= positionList[i+1][1]-positionList[i][1];//差值
            x0=x/data.number;//将差值等分500份
            y0=y/data.number;
            a=0;
        }
        f(n);
        entity.polygon.hierarchy=new Cesium.CallbackProperty(function () { //回调函数
            if((Math.abs(X0)>=Math.abs(x))&&(Math.abs(Y0)>=Math.abs(y))){ //当等分差值大于等于差值的时候 就重新计算差值和等分差值  Math.abs
                n=n+1;
                if(n === positionList.length-1){
                    n=0;
                }
                arr[0]= arr[0]+X0;
                arr[1]= arr[1]+Y0;
                arr[2]= arr[2]+X0;
                arr[3]= arr[3]+Y0;
                f(n);//重新赋值 x y x0 y0
            }
            X0=a*x0;//将差值的等份逐渐递增。直到大于差值 会有精度丢失,所以扩大再加 x0=x0+0.0001
            Y0=a*y0;//将差值的等份逐渐递增。直到大于差值 会有精度丢失,所以扩大再加
            a++;
            return  new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                [
                    data.observer[0],data.observer[1],data.observer[2],
                    arr[0]+X0,arr[1]+Y0,0,
                    arr[2]+X0,arr[3]+Y0,0
                ]))
        },false)
    }
//主函数 灯光随着打点坐标变化
    YsCesium.prototype.addLightScan = function(data){
        //生成分割点
        const point = createLightScan_getCirclePoints(data.circle[0],data.circle[1],data.circle[2],data.circle[3]);
        //生成 entityCList 圆锥
        const entityCList = createLightScan_entityCList(this.viewer,point,data)
        for(let i=0;i<entityCList.length;i++){
            if(i!==entityCList.length-1){
                createLightScan_changeOnePosition(data,entityCList[i],[point[i].x, point[i].y, point[i+1].x, point[i+1].y]) //中间arr 代表的是点的坐标
            }else{
                createLightScan_changeOnePosition(data,entityCList[i],[point[i].x, point[i].y, point[0].x, point[0].y])
            }
        }
        return entityCList
    }
//主函数  灯光随着模型变化
    YsCesium.prototype.addLightScanFollowEntity = function(data,model){
        //生成分割点
        const point = createLightScan_getCirclePoints(data.circle[0],data.circle[1],data.circle[2],data.circle[3]);
        //生成 entityCList 圆锥
        const entityCList = createLightScan_entityCList(this.viewer,point,data);

        // 实时获取模型的经纬度。
        this.viewer.scene.postRender.addEventListener(function () {
            const center = model.position.getValue(viewer.clock.currentTime);//获取模型当前位置 //世界坐标（笛卡尔坐标）
            if(center){
                const ellipsoid = viewer.scene.globe.ellipsoid;
                const cartographic = ellipsoid.cartesianToCartographic(center);
                const lon = Cesium.Math.toDegrees(cartographic.longitude);
                const lat = Cesium.Math.toDegrees(cartographic.latitude);
                //const height=cartographic.height;
                //console.log(lon+";"+lat+";"+height);
                const X0=lon-data.circle[1],Y0=lat-data.circle[2]; //差值
                for(let i=0;i<entityCList.length;i++){
                    if(i===(entityCList.length-1)){
                        f(entityCList[i],[point[i].x, point[i].y, point[0].x, point[0].y],X0,Y0);
                    }else{
                        f(entityCList[i],[point[i].x, point[i].y, point[i+1].x, point[i+1].y],X0,Y0);
                    }
                }
            }
        });
        //修改每一个entity
        function f(entity,arr,X0,Y0) {
            entity.polygon.hierarchy = new Cesium.CallbackProperty(function () { //回调函数
                return  new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                    [
                        data.observer[0],data.observer[1],data.observer[2],//观察点
                        arr[0]+X0,arr[1]+Y0,0,
                        arr[2]+X0,arr[3]+Y0,0
                    ]))
            },false)
        }
        return entityCList
    }
    /** 结合echarts*/
    YsCesium.prototype.combineEcharts = function (option) {
        //结合echarts
        (function(e) {
            const t = {};
            function n(r) {
                if (t[r]) return t[r].exports;
                const i = t[r] = {
                    i: r,
                    l: !1,
                    exports: {}
                };
                return e[r].call(i.exports, i, i.exports, n),
                    i.l = !0,
                    i.exports
            }
            n.m = e,
                n.c = t,
                n.d = function(e, t, r) {
                    n.o(e, t) || Object.defineProperty(e, t, {
                        enumerable: !0,
                        get: r
                    })
                },
                n.r = function(e) {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module"
                    }),
                        Object.defineProperty(e, "__esModule", {
                            value: !0
                        })
                },
                n.t = function(e, t) {
                    if (1 & t && (e = n(e)), 8 & t) return e;
                    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
                    const r = Object.create(null);
                    if (n.r(r), Object.defineProperty(r, "default", {
                        enumerable: !0,
                        value: e
                    }), 2 & t && "string" != typeof e) for (let i in e) n.d(r, i,
                        function(t) {
                            return e[t]
                        }.bind(null, i));
                    return r
                },
                n.n = function(e) {
                    let t = e && e.__esModule ?
                        function() {
                            return e.
                                default
                        }:
                        function() {
                            return e
                        };
                    return n.d(t, "a", t),
                        t
                },
                n.o = function(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t)
                },
                n.p = "",
                n(n.s = 0)
        })([function(e, t, n){e.exports = n(1)},function(e, t, n) {
            echarts ? n(2).load() : console.error("missing echarts lib")
        },function(e, t, n) {
            "use strict";
            function r(e, t) {
                for (let n = 0; n < t.length; n++) {
                    let r = t[n];
                    r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                    "value" in r && (r.writable = !0),
                        Object.defineProperty(e, r.key, r)
                }
            }
            n.r(t);
            let i = function() {
                function e(t, n) { !
                    function(e, t) {
                        if (! (e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    } (this, e),
                    this._viewer = t,
                    this.dimensions = ["lng", "lat"],
                    this._mapOffset = [0, 0],
                    this._api = n
                }
                let t, n, i;
                return t = e,
                    i = [{
                        key: "create",
                        value: function(t, n) {
                            let r;
                            t.eachComponent("GLMap",
                                function(t) { (r = new e(echarts.cesiumViewer, n)).setMapOffset(t.__mapOffset || [0, 0]),
                                    t.coordinateSystem = r
                                }),
                                t.eachSeries(function(e) {
                                    "GLMap" === e.get("coordinateSystem") && (e.coordinateSystem = r)
                                })
                        }
                    },
                        {
                            key: "dimensions",
                            get: function() {
                                return ["lng", "lat"]
                            }
                        }],
                (n = [{
                    key: "setMapOffset",
                    value: function(e) {
                        return this._mapOffset = e,
                            this
                    }
                },
                    {
                        key: "getViewer",
                        value: function() {
                            return this._viewer
                        }
                    },
                    {
                        key: "dataToPoint",
                        value: function(e) {
                            let t = this._viewer.scene,
                                n = [0, 0],
                                r = Cesium.Cartesian3.fromDegrees(e[0], e[1]);
                            if (!r) return n;
                            if (t.mode === Cesium.SceneMode.SCENE3D && Cesium.Cartesian3.angleBetween(t.camera.position, r) > Cesium.Math.toRadians(80)) return ! 1;
                            let i = t.cartesianToCanvasCoordinates(r);
                            return i ? [i.x - this._mapOffset[0], i.y - this._mapOffset[1]] : n
                        }
                    },
                    {
                        key: "pointToData",
                        value: function(e) {
                            let t = this._mapOffset,
                                n = viewer.scene.globe.ellipsoid,
                                r = new Cesium.cartesian3(e[1] + t, e[2] + t[2], 0),
                                i = n.cartesianToCartographic(r);
                            return [i.lng, i.lat]
                        }
                    },
                    {
                        key: "getViewRect",
                        value: function() {
                            let e = this._api;
                            return new echarts.graphic.BoundingRect(0, 0, e.getWidth(), e.getHeight())
                        }
                    },
                    {
                        key: "getRoamTransform",
                        value: function() {
                            return echarts.matrix.create()
                        }
                    }]) && r(t.prototype, n),
                i && r(t, i),
                    e
            } ();
            echarts.extendComponentModel({
                type: "GLMap",
                getViewer: function() {
                    return echarts.cesiumViewer
                },
                defaultOption: {
                    roam: !1
                }
            }),
                echarts.extendComponentView({
                    type: "GLMap",
                    init: function(e, t) {
                        this.api = t,
                            echarts.cesiumViewer.scene.postRender.addEventListener(this.moveHandler, this)
                    },
                    moveHandler: function(e, t) {
                        this.api.dispatchAction({
                            type: "GLMapRoam"
                        })
                    },
                    render: function(e, t, n) {},
                    dispose: function(e) {
                        echarts.cesiumViewer.scene.postRender.removeEventListener(this.moveHandler, this)
                    }
                });
            function a() {
                echarts.registerCoordinateSystem("GLMap", i),
                    echarts.registerAction({
                            type: "GLMapRoam",
                            event: "GLMapRoam",
                            update: "updateLayout"
                        },
                        function(e, t) {})
            }
            n.d(t, "load",
                function() {
                    return a
                })
        }])
        //开始
        echarts.cesiumViewer = this.viewer
        function YsCesiumEcharts(t, e) {
            this._mapContainer = t;
            this._overlay = this._createChartOverlay()
            this._overlay.setOption(e)
        }
        YsCesiumEcharts.prototype._createChartOverlay = function() {
            const t = this._mapContainer.scene;
            t.canvas.setAttribute('tabIndex', 0);
            const e = D.createElement('div');
            e.style.position = 'absolute';
            e.style.top = '0px';
            e.style.left = '0px';
            e.style.width = t.canvas.width + 'px';
            e.style.height = t.canvas.height + 'px';
            e.style.pointerEvents = 'none';
            const l = D.getElementsByClassName('echartMap').length
            e.setAttribute('id','ysCesium-echarts-'+parseInt(Math.random()*99999)+'-'+l)
            e.setAttribute('class', 'echartMap');
            this._mapContainer.container.appendChild(e);
            this._echartsContainer = e
            return echarts.init(e)
        }
        YsCesiumEcharts.prototype.dispose = function() {
            this._echartsContainer && (this._mapContainer.container.removeChild(this._echartsContainer), (this._echartsContainer = null)), this._overlay && (this._overlay.dispose(), (this._overlay = null))
        }
        YsCesiumEcharts.prototype.updateOverlay = function(t) {
            this._overlay && this._overlay.setOption(t)
        }
        YsCesiumEcharts.prototype.getMap = function() {
            return this._mapContainer
        }
        YsCesiumEcharts.prototype.getOverlay = function() {
            return this._overlay}

        YsCesiumEcharts.prototype.show = function() {
            D.getElementById(this._id).style.visibility = 'visible'
        }
        YsCesiumEcharts.prototype.hide = function() {
            D.getElementById(this._id).style.visibility = 'hidden'
        }

        new YsCesiumEcharts(this.viewer,option)
    }
    return YsCesium
})(window,document,undefined)

window.YsCesium = YsCesium
// export default YsCesium

// 声明
console.log(['%c跃焱邵隼', '%c时间: 2020-05', '%c主页: www.wellyyss.cn', '%cQQ群: 169470811', '%c座右铭: typing code makes me happy 😊'].join('\n').toString(),
    `
            background:url(http://www.wellyyss.cn/images/logo.png) no-repeat left center;
            background-size:30px 40px;
            padding-left:40px;
            line-height:50px;
            font-size: 18px;
            font-weight:bold;
            color:#00D4FF
            `,
    `
            background:none;
            line-height:30px;
            font-size: 18px;
            font-weight:bold;
            color:#00D4FF
            `,
    `
             padding-left:40px;
            background:none;
            line-height:30px;
            font-size: 18px;
            font-weight:bold;
            color:#00D4FF
            `,
    `
            background:none;
            line-height:30px;
            font-size: 18px;
            font-weight:bold;
            color:#00D4FF
            `,
    `
            padding-left:40px;
            background:none;
            line-height:30px;
            font-size: 18px;
            font-weight:bold;
            color:#00D4FF
            `
)
