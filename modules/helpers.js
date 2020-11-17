
/**
 * Find the closest vertex snapping point to a given point, based on the provided token and grid state
 */
export function findVertexSnapPoint(x,y,token, grid){
    let alt = token.getFlag("hex-size-support","alternateOrientation");
    if(token.data.tempHexValues != undefined){
        if(token.data.tempHexValues.alternateOrientation != undefined){
            alt = token.data.tempHexValues.alternateOrientation
        }
    }
    let newPoints
    if(grid.columns){
        newPoints = findSnapPointCols(x, y, grid.h, grid.w, alt)
    }
    else{
        newPoints = findSnapPointRows(x, y, grid.h, grid.w, alt) 
    }
    return newPoints;
}

function findSnapPointRows(x,y,h,w, alt){
    let xOffset = 0.0
    if(canvas.grid.grid.even){
        xOffset = -0.5
    }

    let yOffset1 = 0.75
    let yOffset2 = 0.00
    if(alt){
        yOffset1 = 0.25
        yOffset2 = 1.00
    }

    let row1 = calculateSnapPointsRows(x,y,h,w,0.5 + xOffset ,yOffset1);
    let row2 = calculateSnapPointsRows(x,y,h,w,1.0 + xOffset ,yOffset2);

    let dist1 = Math.pow((row1.x - x),2) + Math.pow((row1.y - y),2)
    let dist2 = Math.pow((row2.x - x),2) + Math.pow((row2.y - y),2)

    if(dist1 < dist2){
        return row1
    }
    else{
        return row2
    }
    
}

function calculateSnapPointsRows(x,y,h,w,xOff, yOff){
    let c = Math.floor(((x + ((0.5  - xOff) * w)) /       w ) +1)
    let r = Math.floor(((y + ((0.75 - yOff) * h)) /(1.5 * h)) +1)

    let snapX = (c * w      ) - ((1   - xOff) * w)
    let snapY = (r * h * 1.5) - ((1.5 - yOff) * h)

    return {x: snapX, y: snapY}
}

function findSnapPointCols(x,y,h,w, alt){
    let yOffset = 0.0
    if(canvas.grid.grid.even){
        yOffset = -0.5
    }

    let xOffset1 = 0.25
    let xOffset2 = 1.00
    if(alt){
        xOffset1 = 0.75
        xOffset2 = 0.00
    }

    let row1 = calculateSnapPointsCols(x,y,h,w, xOffset1, 0.5 + yOffset);
    let row2 = calculateSnapPointsCols(x,y,h,w, xOffset2, 1.0 + yOffset);

    let dist1 = Math.pow((row1.x - x),2) + Math.pow((row1.y - y),2)
    let dist2 = Math.pow((row2.x - x),2) + Math.pow((row2.y - y),2)

    if(dist1 < dist2){
        return row1
    }
    else{
        return row2
    }
   
}


function calculateSnapPointsCols(x,y,h,w,xOff, yOff){
    let c = Math.floor(((x + ((0.75 - xOff) * w)) /(1.5 * w)) +1)
    let r = Math.floor(((y + ((0.5  - yOff) * h)) /       h ) +1)

    let snapX = (c * w * 1.5) - ((1.5 - xOff) * w)
    let snapY = (r * h      ) - ((1   - yOff) * h)

    return {x: snapX, y: snapY}
}

export function findSectorPointy(above, slope){
	if(above){
    	if(slope > 0 && slope < 1.732){
			return 3;
    	}
    	else if(slope < 0 && slope > -1.732){
    		return 1;
    	}
    	else{
    		return 2;
    	}
    }
    else{
    	if(slope > 0 && slope < 1.732){
			return 6;
    	}
    	else if(slope < 0 && slope > -1.732){
    		return 4;
    	}
    	else{
    		return 5;
    	}
    }
}

export function findSectorPointyUpfacing(above, slope){
    // console.log("above")
    // console.log(above)
    // console.log("slope: " + slope)
    if(above){
        if(slope > 0){
            return 3;//top right
        }
        else{
            return 1;//top left
        }
    }
    else{
        // if(slope < 0.577){
        //     return 1;
        // }
        // else if(slope > -0.577){
        //     return 3;
        // }
        // else{
            return 5;
        // }
    }
}

//calculates the pixel offset from a point to the nearest vertex given a center point and that point
export function findNearestVertex(center, point, upOrRight = true){
	//calculate the slope of the line drawn between the tokens center and the actual grid's center
    let slope = -(point.y - center.y) / (point.x - center.x)
    
    //we use the slope of this line to determine the section of the hex we are in. The hex is divided up
    //evenly into 6 sections from the center. A line with slope of around 1.732 has an angle from the x axis of about
    //60 degrees, so we use that to determine roughly which angle we are in.

    // console.log("points")
    // console.log(point)
    // console.log(center)
    // console.log(canvas.grid.grid.getGridPositionFromPixels(point.x, point.y))

    let vertexOffset = {x:0, y:0}

    let sector = -1;
    const columns = canvas.grid.grid.columns;
    if(columns){
        if(upOrRight){
    	   sector = findSectorFlatRight(point.x > center.x, slope);
        }
        else{
            sector = findSectorFlatLeft(point.x > center.x, slope);
        }
    }
    else
    {
        if(upOrRight){
    	   sector = findSectorPointyUpfacing(point.y < center.y, slope);
        }
        else{
           sector = findSectorPointyDownfacing(point.y < center.y, slope); 
        }
	}

    // console.log(sector)
    vertexOffset = vertexFind(sector, canvas.grid.grid.w, canvas.grid.grid.h, columns);
    return vertexOffset;
}

export function findSectorPointyDownfacing(above, slope){
    if(above){
        return 2;
    }
    else{
        if(slope > 0){
            return 6;
        }
        else{
            return 4;
        }
    }
}

export function findSectorFlat(right, slope){
	if(right){
    	if(slope > 0.577){
			return 3;
    	}
    	else if(slope < -0.577){
    		return 5;
    	}
    	else{
    		return 4;
    	}
    }
    else{
    	if(slope > 0.577){
			return 6;
    	}
    	else if(slope < -0.577){
    		return 2;
    	}
    	else{
    		return 1;
    	}
    }
}

export function findSectorFlatLeft(right, slope){
    if(right){
        return 4;
    }
    else{
        if(slope > 0){
            return 6;
        }
        else{
            return 2;
        }
    }
}

export function findSectorFlatRight(right, slope){
    if(right){
        if(slope > 0){
            return 3;
        }
        else{
            return 5;
        }
    }
    else{
        return 1;
    }
}

let pointHexVertexScalar = [
	[-0.5, -0.25], 
	[0, -0.5], 
	[0.5, -0.25], 
	[0.5, 0.25], 
	[0, 0.5], 
	[-0.5, 0.25]
	];

let flatHexVertexScalar = [
	[-0.5, 0], 
	[-0.25, -0.5], 
	[0.25, -0.5], 
	[0.5, 0], 
	[0.25, 0.5], 
	[-0.25, 0.5]];


//calculate the offset to get to the vertex in the given region given the
//width and height of a hex in this scene and if the scene has pointy/flat topped hexes
export function vertexFind(region, width, height, flatHex ){
	if(flatHex){
		return {
			x: flatHexVertexScalar[region - 1][0] * width,
			y: flatHexVertexScalar[region - 1][1] * height
		}
	}
	else{
		return {
			x: pointHexVertexScalar[region - 1][0] * width,
			y: pointHexVertexScalar[region - 1][1] * height
		}
	}
}

//get a token that overlaps with the provided point
export function findMovementToken(x0,y0) {
    const tokens = new Set(canvas.tokens.controlled);
    if ( !tokens.size && game.user.character ) {
      const charTokens = game.user.character.getActiveTokens();
      if ( charTokens.length ) tokens.add(...charTokens);
    }
    if ( !tokens.size ) return null;
    return Array.from(tokens).find(t => {
      let pos = new PIXI.Rectangle(t.x - 1, t.y - 1, t.w + 2, t.h + 2);
      return pos.contains(x0, y0);
    });
  }