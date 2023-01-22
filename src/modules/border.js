import { isAltOrientation } from "./grid";

export function registerBorderWrappers() {
	libWrapper.register(
		"hex-size-support",
		"Token.prototype._refreshBorder",
		/** @this Token */
		function () {
			/** @type boolean */
			const always_show = game.settings.get("hex-size-support", "alwaysShowBorder");
			/** @type boolean */
			const fill_border = game.settings.get("hex-size-support", "fillBorder");
			const options = {};
			
			/** @type boolean **/
			const token_hide_border = this.document.getFlag("hex-size-support", "hideBorder");

			this.border.clear();
			if (!this.isVisible || token_hide_border) return;
			const borderColor = this._getBorderColor(options);
			if (borderColor == null) return;

			const t = CONFIG.Canvas.objectBorderThickness;
			this.border.position.set(this.document.x, this.document.y);

			// Draw Hex border for size 1 tokens on a hex grid
			if (canvas.grid.isHex) {
				const polygon = isAltOrientation(this)
					? canvas.grid.grid.getAltBorderPolygon(this.document.width, this.document.height, t)
					: canvas.grid.grid.getBorderPolygon(this.document.width, this.document.height, t);
				if (polygon) {
					this.border.lineStyle(t, 0x000000, 0.8).drawPolygon(polygon);
					this.border.lineStyle(t / 2, borderColor, 1.0).drawPolygon(polygon);
					if (fill_border) this.border.beginFill(borderColor, 0.3).drawPolygon(polygon);
					return;
				}
			} else if (
				canvas.grid.type === CONST.GRID_TYPES.GRIDLESS &&
				this.document.width === this.document.height
			) {
				this.border.lineStyle(t, 0x000000, 0.8).drawCircle(this.w / 2, this.h / 2, this.w / 2);
				this.border
					.lineStyle(t / 2, borderColor, 1.0)
					.drawCircle(this.w / 2, this.h / 2, this.w / 2);
				if (fill_border)
					this.border.beginFill(borderColor, 0.3).drawCircle(this.w / 2, this.h / 2, this.w / 2);
				return;
			}

			// Otherwise, draw square border
			const h = Math.round(t / 2);
			const o = Math.round(h / 2);
			this.border.lineStyle(t, 0x000000, 0.8).drawRoundedRect(-o, -o, this.w + h, this.h + h, 3);
			this.border.lineStyle(h, borderColor, 1.0).drawRoundedRect(-o, -o, this.w + h, this.h + h, 3);
			if (fill_border) {
				this.border.beginFill(borderColor, 0.3).drawRoundedRect(0, 0, this.w, this.h, 3);
			}
		},
		"OVERRIDE"
	);
}

export function moveBorderLayer() {
	/** @type boolean */
	const border_below = game.settings.get("hex-size-support", "borderBehindToken");
	if (border_below) return;
	const borders = canvas.grid.borders;
	canvas.grid.removeChild(borders);
	canvas.tokens.addChild(borders);
}
