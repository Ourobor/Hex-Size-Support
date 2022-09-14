export function registerSettings() {
	//const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);
	const canvasRedraw = () => {
		if (canvas.ready) canvas.draw();
	};

	game.settings.register("hex-size-support", "alwaysShowBorder", {
		name: "hex-size-support.settings.alwaysShowBorder.name",
		hint: "hex-size-support.settings.alwaysShowBorder.hint",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: canvasRedraw,
	});

	game.settings.register("hex-size-support", "borderWidth", {
		name: "hex-size-support.settings.borderWidth.name",
		hint: "hex-size-support.settings.borderWidth.hint",
		scope: "world",
		type: Number,
		config: true,
		default: 2,
		range: {
			min: 1,
			max: 20,
			step: 1,
		},
		onChange: val => {
			CONFIG.Canvas.objectBorderThickness = val;
			canvasRedraw();
		},
	});
	CONFIG.Canvas.objectBorderThickness = game.settings.get("hex-size-support", "borderWidth");

	game.settings.register("hex-size-support", "borderBehindToken", {
		name: "hex-size-support.settings.borderBehindToken.name",
		hint: "hex-size-support.settings.borderBehindToken.hint",
		scope: "world",
		type: Boolean,
		config: true,
		default: true,
		onChange: canvasRedraw,
	});

	game.settings.register("hex-size-support", "fillBorder", {
    name: "hex-size-support.settings.fillBorder.name",
		hint: "hex-size-support.settings.fillBorder.hint",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: canvasRedraw,
	});

	/**
	 * Border Color Settings
	 */

	game.settings.register("hex-size-support", "controlledColor", {
		name: "hex-size-support.settings.controlledColor.name",
		scope: "client",
		type: String,
		default: "#FF9829",
		config: true,
		onChange: val => {
			CONFIG.Canvas.dispositionColors.CONTROLLED = parseInt(val.substr(1), 16);
			canvasRedraw();
		},
	});
	CONFIG.Canvas.dispositionColors.CONTROLLED = parseInt(
		game.settings.get("hex-size-support", "controlledColor").substr(1),
		16
	);

	game.settings.register("hex-size-support", "partyColor", {
		name: "hex-size-support.settings.partyColor.name",
		scope: "client",
		type: String,
		default: "#0A7AB2",
		config: true,
		onChange: val => {
			CONFIG.Canvas.dispositionColors.PARTY = parseInt(val.substr(1), 16);
			canvasRedraw();
		},
	});
	CONFIG.Canvas.dispositionColors.PARTY = parseInt(
		game.settings.get("hex-size-support", "partyColor").substr(1),
		16
	);

	game.settings.register("hex-size-support", "friendlyColor", {
		name: "hex-size-support.settings.friendlyColor.name",
		scope: "client",
		type: String,
		default: "#0A7AB2",
		config: true,
		onChange: val => {
			CONFIG.Canvas.dispositionColors.FRIENDLY = parseInt(val.substr(1), 16);
			canvasRedraw();
		},
	});
	CONFIG.Canvas.dispositionColors.FRIENDLY = parseInt(
		game.settings.get("hex-size-support", "friendlyColor").substr(1),
		16
	);

	game.settings.register("hex-size-support", "neutralColor", {
		name: "hex-size-support.settings.neutralColor.name",
		name: "Color: Neutral",
		scope: "client",
		type: String,
		default: "#F1D836",
		config: true,
		onChange: val => {
			CONFIG.Canvas.dispositionColors.NEUTRAL = parseInt(val.substr(1), 16);
			canvasRedraw();
		},
	});
	CONFIG.Canvas.dispositionColors.NEUTRAL = parseInt(
		game.settings.get("hex-size-support", "neutralColor").substr(1),
		16
	);

	game.settings.register("hex-size-support", "hostileColor", {
		name: "hex-size-support.settings.hostileColor.name",
		name: "Color: Hostile",
		scope: "client",
		type: String,
		default: "#E72124",
		config: true,
		onChange: val => {
			CONFIG.Canvas.dispositionColors.HOSTILE = parseInt(val.substr(1), 16);
			canvasRedraw();
		},
	});
	CONFIG.Canvas.dispositionColors.HOSTILE = parseInt(
		game.settings.get("hex-size-support", "hostileColor").substr(1),
		16
	);
}

/**
 * @param {SettingsConfig} app
 * @param {JQuery<HTMLElement>} el
 */
export function renderSettingsConfig(_app, el, _data) {
	let nC = game.settings.get("hex-size-support", "neutralColor");
	let fC = game.settings.get("hex-size-support", "friendlyColor");
	let hC = game.settings.get("hex-size-support", "hostileColor");
	let pC = game.settings.get("hex-size-support", "partyColor");
	let cC = game.settings.get("hex-size-support", "controlledColor");

	el.find('[name="hex-size-support.controlledColor"]')
		.parent()
		.append(`<input type="color"value="${cC}" data-edit="hex-size-support.controlledColor">`);
	el.find('[name="hex-size-support.partyColor"]')
		.parent()
		.append(`<input type="color" value="${pC}" data-edit="hex-size-support.partyColor">`);
	el.find('[name="hex-size-support.friendlyColor"]')
		.parent()
		.append(`<input type="color" value="${fC}" data-edit="hex-size-support.friendlyColor">`);
	el.find('[name="hex-size-support.neutralColor"]')
		.parent()
		.append(`<input type="color" value="${nC}" data-edit="hex-size-support.neutralColor">`);
	el.find('[name="hex-size-support.hostileColor"]')
		.parent()
		.append(`<input type="color" value="${hC}" data-edit="hex-size-support.hostileColor">`);
}

/**
My sincerest affection and love for the Pilot NET Discord community. Without your support, patience and good feels I wouldn't have 
ever gotten this far. This is all for you now, I'm sorry I made you all wait for so long.
 - Ember Scaleborne <3

In regards to the 0.8.6 foundry update,
    My deepest thanks for the efforts of @FolkvangrForgent, @Eranziel, @The-E and @Bolts. Without your hard work and nagging, this update would
have been a lot later than it had any right to be be. Life seems to really enjoy kicking me right when a new update comes out >.>
 - Ember Scaleborne 06/26/2021 <3
*/
