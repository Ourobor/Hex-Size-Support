import { findVertexSnapPoint } from './helpers.js'

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
			this.icon.pivot.y = this.getFlag("hex-size-support","pivoty") || 0.0;
			this.icon.pivot.x = this.getFlag("hex-size-support","pivotx") || 0.0;
		}

		//execute existing refresh function
		const p = cached.apply(this, arguments);

		//Now handle rewriting the border if needed

		//get the border size
		let borderSize = this.data?.tempHexValues?.borderSize || this.getFlag("hex-size-support", "borderSize");

		let alwaysShowBorder = this.getFlag("hex-size-support", "alwaysShowBorder")

		//handle rerendering the borders for custom border offsets and resizing
		if(alwaysShowBorder == true || (borderSize != undefined && borderSize != 1)){
			let borderColor = this._getBorderColor();

			const gridW = canvas.grid.grid.w;
			const gridH = canvas.grid.grid.h;


			//override null if the border is always to be shown
			if(alwaysShowBorder == true && !borderColor){
				borderColor = 0x56a2d6
			}

			if(!!borderColor){
				const size2 = [
				[0.0, 1.0],
				[-0.5, 0.75],
				[-0.5, 0.25],
				[-1.0, 0.0],
				[-1.0, -0.5],
				[-0.5, -0.75],
				[0.0, -0.5],
				[0.5, -0.75],
				[1.0, -0.5],
				[1.0, 0.0],
				[0.5, 0.25],
				[0.5, 0.75],
				[0.0, 1.0]]

				const size3 = [
				[-1.5, -0.25],
				[-1.0, -0.5 ],
				[-1.0, -1.0 ],
				[-0.5, -1.25],
				[ 0.0, -1.0 ],
				[ 0.5, -1.25],
				[ 1.0, -1.0 ],
				[ 1.0, -0.5 ],
				[ 1.5, -0.25],
				[ 1.5,  0.25],
				[ 1.0,  0.5 ],
				[ 1.0,  1.0 ],
				[ 0.5,  1.25],
				[ 0.0,  1.0 ],
				[-0.5,  1.25],
				[-1.0,  1.0 ],
				[-1.0,  0.5 ],
				[-1.5,  0.25],
				[-1.5, -0.25]
				]

				const size4 = [
				[-2.0,  0.0 ],
				[-2.0, -0.5 ],
				[-1.5, -0.75],
				[-1.5, -1.25],
				[-1.0, -1.5 ],
				[-0.5, -1.25],
				[ 0.0, -1.5 ],
				[ 0.5, -1.25],
				[ 1.0, -1.5 ],
				[ 1.5, -1.25],
				[ 1.5, -0.75],
				[ 2.0, -0.5 ],
				[ 2.0,  0.0 ],//halfway
				[ 1.5,  0.25],
				[ 1.5,  0.75],
				[ 1.0,  1.0 ],
				[ 1.0,  1.5 ],
				[ 0.5,  1.75],
				[ 0.0,  1.5 ],
				[-0.5,  1.75],
				[-1.0,  1.5 ],
				[-1.0,  1.0 ],
				[-1.5,  0.75],
				[-1.5,  0.25],
				[-2.0,  0.0 ]
				]

				let height = 1.0;
				let width = 1.0;

				let points;

				if(borderSize == 2){
					height = 2.0 * gridH
 					width = 2.0 * gridW
					points = size2;
				}
				else if(borderSize == 3){
					height = 3 * gridH
 					width = 3 * gridW
					points = size3;
				}
				else if(borderSize == 4){
					height = 4 * gridH
 					width = 4 * gridW
					points = size4;
				}
				else{
					return p
				}

				//remap the coordinates to the grid's width/height
				let xyPoints = points.map((p) => {
					if(canvas.grid.grid.columns != true){
			    		return [(gridW * p[0]), (gridH * p[1])];
			    	}
			    	else{
			    		return [(gridH * p[0]), (gridW * p[1])];
			    	}
			    });

				let borderRotationOffset = this.getFlag('hex-size-support', 'borderRotationOffset') || 0.0;
				if(this.data.tempHexValues != undefined){
					if(this.data.tempHexValues.borderRotationOffset != undefined){
						borderRotationOffset = this.data.tempHexValues.borderRotationOffset
					}
				}

				//is this grid using columns?
				let columns = canvas.grid.grid.columns;
				let alt = this.getFlag('hex-size-support', 'alternateOrientation') || false;
				if(this.data.tempHexValues != undefined){
					if(this.data.tempHexValues.alternateOrientation != undefined){
						alt = this.data.tempHexValues.alternateOrientation
					}
				}

				borderRotationOffset = 0;
				if(columns){
					borderRotationOffset -= 30;
				}
				if(alt){
					borderRotationOffset += 180;
				}

			    //rotate the coordinates
			    //this is required because the rotation attribute of the border only rotates the graphics, not the hit area
			    //and the hit area is only defined by a collection of points
			    const cosTheta = Math.cos((/*this.data.rotation +*/ borderRotationOffset) * 0.0174533);
			    const sinTheta = Math.sin((/*this.data.rotation +*/ borderRotationOffset) * 0.0174533);

			    let rotatedPoints = xyPoints.map( (point) => {
			    	let x = cosTheta * point[0] + (-1 * sinTheta * point[1])
			    	let y = sinTheta * point[0] + cosTheta*point[1]
			    	return [x,y]
			    })
			    
			    let shiftedPoints = rotatedPoints.map((point) => {
			    	const x = point[0] + width / 2
			    	const y = point[1] + height / 2
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

	let altSnapping = this.getFlag("hex-size-support", "altSnapping");
	if(this.data?.tempHexValues?.altSnapping != undefined){
		altSnapping = this.data.tempHexValues.altSnapping
	}

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
	      	if(this.data?.tempHexValues?.vertexSnap != undefined){
				evenSnapping = this.data.tempHexValues.vertexSnap
			}

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
    this.icon.pivot.y = this.getFlag("hex-size-support","pivoty") || 0.0;
	this.icon.pivot.x = this.getFlag("hex-size-support","pivotx") || 0.0;
	// this.icon.pivot.y = 0;

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

    let up = this.getFlag("hex-size-support","alternateOrientation");
    if(this.data.tempHexValues != undefined){
		if(this.data.tempHexValues.alternateOrientation != undefined){
			up = this.data.tempHexValues.alternateOrientation
		}
	}
    
    let vertexSnap = findVertexSnapPoint(dest.x + offset.x, dest.y + offset.y, this, canvas.grid.grid)
    //set the pivot here in addition to when the canvas is rendered
    //this is to ensure the pivot change happens after a token is changed and moved
    // this.icon.pivot.y = -(canvas.grid.grid.h * 0.125 * 2);
    this.icon.pivot.y = this.getFlag("hex-size-support","pivoty") || 0.0;
	this.icon.pivot.x = this.getFlag("hex-size-support","pivotx") || 0.0;

	let snapPoint = {
    	x: vertexSnap.x - offset.x,
    	y: vertexSnap.y - offset.y
    }
    // console.log("Snapped X: " + snapPoint.x +  " Snapped Y: " + snapPoint.y)

    //remove the offset from the newly discovered true center and store
    return snapPoint
}

//Handle dealing with shifting a token, this fixes issues with using arrow keys
Token.prototype._getShiftedPositionCached = Token.prototype._getShiftedPosition;
Token.prototype._getShiftedPosition = function(dx, dy){
	//conditionally lock out arrow key movement for a token
	if(this.data.tempHexValues?.locked == true){
		return {x: this.x, y:this.y}
	}
	// const altSnapping = this.data?.tempHexValues?.borderSize || this.getFlag("hex-size-support", "altSnapping")

	let altSnapping = this.getFlag("hex-size-support", "altSnapping");
	if(this.data?.tempHexValues?.altSnapping != undefined){
		altSnapping = this.data.tempHexValues.altSnapping
	}

	//run original code if no flag for alt-snapping
	if(!altSnapping == true){
		return this._getShiftedPositionCached(dx,dy);
	}
	else{
		// console.log(dx, dy)
		let columns = canvas.grid.grid.columns;
		let [row, col] = canvas.grid.grid.getGridPositionFromPixels(this.data.x, this.data.y);
		// console.log(row + "," + col)
		// console.log(this.data.x + "," + this.data.y)

		let x = this.x;
		let y = this.y;
		
		let evenSnapping = this.getFlag("hex-size-support", "evenSnap");
      	if(this.data?.tempHexValues?.vertexSnap != undefined){
			evenSnapping = this.data.tempHexValues.vertexSnap
		}

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

	   
	 //    let evenSnapping = this.getFlag("hex-size-support", "evenSnap");
  //     	if(this.data?.tempHexValues?.vertexSnap != undefined){
		// 	evenSnapping = this.data.tempHexValues.vertexSnap
		// }
      	if(evenSnapping == false){
      		dest = this.oddSnap(dest);
      	}
      	else{
      		dest = this.evenSnap(dest);
      	}
	    return collide ? {x: this.data.x, y: this.data.y} : {x: dest.x, y: dest.y};
	}
}
