/** @param {Token} token */
export function hitAreaDraw(token) {
	if (canvas?.grid.isHex) {
		const point_array = canvas.grid.grid.getBorderPolygon(
			token.document.width,
			token.document.height,
			0
		);
		if (point_array) token.hitArea = new PIXI.Polygon(point_array);
	}
}

/** @param {TokenDocument} token */
export function hitAreaUpdate(token, data) {
	if (
		canvas?.grid.isHex &&
		["width", "height", "texture.scaleX", "texture.scaleY"].some(k => Object.hasOwn(data, k))
	) {
		const point_array = canvas.grid.grid.getBorderPolygon(token.width, token.height, 0);
		if (point_array) token.object.hitArea = new PIXI.Polygon(point_array);
	}
}
