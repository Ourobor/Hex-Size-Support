import {HexSizeSupportAddWaypoint, HexSizeSupportMeasure} from "./ruler-changes.js";

const MODULE_ID = "hex-size-support";

export function registerLibRuler() {
  libwrapper.register(MODULE_ID, 'Ruler.prototype._addWaypoint', HexSizeSupportAddWaypoint, 'WRAPPER');
  libwrapper.register(MODULE_ID, 'Ruler.prototype.measure', HexSizeSupportMeasure, 'WRAPPER');
}