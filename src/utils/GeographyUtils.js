/**
*@method getBoundingArea
*@param points - A list of LatLngLiterals
*@return [{south, north, east, west} | undefined] - A bounding box object.
*/
function getBoundingArea(points){
    var north, south, east, west;
    if(points && points.length>1){
        for(let point of points){
            if(!(north || south || east || west)){
                north = south = point.lat;
                east = west = point.lng;
            }
            
            if(point.lat < south) south = point.lat;
            if(point.lng < west) west = point.lng;

            if(point.lat > north) north = point.lat;
            if(point.lng > east) east = point.lng;

        }
        return {south, north, east, west};
    }
}
exports.getBoundingArea = getBoundingArea;