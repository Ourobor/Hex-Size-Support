import {HexSizeSupportAddWaypoint, HexSizeSupportMeasure, HexSizeSupportAnimateToken} from "./ruler-changes.js";

const MODULE_ID = "hex-size-support";

export function registerLibRuler() {
  libwrapper.register(MODULE_ID, 'Ruler.prototype._addWaypoint', HexSizeSupportAddWaypoint, 'WRAPPER');
  libwrapper.register(MODULE_ID, 'Ruler.prototype.measure', HexSizeSupportMeasure, 'WRAPPER');

  // The animateToken method is added by libRuler module
  libWrapper.register(MODULE_ID, 'Ruler.prototype.animateToken', HexSizeSupportAnimateToken, 'WRAPPER');
}