import { findMovementToken, findVertexSnapPoint, getAltSnappingFlag, getEvenSnappingFlag } from './helpers.js'

//TODO rewrite this to only run my new stuff if needed
Ruler.prototype._addWaypoint = function(point) {
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
    	center[0] = newPoints.x;
    	center[1] = newPoints.y;
      
    }
  }
  this.waypoints.push(new PIXI.Point(center[0], center[1]));
  this.labels.addChild(new PIXI.Text("", CONFIG.canvasTextStyle));
}


//overwrite measure to recalculate the location that ruler is going to move the token to, handling alt snapping stuff
Ruler.prototype.measure = function(destination, {gridSpaces=true}={}) {
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

	//I'm annoyed because above was all that needed to change in the original method >_>

    const waypoints = this.waypoints.concat([destination]);
    const r = this.ruler;
    this.destination = destination;

    // Iterate over waypoints and construct segment rays
    const segments = [];
    for ( let [i, dest] of waypoints.slice(1).entries() ) {
      const origin = waypoints[i];
      const label = this.labels.children[i];
      const ray = new Ray(origin, dest);
      if ( ray.distance < 10 ) {
        if ( label ) label.visible = false;
        continue;
      }
      segments.push({ray, label});
    }

    // Compute measured distance
    const distances = canvas.grid.measureDistances(segments, {gridSpaces});
    let totalDistance = 0;
    for ( let [i, d] of distances.entries() ) {
      totalDistance += d;
      let s = segments[i];
      s.last = i === (segments.length - 1);
      s.distance = d;
      s.text = this._getSegmentLabel(d, totalDistance, s.last);
    }

    // Clear the grid highlight layer
    const hlt = canvas.grid.highlightLayers[this.name] || canvas.grid.addHighlightLayer(this.name);
    hlt.clear();

    // Draw measured path
    r.clear();
    for ( let s of segments ) {
      const {ray, label, text, last} = s;

      // Draw line segment
      r.lineStyle(6, 0x000000, 0.5).moveTo(ray.A.x, ray.A.y).lineTo(ray.B.x, ray.B.y)
       .lineStyle(4, this.color, 0.25).moveTo(ray.A.x, ray.A.y).lineTo(ray.B.x, ray.B.y);

      // Draw the distance label just after the endpoint of the segment
      if ( label ) {
        label.text = text;
        label.alpha = last ? 1.0 : 0.5;
        label.visible = true;
        let labelPosition = ray.project((ray.distance + 50) / ray.distance);
        label.position.set(labelPosition.x, labelPosition.y);
      }

      // Highlight grid positions
      this._highlightMeasurement(ray);
    }

    // Draw endpoints
    for ( let p of waypoints ) {
      r.lineStyle(2, 0x000000, 0.5).beginFill(this.color, 0.25).drawCircle(p.x, p.y, 8);
    }

    // Return the measured segments
    return segments;
  }

//cache the old move token function so we can run it if the token doesn't need alternative snapping logic
Ruler.prototype.moveTokenCached = Ruler.prototype.moveToken;
Ruler.prototype.moveToken = async function() {
    const token = this._getMovementToken();

    let altSnapping = getAltSnappingFlag(token)
    
    //if using alt snapping, just put the center of the token to the waypoint 
    if(token != undefined && altSnapping){
  		let wasPaused = game.paused;
  		if ( wasPaused && !game.user.isGM ) {
        ui.notifications.warn(game.i18n.localize("GAME.PausedWarning"));
        return false;
      }
  		if ( !this.visible || !this.destination ) return false;
  		const token = this._getMovementToken();
  		if ( !token ) return;
      // Get the movement rays and check collision along each Ray
      // These rays are center-to-center for the purposes of collision checking
    	const rays = this._getRaysFromWaypoints(this.waypoints, this.destination);

	    let hasCollision = rays.some(r => canvas.walls.checkCollision(r));
	    if ( hasCollision ) {
	      ui.notifications.error(game.i18n.localize("ERROR.TokenCollide"));
	      return;
	    }

	    // Execute the movement path.
	    // Transform each center-to-center ray into a top-left to top-left ray using the prior token offsets.
	    this._state = Ruler.STATES.MOVING;
	    token._noAnimate = true;
	    for ( let r of rays ) {
			if ( !wasPaused && game.paused ) break;
			let offset = {
		    	x: (token.w) / 2,
				  y: (token.h) / 2
		    }
			const path = new Ray({x: token.x, y: token.y}, {x: (r.B.x - offset.x) , y: (r.B.y - offset.y)});

			await token.update(path.B);
			await token.animateMovement(path);
	    }
	    token._noAnimate = false;

	    // Once all animations are complete we can clear the ruler
	    this._endMeasurement();
    }
    else{
    	return this.moveTokenCached();
    }
  }
