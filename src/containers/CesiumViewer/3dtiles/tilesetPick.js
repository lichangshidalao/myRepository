var silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
silhouetteBlue.uniforms.length = 0.01;
silhouetteBlue.selected = [];