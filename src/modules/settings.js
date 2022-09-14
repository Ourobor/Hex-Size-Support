export function registerSettings() {
	const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);
	const canvasRedraw = () => {
		if (canvas.ready) canvas.draw();
	};

	game.settings.register("hex-size-support", "alwaysShowBorder", {
		name: "Always Show Border",
		hint: "Always render the token's border.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: canvasRedraw,
	});

	game.settings.register("hex-size-support", "borderWidth", {
		name: "Border Width",
		hint: "Specify the width of the token's border",
		scope: "world",
		type: Number,
		config: true,
		default: 2,
		range: {
			min: 1,
			max: 20,
			step: 1,
		},
		onChange: canvasRedraw,
	});

	game.settings.register("hex-size-support", "borderBehindToken", {
		name: "Keep Border Behind Token",
		hint: "Render the token's border behind the token instead of in front.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: canvasRedraw,
	});

	game.settings.register("hex-size-support", "fillBorder", {
		name: "Fill Border Contents",
		hint: "Add a translucent color to the token's border contents.",
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
		name: "Color: Controlled",
		scope: "client",
		type: String,
		default: "#0A7AB2",
		config: true,
		onChange: val => {
      CONFIG.Canvas.dispositionColors = parseInt(val.substr(1), 16);
      canvasRedraw()
    },
	});

	game.settings.register("hex-size-support", "friendlyColor", {
		name: "Color: Friendly",
		scope: "client",
		type: String,
		default: "#0A7AB2",
		config: true,
		onChange: debouncedReload,
	});

	game.settings.register("hex-size-support", "neutralColor", {
		name: "Color: Neutral",
		scope: "client",
		type: String,
		default: "#F1D836",
		config: true,
		onChange: debouncedReload,
	});

	game.settings.register("hex-size-support", "hostileColor", {
		name: "Color: Hostile",
		scope: "client",
		type: String,
		default: "#E72124",
		config: true,
		onChange: debouncedReload,
	});
}

/**
 * @param {SettingsConfig} app
 * @param {JQuery<HTMLElement>} el
 */
export function renderSettingsConfig(_app, el, _data) {
	let nC = game.settings.get("hex-size-support", "neutralColor");
	let fC = game.settings.get("hex-size-support", "friendlyColor");
	let hC = game.settings.get("hex-size-support", "hostileColor");
	let cC = game.settings.get("hex-size-support", "controlledColor");

	el.find('[name="hex-size-support.neutralColor"]')
		.parent()
		.append(`<input type="color" value="${nC}" data-edit="hex-size-support.neutralColor">`);
	el.find('[name="hex-size-support.friendlyColor"]')
		.parent()
		.append(`<input type="color" value="${fC}" data-edit="hex-size-support.friendlyColor">`);
	el.find('[name="hex-size-support.hostileColor"]')
		.parent()
		.append(`<input type="color" value="${hC}" data-edit="hex-size-support.hostileColor">`);
	el.find('[name="hex-size-support.controlledColor"]')
		.parent()
		.append(`<input type="color"value="${cC}" data-edit="hex-size-support.controlledColor">`);
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
