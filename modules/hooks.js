import { HexToken } from './HexToken.js'
const moduleTM = "module.";

Hooks.on("init", () => {

})

//    this.icon.pivot.y = -(canvas.grid.grid.h * 0.125 * 2);
// Hooks.on("canvasInit", (canvas) => {
// 	console.log(game);
// 	console.log(game.scenes)
// 	for(let scene of game.scenes){
// 		for(let token of scene.data.tokens){
// 			console.log(token)
// 			if(token.flags.hex-size-support != undefined){
// 				if(token.flags.hex-size-support.evenSnap == true){
// 					token.icon.pivot.y = -(canvas.grid.grid.h * 0.125 * 2);
// 				}
// 			}
// 		}
// 	}
// });



Hooks.on("renderTokenConfig", async (app, html) => {
	console.log("Token Config")
	console.log(app)
	console.log(html)
	console.log(Handlebars)

	let flags = {
		altSnapping: app.token.getFlag("hex-size-support","altSnapping") || false,
		evenSnap: app.token.getFlag("hex-size-support","evenSnap") || false
	}
	const positionTab = html.find('.tab[data-tab="position"]');
	positionTab.append($(`
		<fieldset class="auras">
				<legend>Hex Size Support</legend>
				<ol class="form-group">
					<li class="flexrow">
						<label class="checkbox">
							Use Alternative Snapping
							<input type="checkbox" name="flags.hex-size-support.altSnapping"
							       ${flags.altSnapping ? 'checked' : ''}>
						</label>
						<label class="checkbox">
							Use even snapping(Snapping for sizes 2,4,6, etc)
							<input type="checkbox" name="flags.hex-size-support.evenSnap"
							       ${flags.evenSnap ? 'checked' : ''}>
						</label>
					</li>
				</ol>
			</fieldset>
		`));
});

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

Token.prototype._cachedonDragLeftDrop = Token.prototype._onDragLeftDrop;
Token.prototype._onDragLeftDrop = function(event) {
	console.log(this)

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

Token.prototype.oddSnap = function(dest){
    //offset values for the center of the tile
    //ex, top left + offset.x is the x coordinate of the center of the token
    let offset = {
    	x: (this.w) / 2,
		y: (this.h) / 2
    }

    //get coordinates of the center snap point
    let center = canvas.grid.getCenter(dest.x + offset.x, dest.y + offset.y);

    //remove the offset from the newly discovered true center and store
    return {
    	x: center[0] - offset.x,
    	y: center[1] - offset.y
    }
}

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

    console.log(tokenCenter)
    console.log(snappedCenter)

    //calculate the slope of the line drawn between the tokens center and the actual grid's center
    let slope = -(tokenCenter.y - snappedCenter.y) / (tokenCenter.x - snappedCenter.x)
    console.log(slope)

    let vertexOffset = {x:0, y:0}

    //determine which vertex to snap to
    if(tokenCenter.y < snappedCenter.y){
    	console.log("Above")
    	if(Math.sign(slope) == 1){
    		if(slope < 1.732){
    			console.log("Hex 3");
    			vertexOffset = vertexFind(3, canvas.grid.grid.w, canvas.grid.grid.h)
    		}
    		else{
    			console.log("Hex 2");
    			vertexOffset = vertexFind(2, canvas.grid.grid.w, canvas.grid.grid.h)
    		}
    	}
    	else{
    		if(slope > -1.732){
    			console.log("Hex 1");
    			vertexOffset = vertexFind(1, canvas.grid.grid.w, canvas.grid.grid.h)
    		}
    		else{
    			console.log("Hex 2");
    			vertexOffset = vertexFind(2, canvas.grid.grid.w, canvas.grid.grid.h)
    		}
    	}
    }
    else{
		if(Math.sign(slope) == 1){
    		if(slope < 1.732){
    			console.log("Hex 6");
    			vertexOffset = vertexFind(6, canvas.grid.grid.w, canvas.grid.grid.h)
    		}
    		else{
    			console.log("Hex 5")
    			vertexOffset = vertexFind(5, canvas.grid.grid.w, canvas.grid.grid.h)
    		}
    	}
    	else{
    		if(slope > -1.732){
    			console.log("Hex 4")
    			vertexOffset = vertexFind(4, this.w, this.h)
    		}
    		else{
    			console.log("Hex 5")
    			vertexOffset = vertexFind(5, this.w, this.h)
    		}
    	}
    }

    // this.icon.pivot.y = -(canvas.grid.grid.h * 0.125 * 2);
    //remove the offset from the newly discovered true center and store
    return {
    	x: snappedCenter.x - offset.x + vertexOffset.x,
    	y: snappedCenter.y - offset.y + vertexOffset.y //+ (canvas.grid.grid.h * 0.125)
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

function vertexFind(region, width, height){
	return {
		x: pointHexVertexScalar[region - 1][0] * width,
		y: pointHexVertexScalar[region - 1][1] * height
	}
}

180.5
182