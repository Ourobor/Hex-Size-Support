/** @param {Token} token */
export function hitAreaDraw(token) {
	if (canvas?.grid.isHex) {
		const point_array = canvas.grid.grid.getBorderPolygon(
			token.document.width,
			token.document.height,
			0
		);
		if (point_array) token.hitArea = new PIXI.Polygon(point_array);
	} else if (
		canvas.grid.type === CONST.GRID_TYPES.GRIDLESS &&
		token.document.width === token.document.height
	) {
		token.hitArea = new PIXI.Circle(token.w / 2, token.h / 2, token.w / 2);
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
	} else if (canvas.grid.type === CONST.GRID_TYPES.GRIDLESS && token.width === token.height) {
		token.object.hitArea = new PIXI.Circle(
			token.object.w / 2,
			token.object.h / 2,
			token.object.w / 2
		);
	}
}

/** @param {Token} token */
export function pivotToken(token) {
	/** @type number | undefined */
	const pivotx = token.document.getFlag("hex-size-support", "pivotx");
	/** @type number | undefined */
	const pivoty = token.document.getFlag("hex-size-support", "pivoty");
	token.mesh.pivot.x = pivotx ?? 0;
	token.mesh.pivot.y = pivoty ?? 0;
}
