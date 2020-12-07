
/**
 * Find the closest vertex snapping point to a given point, based on the provided token and grid state
 *
 *  @param (number) x the x coordinate of the point to find the closest snapping point to
 *  @param (number) y the y coordinate of the point to find the closest snapping point to
 *  @param (Token) token the token which will be snapped. Used to determine orientation and select which snapping points are valid
 *  @param (HexGrid) grid the canvas grid the snapping will occur on
 *  
 *  @return {number, number}
 */
export function findVertexSnapPoint(x,y,token, grid){
    let alt = getAltOrientationFlag(token)
    let newPoints
    if(grid.columns){
        newPoints = findSnapPointCols(x, y, grid.h, grid.w, alt)
    }
    else{
        newPoints = findSnapPointRows(x, y, grid.h, grid.w, alt) 
    }
    return newPoints;
}

/**
 * Find a token that contains the given point
 * 
 * @param (number) x0 the x coordinate of the point
 * @param (number) y0 the y coordinate of the point
 *
 * @return a token that overlaps the supplied point or null
 */
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

/**
 * Gets the value of the altSnapping flag, overriden with the temporary value if it exists
 * @param (Token) token The token to check
 *
 * @return the value of the altSnapping flag, or the temporary value if it's present
 */
export function getAltSnappingFlag(token){
    let altSnapping = token.getFlag("hex-size-support", "altSnapping");
    if(token.data?.tempHexValues?.altSnapping != undefined){
        altSnapping = token.data.tempHexValues.altSnapping
    }
    return altSnapping;
}

/**
 * Gets the value of the evenSnap flag, overriden with the temporary value if it exists
 * @param (Token) token The token to check
 *
 * @return the value of the evenSnap flag, or the temporary value if it's present
 */
export function getEvenSnappingFlag(token){
    let evenSnapping = token.getFlag("hex-size-support", "evenSnap");
    if(token.data?.tempHexValues?.vertexSnap != undefined){
        evenSnapping = token.data.tempHexValues.vertexSnap
    }
    return evenSnapping;
}

/**
 * Gets the value of the alternateOrientation flag, overriden with the temporary value if it exists
 * @param (Token) token The token to check
 *
 * @return the value of the alternateOrientation flag, or the temporary value if it's present
 */
export function getAltOrientationFlag(token){
    let altOrientation = token.getFlag("hex-size-support","alternateOrientation");
    if(token.data?.tempHexValues?.alternateOrientation != undefined){
        altOrientation = token.data.tempHexValues.alternateOrientation
    }
    return altOrientation;
}

/**
 * Calculates the offset between the top left of a token and its center
 * @param (Token) token the token to calculate the offset of
 *
 * @return an object with the x and y offsets of the supplied token
 */
export function getCenterOffset(token){
    let offset = {
        x: (token.w) / 2,
        y: (token.h) / 2
    }
    return offset;
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

//##############################################################
//#############Deprecated#######################################
//##############################################################


// export function findSectorPointy(above, slope){
//     if(above){
//         if(slope > 0 && slope < 1.732){
//             return 3;
//         }
//         else if(slope < 0 && slope > -1.732){
//             return 1;
//         }
//         else{
//             return 2;
//         }
//     }
//     else{
//         if(slope > 0 && slope < 1.732){
//             return 6;
//         }
//         else if(slope < 0 && slope > -1.732){
//             return 4;
//         }
//         else{
//             return 5;
//         }
//     }
// }

// export function findSectorFlat(right, slope){
//     if(right){
//         if(slope > 0.577){
//             return 3;
//         }
//         else if(slope < -0.577){
//             return 5;
//         }
//         else{
//             return 4;
//         }
//     }
//     else{
//         if(slope > 0.577){
//             return 6;
//         }
//         else if(slope < -0.577){
//             return 2;
//         }
//         else{
//             return 1;
//         }
//     }
// }

// //calculates the pixel offset from a point to the nearest vertex given a center point and that point
// export function findNearestVertex(center, point, upOrRight = true){
//     //calculate the slope of the line drawn between the tokens center and the actual grid's center
//     let slope = -(point.y - center.y) / (point.x - center.x)
    
//     //we use the slope of this line to determine the section of the hex we are in. The hex is divided up
//     //evenly into 6 sections from the center. A line with slope of around 1.732 has an angle from the x axis of about
//     //60 degrees, so we use that to determine roughly which angle we are in.

//     let vertexOffset = {x:0, y:0}

//     let sector = -1;
//     const columns = canvas.grid.grid.columns;
//     if(columns){
//         if(upOrRight){
//            sector = findSectorFlatRight(point.x > center.x, slope);
//         }
//         else{
//             sector = findSectorFlatLeft(point.x > center.x, slope);
//         }
//     }
//     else
//     {
//         if(upOrRight){
//            sector = findSectorPointyUpfacing(point.y < center.y, slope);
//         }
//         else{
//            sector = findSectorPointyDownfacing(point.y < center.y, slope); 
//         }
//     }

//     // console.log(sector)
//     vertexOffset = vertexFind(sector, canvas.grid.grid.w, canvas.grid.grid.h, columns);
//     return vertexOffset;
// }

// //calculate the offset to get to the vertex in the given region given the
// //width and height of a hex in this scene and if the scene has pointy/flat topped hexes
// export function vertexFind(region, width, height, flatHex ){
//     if(flatHex){
//         return {
//             x: flatHexVertexScalar[region - 1][0] * width,
//             y: flatHexVertexScalar[region - 1][1] * height
//         }
//     }
//     else{
//         return {
//             x: pointHexVertexScalar[region - 1][0] * width,
//             y: pointHexVertexScalar[region - 1][1] * height
//         }
//     }
// }

// export function findSectorPointyDownfacing(above, slope){
//     if(above){
//         return 2;
//     }
//     else{
//         if(slope > 0){
//             return 6;
//         }
//         else{
//             return 4;
//         }
//     }
// }

// export function findSectorPointyUpfacing(above, slope){
//     if(above){
//         if(slope > 0){
//             return 3;//top right
//         }
//         else{
//             return 1;//top left
//         }
//     }
//     else{
//         return 5;//bottom middle
//     }
// }

// export function findSectorFlatLeft(right, slope){
//     if(right){
//         return 4;
//     }
//     else{
//         if(slope > 0){
//             return 6;
//         }
//         else{
//             return 2;
//         }
//     }
// }

// export function findSectorFlatRight(right, slope){
//     if(right){
//         if(slope > 0){
//             return 3;
//         }
//         else{
//             return 5;
//         }
//     }
//     else{
//         return 1;
//     }
// }

// let pointHexVertexScalar = [
//     [-0.5, -0.25], 
//     [0, -0.5], 
//     [0.5, -0.25], 
//     [0.5, 0.25], 
//     [0, 0.5], 
//     [-0.5, 0.25]
//     ];

// let flatHexVertexScalar = [
//     [-0.5, 0], 
//     [-0.25, -0.5], 
//     [0.25, -0.5], 
//     [0.5, 0], 
//     [0.25, 0.5], 
//     [-0.25, 0.5]];

//given a coordinate, returns the closest valid snap point for odd type snapping
// /**
//  * Calculates the xy coordinates for the supplied token 
//  */
// export function oddSnap(dest, token){
//     //offset values for the center of the tile
//     let offset = getCenterOffset(token)

//     //get coordinates of the center snap point
//     let center = canvas.grid.getCenter(dest.x + offset.x, dest.y + offset.y);

//     //remove the offset from the newly discovered true center and store
//     return {
//         x: center[0] - offset.x,
//         y: center[1] - offset.y
//     }
// }

// //given a coordinate, returns the closest valid snap point for even type snapping
// /**
//  *
//  */
// export function evenSnap(dest, token){
//     //offset values for the center of the tile
//     let offset = getCenterOffset(token);
    
//     let vertexSnap = findVertexSnapPoint(dest.x + offset.x, dest.y + offset.y, token, canvas.grid.grid)

//     let snapPoint = {
//         x: vertexSnap.x - offset.x,
//         y: vertexSnap.y - offset.y
//     }

//     //remove the offset from the newly discovered true center and store
//     return snapPoint
// }