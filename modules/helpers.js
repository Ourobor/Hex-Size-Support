//calculates the pixel offset from a point to the nearest vertex given a center point and that point
export function findNearestVertex(center, point){
	//calculate the slope of the line drawn between the tokens center and the actual grid's center
    let slope = -(point.y - center.y) / (point.x - center.x)
    
    //we use the slope of this line to determine the section of the hex we are in. The hex is divided up
    //evenly into 6 sections from the center. A line with slope of around 1.732 has an angle from the x axis of about
    //60 degrees, so we use that to determine roughly which angle we are in.

    let vertexOffset = {x:0, y:0}

    let sector = -1;
    const columns = canvas.grid.grid.columns;
    if(columns){
    	sector = findSectorFlat(point.x > center.x, slope);
    }
    else
    {
    	sector = findSectorPointy(point.y < center.y, slope);
	}

    vertexOffset = vertexFind(sector, canvas.grid.grid.w, canvas.grid.grid.h, columns);
    return vertexOffset;
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