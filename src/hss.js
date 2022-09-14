// These are the original imports for the module
// import "./modules/hooks";
// import "./modules/ruler-changes";
// import "./modules/helpers";
// import "./modules/token-changes";
import { registerSettings, renderSettingsConfig } from "./modules/settings";
import { hitAreaDraw, hitAreaUpdate } from "./modules/hitarea";
import { registerBorderWrappers, moveBorderLayer } from "./modules/border";

Hooks.once("init", () => {
	console.log("hex-size-support | Initializing module");

	registerSettings();
	registerBorderWrappers();
});

// Hook token draw to change the hitArea
Hooks.on("drawToken", hitAreaDraw);

// Hook token updates to draw the correct hitArea
Hooks.on("updateToken", hitAreaUpdate);

//Add the color pickers to the module settings menu.
Hooks.on("renderSettingsConfig", renderSettingsConfig);

// Move border layer above token images if border below is false
Hooks.on("canvasReady", moveBorderLayer);
