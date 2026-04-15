/**
 * @file Board model and canvas rendering for a rectangular pointy-top hex grid
 *       stored in classical column / row coordinates (odd-r offset layout).
 */

import { settings } from "./game-information/settings";
import { gameCanvas } from "./game-set-up";

/** One cell on the board: zero-based column and row indices. */
export type BoardCell = {
	/** Zero-based column index. */
	col: number;
	/** Zero-based row index. */
	row: number;
};

/**
 * @brief Board address as a tuple: `[column, row]` matches `hexes[col][row]`.
 */
export type CellIndex = readonly [column: number, row: number];

/**
 * @brief Rectangular-ish hex board: every cell is a hex; layout uses odd-r offset.
 */
export type Board = {
	/** Distance from hex center to any corner (pixels in layout space). */
	hexSize: number;
	/** Number of columns (width of the rectangle in cells). */
	cols: number;
	/** Number of rows (height of the rectangle in cells). */
	rows: number;
	/** Column-major grid: `hexes[col][row]` for `0 <= col < cols`, `0 <= row < rows`. */
	hexes: BoardCell[][];
};

/**
 * @brief Returns the cell at a tuple index `[column, row]`, if present.
 * @param b Board instance.
 * @param index Tuple `[col, row]`.
 * @returns The `BoardCell` or `undefined` when out of range.
 */
export function getCell(b: Board, index: CellIndex): BoardCell | undefined {
	const [col, row] = index;
	return b.hexes[col]?.[row];
}

function createBoardCells(): BoardCell[][] {
	const hexes: BoardCell[][] = [];
	for (let col = 0; col < settings.board.cols; col++) {
		hexes[col] = [];
		for (let row = 0; row < settings.board.rows; row++) {
			hexes[col][row] = { col, row };
		}
	}
	return hexes;
}

export function renderBoard(board: Board, canvas: HTMLCanvasElement) {
	/**
	 * Rendering pipeline overview:
	 * - Game logic indexes hexes in "odd-r offset" grid coordinates `(col,row)`.
	 * - We convert `(col,row)` -> axial `(q,r)` (pointy-top layout math),
	 *   then axial -> pixel offsets in a "grid space" where `(0,0)` is an arbitrary origin.
	 * - We compute the grid's bounding-box center in that same grid space and subtract it,
	 *   so the board stays centered on the canvas regardless of board dimensions.
	 * - Canvas is sized using DPR so the drawn lines look crisp on HiDPI screens.
	 */
	type Axial = { q: number; r: number };

	/** Odd-r offset -> axial. Keeps storage rectangular while using axial for geometry. */
	const offsetToAxialOddR = (col: number, row: number): Axial => {
		const q = col - (row - (row & 1)) / 2;
		const r = row;
		return { q, r };
	};

	/**
	 * Axial -> pixel center in "grid space".
	 * Pointy-top hex geometry (outer radius = `size`): x step is \(\sqrt{3} * size\),
	 * y step is \(1.5 * size\). The `r/2` term staggers columns.
	 */
	const axialToPixel = (
		q: number,
		r: number,
		size: number,
	): { x: number; y: number } => {
		const x = size * Math.sqrt(3) * (q + r / 2);
		const y = size * (3 / 2) * r;
		return { x, y };
	};

	/** Appends a pointy-top regular hex path centered at `(cx,cy)` in canvas CSS pixels. */
	const drawHexPath = (
		ctx: CanvasRenderingContext2D,
		cx: number,
		cy: number,
		size: number,
	): void => {
		ctx.beginPath();
		for (let i = 0; i < 6; i++) {
			const angle = -Math.PI / 2 + (i * Math.PI) / 3;
			const x = cx + size * Math.cos(angle);
			const y = cy + size * Math.sin(angle);
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.closePath();
	};

	/**
	 * Matches canvas backing store to CSS size, then sets a DPR transform so we can
	 * keep drawing in CSS pixel units (and still get crisp output).
	 */
	const ensureCanvasBackingStore = (
		target: HTMLCanvasElement,
	): {
		ctx: CanvasRenderingContext2D;
		width: number;
		height: number;
		originX: number;
		originY: number;
	} => {
		const dpr = window.devicePixelRatio || 1;
		const width = target.clientWidth;
		const height = target.clientHeight;
		const needW = Math.max(1, Math.floor(width * dpr));
		const needH = Math.max(1, Math.floor(height * dpr));
		if (target.width !== needW || target.height !== needH) {
			target.width = needW;
			target.height = needH;
		}
		const ctx = target.getContext("2d");
		if (!ctx) {
			throw new Error("2D context unavailable");
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		return { ctx, width, height, originX: width / 2, originY: height / 2 };
	};

	/**
	 * Returns the midpoint of all hex centers in grid space. Subtracting this value
	 * recenters the board so it doesn't drift when `cols/rows` change.
	 */
	const getGridCenterOffset = (): { x: number; y: number } => {
		let minX = Infinity;
		let maxX = -Infinity;
		let minY = Infinity;
		let maxY = -Infinity;
		for (let col = 0; col < board.cols; col++) {
			for (let row = 0; row < board.rows; row++) {
				const { q, r } = offsetToAxialOddR(col, row);
				const p = axialToPixel(q, r, board.hexSize);
				minX = Math.min(minX, p.x);
				maxX = Math.max(maxX, p.x);
				minY = Math.min(minY, p.y);
				maxY = Math.max(maxY, p.y);
			}
		}
		return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
	};

	const { ctx, width, height, originX, originY } =
		ensureCanvasBackingStore(canvas);
	const mid = getGridCenterOffset();

	ctx.clearRect(0, 0, width, height);
	ctx.strokeStyle = "#2a3f55";
	ctx.fillStyle = "#e8eef5";
	ctx.lineWidth = 1.5;

	for (let col = 0; col < board.cols; col++) {
		for (let row = 0; row < board.rows; row++) {
			const cell = board.hexes[col]![row]!;
			const { q, r } = offsetToAxialOddR(cell.col, cell.row);
			const { x, y } = axialToPixel(q, r, board.hexSize);
			// grid-space -> canvas: translate to canvas center, then subtract grid midpoint.
			const cx = originX + x - mid.x;
			const cy = originY + y - mid.y;
			drawHexPath(ctx, cx, cy, board.hexSize);
			ctx.fill();
			ctx.stroke();
		}
	}
}

export function initiateBoard() {
	const board: Board = {
		hexSize: settings.board.hexSize,
		cols: settings.board.cols,
		rows: settings.board.rows,
		hexes: createBoardCells(),
	};
	renderBoard(board, gameCanvas);
	return board;
}
