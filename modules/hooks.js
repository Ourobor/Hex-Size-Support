import { HexTokenConfig } from './hex-token-config.js'
import { findVertexSnapPoint, findMovementToken, getEvenSnappingFlag, getAltSnappingFlag, getAltOrientationFlag, getCenterOffset, getKey } from './helpers.js'

//load in the hex token config's html template
Hooks.once('init', async function(){
	loadTemplates(['modules/hex-size-support/templates/hex-token-config.html'])
})

//Add the hex config button to the token hud
Hooks.on("renderTokenHUD", async (app, html, token) => {
		var configButton = html.find('[data-action="config"]').first();
		if (configButton === null) {
			configButton = html.find('.config');
		}
		configButton.after($(`
		<div class="control-icon config" id="hexConfig">
           	<img src="modules/hex-size-support/assets/hexIcon.svg" style="display: block; margin-left: auto; margin-right: auto;"/>
        </div>`));
        let button = html.find("#hexConfig")
        button.click(function() {
        	let foo = new HexTokenConfig(app.object, app).render(true);
        });
        
});

//Add the listener for flipping the orientation of a hex token
Hooks.once("ready", async function(){
    //expose helper methods for other modules to use
    CONFIG.hexSizeSupport = {};
    CONFIG.hexSizeSupport.findVertexSnapPoint = findVertexSnapPoint
    CONFIG.hexSizeSupport.findMovementToken = findMovementToken
    CONFIG.hexSizeSupport.getAltSnappingFlag = getAltSnappingFlag
    CONFIG.hexSizeSupport.getAltOrientationFlag = getAltOrientationFlag
    CONFIG.hexSizeSupport.getCenterOffset = getCenterOffset
    CONFIG.hexSizeSupport.getEvenSnappingFlag = getEvenSnappingFlag


    document.addEventListener("keydown", function(event){
        const key = getKey(event);
        if(event.shiftKey){
            if(key == "R" || key == "r"){
                let tokens = canvas.tokens.placeables.filter(o => o._controlled); 
                for(let token of canvas.tokens.controlled){
                    let alternate = token.document.getFlag("hex-size-support","alternateOrientation") || false;
                    token.document.setFlag("hex-size-support","alternateOrientation", !alternate);
                }
            }
        }
    });
})

/**
My sincerest affection and love for the Pilot NET Discord community. Without your support, patience and good feels I wouldn't have 
ever gotten this far. This is all for you now, I'm sorry I made you all wait for so long.
 - Ember Scaleborne <3

In regards to the 0.8.6 foundry update,
    My deepest thanks for the efforts of @FolkvangrForgent, @Eranziel, @The-E and @Bolts. Without your hard work and nagging, this update would
have been a lot later than it had any right to be be. Life seems to really enjoy kicking me right when a new update comes out >.>
 - Ember Scaleborne 06/26/2021 <3
*/
