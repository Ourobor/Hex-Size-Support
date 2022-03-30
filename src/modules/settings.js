export const registerSettings = function () {

  game.settings.register("hex-size-support", "alwaysShowBorder", {
		name: "Always Show Border",
		hint: "Always render the token's border.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: () => window.location.reload(),
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
		onChange: () => window.location.reload(),
	});

	game.settings.register("hex-size-support", "borderBehindToken", {
		name: "Keep Border Behind Token",
		hint: "Render the token's border behind the token instead of in front.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: () => window.location.reload(),
	});

	game.settings.register("hex-size-support", "fillBorder", {
		name: "Fill Border Contents",
		hint: "Add a translucent color to the token's border contents.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		onChange: () => window.location.reload(),
	});
};
