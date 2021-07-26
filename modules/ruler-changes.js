import { findMovementToken, findVertexSnapPoint, getAltSnappingFlag, getEvenSnappingFlag } from './helpers.js'

//TODO rewrite this to only run my new stuff if needed
HexSizeSupportAddWaypoint = function(wrapped, point) {
  // If not on a hex grid, can just return normally.
  // Otherwise, modify the waypoint and return
  if(canvas.grid.type === CONST.GRID_TYPES.HEXODDR || 
     canvas.grid.type === CONST.GRID_TYPES.HEXEVENR ||
     canvas.grid.type === CONST.GRID_TYPES.HEXODDQ ||
     canvas.grid.type === CONST.GRID_TYPES.HEXEVENQ) {
     
    let center = canvas.grid.getCenter(point.x, point.y);

    //retrieve the token this ruler is measure from if possible
    let token;
    if(this.waypoints.length == 0){
      token = findMovementToken(point.x,point.y);
    }
    else{
      token = findMovementToken(this.waypoints[0].x,this.waypoints[0].y);	
    }

    //if there is a token under the selected point, check for even/odd
    if(token != undefined){
      let evenSnapping = getEvenSnappingFlag(token)

      //if the even snapping flag is set, we need to offset the position of the first waypoint to a vertex
      if(evenSnapping){

        //get the new center location for the ruler
        let newPoints = findVertexSnapPoint(point.x, point.y, token, canvas.grid.grid)

        //update the center
        point.x = newPoints.x;
        point.y = newPoints.y
      }
    }
     
  } 

  return wrapped(point);
}


//overwrite measure to recalculate the location that ruler is going to move the token to, handling alt snapping stuff
HexSizeSupportMeasure = function(wrapped, destination, {gridSpaces=true}={}) {
  // If not on a hex grid, can just return normally.
  // Otherwise, modify the destination and return
  if(canvas.grid.type === CONST.GRID_TYPES.HEXODDR || 
     canvas.grid.type === CONST.GRID_TYPES.HEXEVENR ||
     canvas.grid.type === CONST.GRID_TYPES.HEXODDQ ||
     canvas.grid.type === CONST.GRID_TYPES.HEXEVENQ) {
     
    let token = findMovementToken(this.waypoints[0].x,this.waypoints[0].y);	
    let center = canvas.grid.getCenter(destination.x, destination.y);

    let evenSnapping;
    if(token != undefined){
      evenSnapping = getEvenSnappingFlag(token)
    }
    //determine if this is measuring from an even token; even tokens need to have their snapping points offset
    if(evenSnapping){

      let newPoints = findVertexSnapPoint(destination.x, destination.y, token, canvas.grid.grid)

      destination = new PIXI.Point(newPoints.x, newPoints.y);
    }
    else{
    	destination = new PIXI.Point(...canvas.grid.getCenter(destination.x, destination.y));
    }  
  }
  
  return wrapped(destination, {gridSpaces = gridSpaces});
}
  
/* Wrap the libRuler animateToken method
 * See libRuler scripts/ruler-move-token.js for specifics.
 * Here, just modifying the offset. 
 * @param {Token} token The token that is being animated.
 * @param {Ray} ray The ray indicating the segment that should be moved.
 * @param {number} dx Offset in x direction relative to the Token top-left.
 * @param {number} dy Offset in y direction relative to the Token top-left.
 * @param {integer} segment_num The segment number, where 1 is the
 */
HexSizeSupportAnimateToken = async function(wrapped, token, ray, dx, dy, segment_num) {
  // If not on a hex grid, can just return normally.
  // Otherwise, modify the waypoint and return
  const offset = {x: 0, y: 0};
  
  if(canvas.grid.type === CONST.GRID_TYPES.HEXODDR || 
     canvas.grid.type === CONST.GRID_TYPES.HEXEVENR ||
     canvas.grid.type === CONST.GRID_TYPES.HEXODDQ ||
     canvas.grid.type === CONST.GRID_TYPES.HEXEVENQ) {
     
     let altSnapping = getAltSnappingFlag(token)
     
     if(token != undefined && altSnapping){
       offset = {
		    	x: (token.w) / 2,
				  y: (token.h) / 2
		    }
     }  
  }
  
  return wrapped(token, ray, dx - offset.x, dy - offset.y, segment_num);
}