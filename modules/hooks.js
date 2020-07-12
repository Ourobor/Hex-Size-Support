Hooks.on("renderTokenConfig", async (app, html) => {
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
