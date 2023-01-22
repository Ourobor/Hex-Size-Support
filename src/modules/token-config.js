/**
 * @param {TokenConfig} app
 * @param {JQuery<HTMLElement>} $el
 * @param {object} data
 */
export function extendTokenConfig(app, $el) {
	$el.find("[name=width]").closest(".form-group").after(`
	<div class="form-group slim">
		<label>${game.i18n.localize("hex-size-support.tokenConfig.artpivot.label")}</label>
		<div class="form-fields">
			<label>X</label>
			<input type="number" step="1" name="flags.hex-size-support.pivotx" placeholder="px" \
				value="${app.object.getFlag("hex-size-support", "pivotx")}">
			<label>Y</label>
			<input type="number" step="1" name="flags.hex-size-support.pivoty" placeholder="px" \
				value="${app.object.getFlag("hex-size-support", "pivoty")}">
		</div>
	</div>
	`);
	$el.find("[name=mirrorX]").closest(".form-group").after(`
	<div class="form-group slim">
		<label>${game.i18n.localize("hex-size-support.tokenConfig.altOrientation.label")}</label>
		<div class="form-fields">
			<input type="checkbox" step="1" name="flags.hex-size-support.alternateOrientation" ${
				app.object.getFlag("hex-size-support", "alternateOrientation") ? "checked" : ""
			}>
		</div>
	</div>
	<div class="form-group slim">
		<label>${game.i18n.localize("hex-size-support.tokenConfig.hideBorder.label")}</label>
		<div class="form-fields">
			<input type="checkbox" step="1" name="flags.hex-size-support.hideBorder" ${
				app.object.getFlag("hex-size-support", "hideBorder") ? "checked" : ""
			}>
		</div>
	</div>
	`);
	
	let x = $el.find("[name=scale]");
	x.attr('max', Number(5.0));
	x.attr('step', Number(0.01)); 

	app.setPosition();
}
