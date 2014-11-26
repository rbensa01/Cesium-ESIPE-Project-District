/*
 * SETTINGS of the application
 */
var SETTINGS={
    display1PointOn: 10,
    flyZ: 200000,

    polygon: {
        z:0,
        color: {red: 0.2, green: 0.2, blue: 0.2, alpha: 0.2},
        colorPicked: {red: 0.6, green: 0.6, blue: 0.6, alpha: 0.2}
    },

    outline:  {
        innerWidth: 1,
        outerWidth: 5
    },

    label: {
        font: '20px Helvetica',
        z: 30000,
        outlineWidth: 2,
        outlineColor: { red : 0.0, blue : 0.0, green : 0.0, alpha : 1.0 },
        fillColor: { red : 1.0, blue : 1.0, green : 1.0, alpha : 1.0 },
        pickedFillColor: { red : 0.5, blue : 1.0, green : 0.7, alpha : 1.0 },
    },

    nasaLayer: {
        alpha: 0.2,
        brightness: 2
    },

   google: {
       imageWidth: 400,
       imageHeight: 300
   }
};