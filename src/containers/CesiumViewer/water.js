import Cesium from "cesium/Cesium";
import water from "../img/water.png"
//degreesArrayHeights是一个组成多边形顶点数组[lon,lat,alt]
const CreateGeometry = (degreesArrayHeights, extrudedHeight) => {
    return new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights)),
        extrudedHeight: extrudedHeight ? extrudedHeight : 0,
        perPositionHeight: true
    });
}

const CreateAppearence = (fs, url) => {
    return new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
            fabric: {
                type: 'Water',
                uniforms: {
                    normalMap: url,
                    frequency: 1000.0,
                    animationSpeed: 0.05,
                    amplitude: 10.0
                }
            }
        }),
        fragmentShaderSource: fs
    });
}

function FSWaterFace() {
    return 'varying vec3 v_positionMC;\n\
            varying vec3 v_positionEC;\n\
            varying vec2 v_st;\n\
            \n\
            void main()\n\
            {\n\
            czm_materialInput materialInput;\n\
            vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
            #ifdef FACE_FORWARD\n\
            normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
            #endif\n\
            materialInput.s = v_st.s;\n\
            materialInput.st = v_st;\n\
            materialInput.str = vec3(v_st, 0.0);\n\
            materialInput.normalEC = normalEC;\n\
            materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
            vec3 positionToEyeEC = -v_positionEC;\n\
            materialInput.positionToEyeEC = positionToEyeEC;\n\
            czm_material material = czm_getMaterial(materialInput);\n\
            #ifdef FLAT\n\
            gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
            #else\n\
            gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n\
            gl_FragColor.a = 0.5;\n\
            #endif\n\
            }\n\
            ';
}



export { CreateGeometry, CreateAppearence, FSWaterFace }