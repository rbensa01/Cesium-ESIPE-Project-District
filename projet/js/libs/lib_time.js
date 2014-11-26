var lib_time={
    //convert a date from gpx format to a timestamp. ex : gpx=2009-05-04T23:13:43Z
    gpx2timestamp: function(gpx){
        var d = gpx.match(/\d+/g);
        return +new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
    }
}