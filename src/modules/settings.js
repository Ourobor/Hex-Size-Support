export const registerSettings = function () {

	const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);
	
  game.settings.register("hex-size-support", "alwaysShowBorder", {
		name: "Always Show Border",
		hint: "Always render the token's border.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: debouncedReload,
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
		onChange: debouncedReload,
	});

	game.settings.register("hex-size-support", "borderBehindToken", {
		name: "Keep Border Behind Token",
		hint: "Render the token's border behind the token instead of in front.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: debouncedReload,
	});

	game.settings.register("hex-size-support", "fillBorder", {
		name: "Fill Border Contents",
		hint: "Add a translucent color to the token's border contents.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: debouncedReload,
	});

	/**
	 * Border Color Settings
	*/

	game.settings.register("hex-size-support", "controlledColor", {
		name: 'Color: Controlled',
		scope: 'client',
		type: String,
		default: "#0A7AB2",
		config: true,
		onChange: debouncedReload,
	});

	game.settings.register("hex-size-support", "friendlyColor", {
		name: 'Color: Friendly',
		scope: 'client',
		type: String,
		default: "#0A7AB2",
		config: true,
		onChange: debouncedReload,
	});

	game.settings.register("hex-size-support", "neutralColor", {
		name: 'Color: Neutral',
		scope: 'client',
		type: String,
		default: "#F1D836",
		config: true,
		onChange: debouncedReload,
	});

	game.settings.register("hex-size-support", "hostileColor", {
		name: 'Color: Hostile',
		scope: 'client',
		type: String,
		default: "#E72124",
		config: true,
		onChange: debouncedReload,
	});
};
