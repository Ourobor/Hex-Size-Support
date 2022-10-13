import { registerSettings, renderSettingsConfig } from "./modules/settings";
import { hitAreaDraw, hitAreaUpdate, pivotToken } from "./modules/hitarea";
import { registerBorderWrappers, moveBorderLayer } from "./modules/border";
import { registerGridWrapper, extendHexBorders } from "./modules/grid";
import { extendTokenConfig } from "./modules/token-config";

Hooks.once("init", () => {
	console.log("hex-size-support | Initializing module");
	registerSettings();
	extendHexBorders();
	const API = {};
	game.modules.get("hex-size-support").api = API;
});

Hooks.once("libWrapper.Ready", () => {
	registerBorderWrappers();
	registerGridWrapper();
});

Hooks.on("drawToken", hitAreaDraw);
Hooks.on("updateToken", hitAreaUpdate);
Hooks.on("refreshToken", pivotToken);
Hooks.on("renderSettingsConfig", renderSettingsConfig);
Hooks.on("canvasReady", moveBorderLayer);
Hooks.on("renderTokenConfig", extendTokenConfig);
