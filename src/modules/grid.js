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

export function rotateBadHexes() {
	const pointy_borders = foundry.utils.deepClone(HexagonalGrid.POINTY_HEX_BORDERS);
	const flat_borders = foundry.utils.deepClone(HexagonalGrid.FLAT_HEX_BORDERS);

	pointy_borders[2] = pointy_borders[2].map(p => [p[0], 1 - p[1]]);
	HexagonalGrid.POINTY_HEX_BORDERS = pointy_borders;
	flat_borders[2] = flat_borders[2].map(p => [1 - p[0], p[1]]);
	HexagonalGrid.FLAT_HEX_BORDERS = flat_borders;
}

/**
 * Improve border support for hexagonal grids
 */
class HSSHexagonalGrid extends HexagonalGrid {
	/**
	 * Implement special rules for snapping tokens of various sizes on a hex grid.
	 * @param {number} x     The X co-ordinate of the hexagon's top-left bounding box.
	 * @param {number} y     The Y co-ordinate of the hexagon's top-left bounding box.
	 * @param {Token} token  The token.
	 * @returns {[number, number]}
	 * @protected
	 */
	_adjustSnapForTokenSize(x, y, token) {
		if (token.document.height == 2 && token.document.width == 2) {
			return [x, y];
		}
		return super._adjustSnapForTokenSize(x, y, token);
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
	 * @param {Token} token
	 */
	getSnappedPosition(x, y, interval = 1, { token } = {}) {
		return super.getSnappedPosition(x, y, interval, { token });
	}
}
