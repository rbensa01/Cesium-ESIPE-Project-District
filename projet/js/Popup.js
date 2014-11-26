/*
 * Popup.js
 * Open a popup with the feature of interest
 * Read the informations of this feature and add it in the popup
 */
var Popup=(function() {
    var pop;
    return  {
        /*
         * open : this  method create a popup and 
         * insert title, data and informations
         */
        open: function(feature){

            /* Get id of the popup and display */
            pop=document.getElementById("popup");
            pop.style.display="block";

            /* Get id of the title and insert the text
             * This test check if the Cavity name exist
             * and if this Cavity hasn't named, display the type
             */
            var title=document.getElementById("popupTitle");
            if(feature.properties["NOM"] == "?"){
                title.innerHTML=feature.properties["NOM"];
            }
            else if(feature.properties["NOM"] == ""){
                title.innerHTML=feature.properties["NOM"];
            }
            else{
                title.innerHTML=feature.properties["NOM"];
            }

            /* Get id of the title and insert Data and Informations of this Cavity*/
            var text=document.getElementById("popupText");
			var c = Popup.readData(feature);
            text.innerHTML="<div class=\"text\">"+
			"<p>Informations de la commune :</p>"+
			"<ul>"+c+"</ul></div>";
			
            //image
			GoogleStreetView.set_image(feature.properties["NOM"], "popupImage");
        },
        /*
         * readData : this method read the data about the feature and
         * create a string.
         */
        readData: function(feature){
            var contentHtml = "";
            /* Map of the several data contained by a feature*/
            var labels ={
                "NOM" : "Nom de la commune : ",
                "CODE_INSEE" : "Code INSEE : ",
                "AREA_HA" : "Superficie (Ha) : "
            };
			var properties = feature.properties;
            /* Loop to check all data of a feature*/
            for(var e in feature.properties) {
                if(labels[e] != undefined){
                    if(properties[e] != ""){
                        if(properties[e] != "?"){
                            /*Add the Data in the final string*/
                            contentHtml += "<li>"+labels[e]+properties[e]+"</li>";
                        }
                    }
                }
            }
            return contentHtml;
        },
        /*
         * close : this method permit to close the popup.
         */
        close: function() {
            pop.style.display="none";
        }
    }
})();