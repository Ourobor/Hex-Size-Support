import { findNearestVertex } from './helpers.js'

//we intercept refresh method(questionably) to set the pivot of the token correctly
Token.prototype.refresh = (function () {
	const cached = Token.prototype.refresh;
	return function () {
		if(this.getFlag("hex-size-support","evenSnap") == true){
			this.icon.pivot.y = -(canvas.grid.grid.h * 0.125 * 2);
		}
		const p = cached.apply(this, arguments);
		return p;
	};
})();

//overwrite the left click drop handling to snap the token correctly when you release dragging the token
Token.prototype._cachedonDragLeftDrop = Token.prototype._onDragLeftDrop;
Token.prototype._onDragLeftDrop = function(event) {
	let altSnapping = this.getFlag("hex-size-support", "altSnapping");
	if(altSnapping == true){
		const clones = event.data.clones || [];
	    const {originalEvent, destination} = event.data;

	    // Ensure the destination is within bounds
	    if ( !canvas.grid.hitArea.contains(destination.x, destination.y) ) return false;

	    // Compute the final dropped positions
	    const updates = clones.reduce((updates, c) => {

	      // Get the snapped top-left coordinate
	      let dest = {x: c.data.x, y: c.data.y};

	      if (!originalEvent.shiftKey) {
	      	let evenSnapping = this.getFlag("hex-size-support", "evenSnap");
	      	if(evenSnapping == false){
	      		dest = this.oddSnap(dest);
	      	}
	      	else{
	      		dest = this.evenSnap(dest);
	      	}
	      }

	      // Test collision for each moved token vs the central point of it's destination space
	      if ( !game.user.isGM ) {
	        let target = c.getCenter(dest.x, dest.y);
	        let collides = c.checkCollision(target);
	        if ( collides ) {
	          ui.notifications.error(game.i18n.localize("ERROR.TokenCollide"));
	          return updates
	        }
	      }

	      // Perform updates where no collision occurs
	      updates.push({_id: c._original.id, x: dest.x, y: dest.y});
	      return updates;
	    }, []);
	    return canvas.scene.updateEmbeddedEntity(this.constructor.name, updates);
	}
	else {
		this._cachedonDragLeftDrop(event);
	}
}

//given a coordinate, returns the closest valid snap point for odd type snapping
Token.prototype.oddSnap = function(dest){
    //offset values for the center of the tile
    //ex, top left + offset.x is the x coordinate of the center of the token
    let offset = {
    	x: (this.w) / 2,
		y: (this.h) / 2
    }

    //get coordinates of the center snap point
    let center = canvas.grid.getCenter(dest.x + offset.x, dest.y + offset.y);

    //set the pivot to zero to ensure that pivot is changed correctly if a token is changed from
    //even snapping to odd snapping
	this.icon.pivot.y = 0;

    //remove the offset from the newly discovered true center and store
    return {
    	x: center[0] - offset.x,
    	y: center[1] - offset.y
    }
}

//given a coordinate, returns the closest valid snap point for even type snapping
Token.prototype.evenSnap = function(dest){
    //offset values for the center of the tile
    //ex, top left + offset.x is the x coordinate of the center of the token
    let offset = {
    	x: (this.w) / 2,
		y: (this.h) / 2
    }

    let tokenCenter = {
    	x: dest.x + offset.x,
    	y: dest.y + offset.y
    }
	let snappedCenter = {x: 0, y: 0};
    //get coordinates of the center snap point
    [snappedCenter.x, snappedCenter.y] = canvas.grid.getCenter(tokenCenter.x, tokenCenter.y);

    let vertexOffset = findNearestVertex(snappedCenter, tokenCenter);

    //set the pivot here in addition to when the canvas is rendered
    //this is to ensure the pivot change happens after a token is changed and moved
    this.icon.pivot.y = -(canvas.grid.grid.h * 0.125 * 2);
    //remove the offset from the newly discovered true center and store
    return {
    	x: snappedCenter.x - offset.x + vertexOffset.x,
    	y: snappedCenter.y - offset.y + vertexOffset.y //+ (canvas.grid.grid.h * 0.125)
    }
}

//Handle dealing with shifting a token, this fixes issues with using arrow keys
Token.prototype._getShiftedPositionCached = Token.prototype._getShiftedPosition;
Token.prototype._getShiftedPosition = function(dx, dy){
	//run original code if no flag for alt-snapping
	if(!this.getFlag("hex-size-support", "altSnapping") == true){
		return this._getShiftedPositionCached(dx,dy);
	}
	else{
		console.log(dx, dy)
		let columns = canvas.grid.grid.columns;
		let [row, col] = canvas.grid.grid.getGridPositionFromPixels(this.x, this.y);

		let x = this.x;
		let y = this.y;

		if(columns != true){
			if(this.getFlag("hex-size-support","evenSnap")){
				dy += Math.sign(dy) * -0.4;
				dx += Math.sign(dx) * -0.5;
			}
			else{
				//handle the zigzag for columns
				//we only need to offset the tile if we're changing y and the number of tiles is odd
				if(dy != 0 && dy % 2 != 0){
					//reduce the magnitude of dy by 0.5 to offset the change in dx
					if(dy > 0){
						dy -= 0.5
					}
					else if(dy > 0){
						dy += 0.5
					}
					//if we're in an even column, zig to the left
					if(col % 2 == 0){
						dx -= 0.5;
					}
					//otherwise zag to the right
					else if(col % 2 != 0){
						dx += 0.5;
					}
				}
			}
		}
		else{
			if(this.getFlag("hex-size-support","evenSnap")){
				dy += Math.sign(dy) * -0.5;
				dx += Math.sign(dx) * -0.4;
			}
			else{
				//handle the zigzag for columns
				//we only need to offset the tile if we're changing y and the number of tiles is odd
				if(dx != 0 && dx % 2 != 0){

					//reduce the magnitude of dy by 0.5 to offset the change in dx
					if(dx > 0){
						dx -= 0.5
					}
					else if(dx > 0){
						dx += 0.5
					}

					//if we're in an even column, zig to the left
					if(row % 2 == 0){
						dy -= 0.5;
					}
					//otherwise zag to the right
					else if(row % 2 != 0){
						dy += 0.5;
					}
				}
			}
		}

		x += dx * canvas.grid.grid.w
		y += dy * canvas.grid.grid.h
			
		let dest = {x:x, y:y}

	    let targetCenter = this.getCenter(dest.x, dest.y);
	    let collide = this.checkCollision(targetCenter);

	    let evenSnapping = this.getFlag("hex-size-support", "evenSnap");
      	if(evenSnapping == false){
      		dest = this.oddSnap(dest);
      	}
      	else{
      		dest = this.evenSnap(dest);
      	}
	    return collide ? {x: this.data.x, y: this.data.y} : {x: dest.x, y: dest.y};
	}
}
