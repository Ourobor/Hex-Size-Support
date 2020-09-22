import { HexTokenConfig } from './hex-token-config.js'

Hooks.once('init', async function(){
	loadTemplates(['modules/hex-size-support/templates/hex-token-config.html'])
})

Hooks.on("renderTokenHUD", async (app, html, token) => {

		const configButton = html.find('.config');
		console.log(configButton)
		configButton.after($(`
		<div class="control-icon config" id="hexConfig">
           	<img src="modules/hex-size-support/assets/hexIcon.svg" style="display: block; margin-left: auto; margin-right: auto;"/>
        </div>`));
        let button = html.find("#hexConfig")
        button.click(function() {
        	// console.log("Beep")
        	let foo = new HexTokenConfig(app.object, app).render(true);
        });
        
});
Hooks.on("renderTokenConfig", async (app, html) => {
	console.log(app)
	let flags = {
		altSnapping: app.token.getFlag("hex-size-support","altSnapping") || false,
		evenSnap: app.token.getFlag("hex-size-support","evenSnap") || false
	}
	const positionTab = html.find('.tab[data-tab="position"]');
	positionTab.append($(`
		<hr>
		<h3 class="form-header">Hex Token Size Support</h3>
		<div class="form-group">
			<label>Launch Token Config</label>
			<div class="form-fields">
				<button type="button" id="configAdvHex" title="Token Display Options">
					<i class="fas fa-draw-polygon fa-fw"></i>
				</button>
			</div>
			<p class="notes">Closes this window, please be sure to save any changes before launching</p>
		</div>
		<div class="form-group">
			<label class="checkbox">Use Alternative Snapping</label>
			<input type="checkbox" name="flags.hex-size-support.altSnapping"
			       ${flags.altSnapping ? 'checked' : ''}>
		</div>
		<div class="form-group">
			<label class="checkbox">Snap to Vertex(size 2/4)</label>
			<input type="checkbox" name="flags.hex-size-support.evenSnap"
				${flags.evenSnap ? 'checked' : ''}>
		</div>
		`));
	let button = positionTab.find("#configAdvHex");
	button.click(() => {
		// app.minimize();

		//render the config thingie
		let foo = new HexTokenConfig(app.object, app).render(true);

		app.close()
	});
	
	//allow the range slider to have higher precision
	app.form.elements.scale.step = "0.01"

	//update the form to ensure it doesn't have scrollbars caused by adding html after the height is determined
	app.setPosition({height:"auto"})

});

//			<button class="grid-config" type="button"><i class="fas fa-ruler-combined"></i></button>