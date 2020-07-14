import { HexTokenConfig } from './hex-token-config.js'

Hooks.once('init', async function(){
	loadTemplates(['modules/hex-size-support/templates/hex-token-config.html'])
})

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
			<label class="checkbox">Use Alternative Snapping</label>
			<input type="checkbox" name="flags.hex-size-support.altSnapping"
			       ${flags.altSnapping ? 'checked' : ''}>
		</div>
		<div class="form-group">
			<label class="checkbox">Snap to Vertex(size 2/4)</label>
			<input type="checkbox" name="flags.hex-size-support.evenSnap"
				${flags.evenSnap ? 'checked' : ''}>
		</div>
		<div class="form-group">
			<button type="button" id="configAdvHex" title="Configure Advanced options">
				<i class="fas fa-draw-polygon fa-fw"></i> Configure Advanced Hex Options
			</button>
		</div>
		`));
	let button = positionTab.find("#configAdvHex");
	button.click(() => {
		app.minimize();
		//render the config thingie
		let foo = new HexTokenConfig(app.object, app).render(true);
	});
	// console.log(positionTab);

});

//			<button class="grid-config" type="button"><i class="fas fa-ruler-combined"></i></button>