// These are the original imports for the module
// import "./modules/hooks";
// import "./modules/ruler-changes";
// import "./modules/helpers";
// import "./modules/token-changes";

import { registerSettings, renderSettingsConfig } from "./modules/settings";
import { hitAreaDraw, hitAreaUpdate, pivotToken } from "./modules/hitarea";
import { registerBorderWrappers, moveBorderLayer } from "./modules/border";
//import { registerGridWrapper } from "./modules/grid";

Hooks.once("init", () => {
	console.log("hex-size-support | Initializing module");

	registerSettings();
	registerBorderWrappers();
	// registerGridWrapper();
});

// Hook token draw to change the hitArea
Hooks.on("drawToken", hitAreaDraw);

// Hook token updates to draw the correct hitArea
Hooks.on("updateToken", hitAreaUpdate);

Hooks.on("refreshToken", pivotToken);

//Add the color pickers to the module settings menu.
Hooks.on("renderSettingsConfig", renderSettingsConfig);

// Move border layer above token images if border below is false
Hooks.on("canvasReady", moveBorderLayer);
