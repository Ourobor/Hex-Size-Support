import {HexSizeSupportAddWaypoint, HexSizeSupportMeasure, HexSizeSupportAnimateToken} from "./ruler-changes.js";

const MODULE_ID = "hex-size-support";

export function registerHexRulerPatches() {
  libWrapper.register(MODULE_ID, 'Ruler.prototype._addWaypoint', HexSizeSupportAddWaypoint, 'WRAPPER');
  libWrapper.register(MODULE_ID, 'Ruler.prototype.measure', HexSizeSupportMeasure, 'WRAPPER');

  // The animateToken method is added by libRuler module
  libWrapper.register(MODULE_ID, 'Ruler.prototype.animateToken', HexSizeSupportAnimateToken, 'WRAPPER');
}
