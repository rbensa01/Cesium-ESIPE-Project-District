var main = function() { //launched when the document is ready

    "use strict"; //use strict javascript    
    var viewer, imageryLayerCollection, baseLayer = [], scene, ellipsoid, cursor = "default", currentCountry, currentType = "indetermine", currentMapID = 2, points = [], oldPolygon=false, oldLabel=false;
	
	//Extent de zoom du démarrage de l'application
	var west = Cesium.Math.toRadians(+1.5);
	var south = Cesium.Math.toRadians(48.5);
	var east = Cesium.Math.toRadians(+3);
	var north = Cesium.Math.toRadians(52);

	var extent = new Cesium.Rectangle(west, south, east, north);

	
	//ImageryViewModels composé de 3 fonds de carte (OpenStreetMap, Bing et ArcGIS)
    var imageryViewModels = [];
    imageryViewModels.push(new Cesium.ProviderViewModel({
        name: 'Open\u00adStreet\u00adMap',
        iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
        creationFunction: function() {
            return new Cesium.OpenStreetMapImageryProvider({
                url: '//a.tile.openstreetmap.org/'
            });
        }
    }));

	imageryViewModels.push(new Cesium.ProviderViewModel({
		 name : 'Bing',
		 iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/bingRoads.png'),
		 creationFunction : function() {
			 return new Cesium.BingMapsImageryProvider({
                url : 'http://dev.virtualearth.net',
                key : 'AkIUJxcQSZHyyIEJBnabuzfqB7xAeiBz35KDGz-J5VoMu0wjPTx-4y9QlHldc08z',
                mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
            });
		 }
	 }));

	 imageryViewModels.push(new Cesium.ProviderViewModel({
		 name : 'ArcGIS',
		 iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/esriWorldStreetMap.png'),
		 creationFunction : function() {
			 return new Cesium.ArcGisMapServerImageryProvider({
                url : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
                proxy : new Cesium.DefaultProxy('proxy/index.php?url=')
            });
		 }
	 }));

    //Create a CesiumWidget without imagery, if you haven't already done so.
    var cesiumWidget = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: false,
        baseLayerPicker: false,
		homeButton: true,
		sceneModePicker : true,
		navigationHelpButton : false,
		geocoder : true
    });
	cesiumWidget.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo){
		//Zoom to custom extent
		cesiumWidget.scene.camera.flyToRectangle({
            destination: extent
        });
		//Tell the home button not to do anything.
		commandInfo.cancel = true;
	});
	
	//Finally, create the baseLayerPicker widget using our view models.
    var layers = cesiumWidget.scene.imageryLayers;


    var baseLayerPicker = new Cesium.BaseLayerPicker('baseLayerPickerContainer', {
        globe: cesiumWidget.scene, // Yep, this is right
        imageryProviderViewModels: imageryViewModels
    });

    //Use the first item in the list as the current selection.
    baseLayerPicker.viewModel.selectedItem = imageryViewModels[0];

    scene = cesiumWidget.scene;
    var primitives = scene.primitives;
    ellipsoid = scene.globe.ellipsoid;

    var labels = new Cesium.LabelCollection();
	
	//Fichier JSON contenant les données affichées sur notre carte
    var rawData = "data/limites_admin_11042013_npdc.json";

    lib_ajax.get(rawData, function(data) { //get DATA with ajax
		
        var objData = JSON.parse(data);
        var features = objData.features;
		
		//Parcours du fichier JSON contenant les données. Ensuite extraire les coordonnées en splitant par "," 
        features.map(function(feature, index) {

            var array = feature.geometry["coordinates"].join().split(",");
            array.map(function(a, i) {
                array[i] = parseFloat(a)
            });

            var positions = Cesium.Cartesian3.fromDegreesArray(array);

			
			var polygonInstance = new Cesium.GeometryInstance({
                geometry : Cesium.PolygonGeometry.fromPositions({
                    positions : positions,
                    extrudedHeight: 0,
                    vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                    perPositionHeight : true
                })
            });
			
			//Définition de la couleur des polygones de chaque commune
			var mat = new Cesium.Material.fromType('Color');
			mat.uniforms.color = new Cesium.Color(0.2,0.2,0.2,0.2);
			
			var primitive = new Cesium.Primitive({
                geometryInstances: [polygonInstance],
				appearance : new Cesium.MaterialAppearance({
					material : mat,
					faceForward : true
				}),
				interleave : true
            })

            // Add each polygon instance to primitives.
            var polygon = primitives.add(primitive);
			
			//We can click on this item
			polygon.pickable=true;
			//We define what happens when we click on
			polygon.onclick=function(direct){
			//highlight new polygon
                if (oldPolygon){
					oldPolygon._material.uniforms.color = new Cesium.Color(0.2,0.2,0.2,0.2);
				}
				polygon._material.uniforms.color = new Cesium.Color(0.9,0.9,0.9,0.2);
				oldPolygon=polygon; 
				
				}
			polygon.pointIndex = index;
        });

		//add picking event listener
        //handle mouse move
        var handlerMove = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handlerMove.setInputAction(function (movement) {
            var pickedObject = scene.pick(movement.endPosition);           
            var isPick=Cesium.defined(pickedObject);
            if (isPick) isPick=pickedObject.primitive;
            if (isPick) isPick=pickedObject.primitive.pickable;

            if (isPick) {
                if (cursor==="default"){
                    scene.canvas.style.cursor="pointer";
                    cursor="pointer";
                }
            } else {
                if (cursor==="pointer"){
                    scene.canvas.style.cursor="auto";
                    cursor="default";
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //Gestion d'un simple click pour afficher la Popup
        var handlerClick = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handlerClick.setInputAction(function (movement) {
            var pickedObject = scene.pick(movement.position);
            if (!Cesium.defined(pickedObject)) return;
            if (!pickedObject.primitive) return;
            if (!pickedObject.primitive.pickable) return;
            var feature=features[pickedObject.primitive.pointIndex];
			Popup.open(feature);
			if (pickedObject.primitive.onclick) pickedObject.primitive.onclick(true);
			
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		
		//Gestion de double click pour zoomer
		handlerClick.setInputAction(function (movement) {
            var pickedObject = scene.pick(movement.position);
            if (!Cesium.defined(pickedObject)) return;
            if (!pickedObject.primitive) return;
            if (!pickedObject.primitive.pickable) return;
            var feature=features[pickedObject.primitive.pointIndex];
			Popup.open(feature);
			if (pickedObject.primitive.onclick) pickedObject.primitive.onclick(true);
			var minLon = Number.MAX_VALUE;
			var maxLon = -Number.MAX_VALUE;
			var minLat = Number.MAX_VALUE;
			var maxLat = -Number.MAX_VALUE;
			for ( var i = 0, len = feature.geometry.coordinates[0].length; i < len; i++) {
				var position = feature.geometry.coordinates[0][i];
				minLon = Math.min(minLon, position[0]);
				maxLon = Math.max(maxLon, position[0]);
				minLat = Math.min(minLat, position[1]);
				maxLat = Math.max(maxLat, position[1]);
			}
			var extentFeature = Cesium.Rectangle.fromDegrees(minLon, minLat, maxLon, maxLat);
			scene.camera.flyToRectangle({
				destination: extentFeature
			});
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		
		//Pour se positionner au démarrage sur l'extent créée au debut
        scene.camera.flyToRectangle({
            destination: extent
        });
    }); //end of AJAX callback

};