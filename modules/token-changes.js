import { findVertexSnapPoint, getAltSnappingFlag, getEvenSnappingFlag, getAltOrientationFlag, getCenterOffset } from './helpers.js'
import { borderData } from './token-border-config.js'

//we intercept refresh method(questionably) to set the pivot of the token correctly
Token.prototype.refresh = (function () {
	const cached = Token.prototype.refresh;
	return function () {

		//handle rendering temporary pivots used by the config controller
		if(this.data.tempHexValues?.tempPivot != undefined){
			this.icon.pivot.y = this.data.tempHexValues.tempPivot.y || 0.0;
			this.icon.pivot.x = this.data.tempHexValues.tempPivot.x || 0.0;	
		}
		else{
			this.icon.pivot.y = this.document.getFlag("hex-size-support","pivoty") || 0.0;
			this.icon.pivot.x = this.document.getFlag("hex-size-support","pivotx") || 0.0;
		}

		//execute existing refresh function
		const p = cached.apply(this, arguments);

		//Now handle rewriting the border if needed

		//get the border size
		let borderSize = this.data?.tempHexValues?.borderSize || this.document.getFlag("hex-size-support", "borderSize");

		let alwaysShowBorder = this.document.getFlag("hex-size-support", "alwaysShowBorder")

		//handle rerendering the borders for custom border offsets and resizing
		if(alwaysShowBorder == true || (borderSize != undefined /*&& borderSize != 1*/)){
			let borderColor = this._getBorderColor();

			const gridW = canvas.grid.grid.w;
			const gridH = canvas.grid.grid.h;


			//override null if the border is always to be shown
			if(alwaysShowBorder == true && !borderColor){
				borderColor = 0x56a2d6
			}

			if(!!borderColor){
				let border = borderData.find(function(border){
					return border.key == borderSize;
				});

				if(border === undefined){
					return p
				}

				//remap the coordinates to the grid's width/height
				let xyPoints = border.border.map((p) => {
					if(canvas.grid.grid.columns != true){
			    		return [(gridW * p[0]), (gridH * p[1])];
			    	}
			    	else{
			    		return [(gridH * p[0]), (gridW * p[1])];
			    	}
			    });

				//is this grid using columns?
				let columns = canvas.grid.grid.columns;
				let alt = getAltOrientationFlag(this);

				let borderRotationOffset = 0;
				if(columns){
					borderRotationOffset -= 30;
				}
				if(alt){
					borderRotationOffset += 180;
				}

			    //rotate the coordinates
			    //this is required because the rotation attribute of the border only rotates the graphics, not the hit area
			    //and the hit area is only defined by a collection of points
			    const cosTheta = Math.cos((borderRotationOffset) * 0.0174533);
			    const sinTheta = Math.sin((borderRotationOffset) * 0.0174533);

			    let rotatedPoints = xyPoints.map( (point) => {
			    	let x = cosTheta * point[0] + (-1 * sinTheta * point[1])
			    	let y = sinTheta * point[0] + cosTheta*point[1]
			    	return [x,y]
			    })
			    
			    let shiftedPoints = rotatedPoints.map((point) => {
			    	const x = point[0] + border.width * gridW / 2
			    	const y = point[1] +  border.height * gridH / 2
			    	return [x,y]
			    	})

				this.hitArea = new PIXI.Polygon(shiftedPoints.flat())
				
				this.border.clear()
				this.border.lineStyle(4, 0x000000, 0.8).drawPolygon(shiftedPoints.flat());
				this.border.lineStyle(2, borderColor || 0xFF9829, 1.0).drawPolygon(shiftedPoints.flat());

				//Muck around with layering to get the border on top
				if(alwaysShowBorder){
					if(this.sortableChildren == false){
						this.sortableChildren = true;
					}
					this.border.zIndex = 10;
				}
			}
		}

		return p;
	};
})();

//overwrite the left click drop handling to snap the token correctly when you release dragging the token
Token.prototype._cachedonDragLeftDrop = Token.prototype._onDragLeftDrop;
Token.prototype._onDragLeftDrop = function(event) {

	let altSnapping = getAltSnappingFlag(this)

	if(altSnapping == true){
		const clones = event.data.clones || [];
	    const {originalEvent, destination} = event.data;
		const preview = game.settings.get("core", "tokenDragPreview");

	    // Ensure the destination is within bounds
	    if ( !canvas.grid.hitArea.contains(destination.x, destination.y) ) return false;

	    // Compute the final dropped positions
	    const updates = clones.reduce((updates, c) => {
	    	// Reset vision back to the initial location
			if ( preview )  c._original.updateSource({noUpdateFog: true});

	    	// Get the snapped top-left coordinate
	    	let dest = {x: c.data.x, y: c.data.y};

	    	//only enabling snapping when shift isn't held
	    	if (!originalEvent.shiftKey) {
		      	let evenSnapping = getEvenSnappingFlag(this);

		      	let offset = getCenterOffset(this)
		      	let snapPoint = {}
		      	if(evenSnapping == false){
				    //get coordinates of the center of the hex that this coordinate falls under
				    [snapPoint.x, snapPoint.y] = canvas.grid.getCenter(dest.x + offset.x, dest.y + offset.y);
		      	}
		      	else{  
		      		//get the coordinates of the closest vertex snap point valid for this token
					snapPoint = findVertexSnapPoint(dest.x + offset.x, dest.y + offset.y, this, canvas.grid.grid)
		      	}
		      	dest = {
				    x: snapPoint.x - offset.x,
				    y: snapPoint.y - offset.y
				}
	      	}

	      // Test collision for each moved token vs the central point of it's destination space
	      if ( !game.user.isGM ) {
	      	c._velocity = c._original._velocity;
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

//Handle dealing with shifting a token, this fixes issues with using arrow keys
Token.prototype._getShiftedPositionCached = Token.prototype._getShiftedPosition;
Token.prototype._getShiftedPosition = function(dx, dy){
	//conditionally lock out arrow key movement for a token
	if(this.data.tempHexValues?.locked == true){
		return {x: this.x, y:this.y}
	}

	let altSnapping = getAltSnappingFlag(this)

	//run original code if no flag for alt-snapping
	if(!altSnapping == true){
		return this._getShiftedPositionCached(dx,dy);
	}
	else{
		let columns = canvas.grid.grid.columns;
		let [row, col] = canvas.grid.grid.getGridPositionFromPixels(this.data.x, this.data.y);

		let x = this.x;
		let y = this.y;
		
		let evenSnapping = getEvenSnappingFlag(this)

		if(columns != true){
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

		x += dx * canvas.grid.grid.w
		y += dy * canvas.grid.grid.h
			
		let dest = {x:x, y:y}

	    let targetCenter = this.getCenter(dest.x, dest.y);
	    let collide = this.checkCollision(targetCenter);

		let offset = getCenterOffset(this)
      	let snapPoint = {}
      	if(evenSnapping == false){
		    //get coordinates of the center of the hex that this coordinate falls under
		    [snapPoint.x, snapPoint.y] = canvas.grid.getCenter(dest.x + offset.x, dest.y + offset.y);
      	}
      	else{  
      		//get the coordinates of the closest vertex snap point valid for this token
			snapPoint = findVertexSnapPoint(dest.x + offset.x, dest.y + offset.y, this, canvas.grid.grid)
      	}
      	dest = {
		    x: snapPoint.x - offset.x,
		    y: snapPoint.y - offset.y
		}

	    return collide ? {x: this.data.x, y: this.data.y} : {x: dest.x, y: dest.y};
	}
}
