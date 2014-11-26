/*
 * get google street view images from longitude and latitude
 * for more informations see https://developers.google.com/maps/documentation/streetview/
 */
var GoogleStreetView=(function() {
    var that={
        get_imageURL: function(name, theta) {
            return "http://maps.googleapis.com/maps/api/streetview?size="
            +SETTINGS.google.imageWidth+"x"+SETTINGS.google.imageHeight
            +"&location="+name+",FRANCE"
            +"&fov=120&heading="+theta+"&pitch=10&sensor=true";
        },
        set_image: function(name, id){
            document.getElementById(id+"0").src=that.get_imageURL(name, 0);
        }


    }
    return that;
})();