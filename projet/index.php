<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<head>
  <title>Nord-Pas-De-Calais</title>
  <script type="text/javascript" src="cesium/Build/Cesium/Cesium.js"></script>
  <script type="text/javascript" src="js/script.php"></script>
  <link rel="stylesheet" type="text/css" href="css/style.css"/>
  <link rel="stylesheet" type="text/css" href="cesium/Source/Widgets/BaseLayerPicker/BaseLayerPicker.css"/>
  <style>
	@import url(cesium/Build/Cesium/Widgets/CesiumWidget/CesiumWidget.css);
	@import url(cesium/Build/Cesium/Widgets/widgets.css);
  </style>
</head>
<body onload="main()">
  <!-- CESIUM VIEW //-->
  <div id="cesiumContainer"></div>
  <!-- Display the popup -->
  <div class="popup" id="popup">
    <button class="button" onclick="Popup.close()">X</button>
    <div class="title" style="display:block" id="popupTitle"></div>
    <div id="popupText"></div>       
	<img id="popupImage0"/>   
  </div>
  <!-- Display the layers -->
  <div id="baseLayerPickerContainer"></div>
</body>
</html>