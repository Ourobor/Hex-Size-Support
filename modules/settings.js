export const registerSettings = function() {
  /**
   * Keep 'Always Show Border' behind Tokens
   */
   game.settings.register("hex-size-support", "borderBehindToken", {
    name: "Keep Border Behind Token",
    hint: "Render the token's border behind the token.",
    scope: "client",
    type: Boolean,
    config: true,
    default: false,
		onChange: () => window.location.reload()
  });

  game.settings.register("hex-size-support", "fillBorder", {
    name: "Fill Border Contents",
    hint: "Add a translucent color to the token's border contents.",
    scope: "client",
    type: Boolean,
    config: true,
    default: false,
		onChange: () => window.location.reload()
  });

}