export function registerGridWrapper() {
	libWrapper.register(
		"hex-size-support",
		"BaseGrid.implementationFor",
		/** @param {number} grid_type */
		function (wrapped, grid_type) {
			const types = CONST.GRID_TYPES;
			if ([types.HEXEVENR, types.HEXODDR, types.HEXEVENQ, types.HEXODDQ].includes(grid_type))
				return HSSHexagonalGrid;
			return wrapped(grid_type);
		},
		"MIXED"
	);
}

/**
 * Borders are defined by an array of point arrays. All of the points in the
 * array are normalized to the size of the bounding box around the token, so
 * 0,0 is the top left corner, and 1,1 is the bottom right. The points are
 * automatically scaled and shifted as necessary by foundry.
 */
const BORDER_EXTENSIONS = {
	POINTY: {
		5: [
			[0, 7 / 16],
			[1 / 10, 6 / 16],
			[1 / 10, 4 / 16],
			[2 / 10, 3 / 16],
			[2 / 10, 1 / 16],
			[3 / 10, 0],
			[4 / 10, 1 / 16],
			[5 / 10, 0],
			[6 / 10, 1 / 16],
			[7 / 10, 0],
			[8 / 10, 1 / 16],
			[8 / 10, 3 / 16],
			[9 / 10, 4 / 16],
			[9 / 10, 6 / 16],
			[1, 7 / 16],
			[1, 9 / 16],
			[9 / 10, 10 / 16],
			[9 / 10, 12 / 16],
			[8 / 10, 13 / 16],
			[8 / 10, 15 / 16],
			[7 / 10, 1],
			[6 / 10, 15 / 16],
			[5 / 10, 1],
			[4 / 10, 15 / 16],
			[3 / 10, 1],
			[2 / 10, 15 / 16],
			[2 / 10, 13 / 16],
			[1 / 10, 12 / 16],
			[1 / 10, 10 / 16],
			[0, 9 / 16],
		],
	},
	FLAT: {
		5: [
			[7 / 16, 0],
			[6 / 16, 1 / 10],
			[4 / 16, 1 / 10],
			[3 / 16, 2 / 10],
			[1 / 16, 2 / 10],
			[0, 3 / 10],
			[1 / 16, 4 / 10],
			[0, 5 / 10],
			[1 / 16, 6 / 10],
			[0, 7 / 10],
			[1 / 16, 8 / 10],
			[3 / 16, 8 / 10],
			[4 / 16, 9 / 10],
			[6 / 16, 9 / 10],
			[7 / 16, 1],
			[9 / 16, 1],
			[10 / 16, 9 / 10],
			[12 / 16, 9 / 10],
			[13 / 16, 8 / 10],
			[15 / 16, 8 / 10],
			[1, 7 / 10],
			[15 / 16, 6 / 10],
			[1, 5 / 10],
			[15 / 16, 4 / 10],
			[1, 3 / 10],
			[15 / 16, 2 / 10],
			[13 / 16, 2 / 10],
			[12 / 16, 1 / 10],
			[10 / 16, 1 / 10],
			[9 / 16, 0],
		],
	},
};

/**
 * Fixes orientation of size 2 and extends the hex borders with additional sizes
 */
export function extendHexBorders() {
	const pointy_borders = foundry.utils.deepClone(HexagonalGrid.POINTY_HEX_BORDERS);
	const flat_borders = foundry.utils.deepClone(HexagonalGrid.FLAT_HEX_BORDERS);

	// Flip the size 2 polygons
	pointy_borders[2] = pointy_borders[2].map(p => [p[0], 1 - p[1]]);
	flat_borders[2] = flat_borders[2].map(p => [1 - p[0], p[1]]);

	// Add any extra polygons
	HexagonalGrid.POINTY_HEX_BORDERS = {
		...pointy_borders,
		...BORDER_EXTENSIONS.POINTY,
	};
	HexagonalGrid.FLAT_HEX_BORDERS = {
		...flat_borders,
		...BORDER_EXTENSIONS.FLAT,
	};
}

/**
 * Determine whether the token should use the alternate orientation
 * @param {Token} token
 */
export function isAltOrientation(token) {
	return !!(
		game.settings.get("hex-size-support", "altOrientationDefault") ^
		(token.document.getFlag("hex-size-support", "alternateOrientation") ?? false)
	);
}

/**
 * Improve border support for hexagonal grids
 */
class HSSHexagonalGrid extends HexagonalGrid {
	/**
	 * Get a border polygon based on the width and height of a given token for
	 * the alternate orientation.
	 * @param {number} w  The width of the token in hexes.
	 * @param {number} h  The height of the token in hexes.
	 * @param {number} p  The padding size in pixels.
	 * @returns {number[]|null}
	 */
	getAltBorderPolygon(w, h, p) {
		// Flip the points if it's alternate orientation
		// this is the only real change from the foundry default
		const points = (
			this.columnar ? this.constructor.FLAT_HEX_BORDERS[w] : this.constructor.POINTY_HEX_BORDERS[w]
		).map(p => [1 - p[0], 1 - p[1]]);

		if (w !== h || !points) return null;
		const p2 = p / 2;
		const p4 = p / 4;
		({ width: w, height: h } = this.getRect(w, h));
		return this.getPolygon(-p4, -p4, w + p2, h + p2, points);
	}

	/**
	 * Implement special rules for snapping tokens of various sizes on a hex grid.
	 * @param {number} x     The X co-ordinate of the hexagon's top-left bounding box.
	 * @param {number} y     The Y co-ordinate of the hexagon's top-left bounding box.
	 * @param {Token} token  The token.
	 * @returns {[number, number]}
	 * @protected
	 */
	_adjustSnapForTokenSize(x, y, token) {
		if (token.document.height !== token.document.width)
			return super._adjustSnapForTokenSize(x, y, token);
		// Are we using alternate orentation? 1 = yes, 0 = no
		const alt_shape = isAltOrientation(token) ? 1 : 0;
		/** @type {number | undefined} */
		const token_size =
			token.document.width === token.document.height ? token.document.width : undefined;
		if (token_size <= 1) return super._adjustSnapForTokenSize(x, y, token);
		// Set grid offset based on size and orientation
		const shift_val = Math.floor((token_size + alt_shape - 1) / 2) % 2;
		if (this.columnar) y -= (shift_val * this.h) / 2;
		else x -= (shift_val * this.w) / 2;
		return [x, y];
	}

	/**
	 * Implement special rules for determining the grid position of tokens of various sizes on a hex grid.
	 * @param {number} row          The row number.
	 * @param {number} col          The column number.
	 * @param {Token} token         The token.
	 * @returns {[number, number]}  The adjusted row and column number.
	 * @protected
	 */
	_adjustPositionForTokenSize(row, col, token) {
		if (this.columnar && token.document.height > 2) row++;
		if (!this.columnar && token.document.width > 2) col++;
		return [row, col];
	}

	/** @override
	 * @param {number} x
	 * @param {number} y
	 * @param {number} interval
	 * @param {object} obj
	 * @param {Token} obj.token
	 */
	getSnappedPosition(x, y, interval = 1, { token } = {}) {
		// Use the default behavior if we're not snapping a token
		if (!token) return super.getSnappedPosition(x, y, interval, { token });

		// Are we using alternate orentation? 1 = yes, 0 = no
		const alt_shape = isAltOrientation(token) ? 1 : 0;
		/** @type {number | undefined} */
		const token_size =
			token.document.width === token.document.height ? token.document.width : undefined;
		if (token_size === undefined || token_size <= 1)
			return super.getSnappedPosition(x, y, interval, { token });
		// Set grid offset based on size and orientation
		const shift_val = Math.floor((token_size + alt_shape - 1) / 2) % 2;
		if (this.columnar) y += (shift_val * this.h) / 2;
		else x += (shift_val * this.w) / 2;
		const [r0, c0] = this._getGridPositionFromPixels(x, y, "round");
		let [x0, y0] = this.getPixelsFromGridPosition(r0, c0);
		[x0, y0] = this._adjustSnapForTokenSize(x0, y0, token);
		return { x: x0, y: y0 };
	}
}
