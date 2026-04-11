/**
 * @file Board model and canvas rendering for a rectangular pointy-top hex grid
 *       stored in classical column / row coordinates (odd-r offset layout).
 */

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

/** Internal axial coordinates used only for geometry (pointy-top hex math). */
type Axial = {
	q: number;
	r: number;
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

/**
 * @brief Converts odd-r offset (column, row) to axial coordinates.
 * @param col Zero-based column.
 * @param row Zero-based row.
 * @returns Axial `(q, r)` for pointy-top hex layout.
 */
function offsetToAxialOddR(col: number, row: number): Axial {
	const q = col - (row - (row & 1)) / 2;
	const r = row;
	return { q, r };
}

/**
 * @brief Converts axial coordinates to odd-r offset (column, row).
 * @param q Axial q.
 * @param r Axial r (equals row in odd-r layout).
 * @returns Integer column and row; caller should validate bounds against the board.
 */
function axialToOffsetOddR(q: number, r: number): BoardCell {
	const col = q + (r - (r & 1)) / 2;
	const row = r;
	return { col, row };
}

/**
 * @brief Creates a rectangular board: every `(col, row)` in range is one hex cell.
 * @param hexSize Distance from hex center to corner (pixels).
 * @param cols Number of columns.
 * @param rows Number of rows.
 * @returns New `Board` object.
 */
export function createBoard(
	hexSize: number,
	cols: number,
	rows: number,
): Board {
	const hexes: BoardCell[][] = [];
	for (let col = 0; col < cols; col++) {
		hexes[col] = [];
		for (let row = 0; row < rows; row++) {
			hexes[col][row] = { col, row };
		}
	}
	return { hexSize, cols, rows, hexes };
}

/** Live board used by the canvas; updated when `initiateTable` runs. */
export const board: Board = createBoard(28, 10, 8);

/**
 * @brief Maps axial coordinates to pixel offset from the grid’s mathematical origin.
 * @param q Axial q.
 * @param r Axial r.
 * @param size Hex outer radius (center to vertex).
 * @returns Pixel offset `(x, y)` for a pointy-top hex center.
 */
function axialToPixel(
	q: number,
	r: number,
	size: number,
): { x: number; y: number } {
	const x = size * Math.sqrt(3) * (q + r / 2);
	const y = size * (3 / 2) * r;
	return { x, y };
}

/**
 * @brief Rounds fractional cube coordinates to the nearest integer hex in axial form.
 * @param q Fractional cube q.
 * @param r Fractional cube r.
 * @param s Fractional cube s with constraint q + r + s = 0.
 * @returns Nearest axial coordinates.
 */
function cubeRound(q: number, r: number, s: number): Axial {
	let rq = Math.round(q);
	let rr = Math.round(r);
	const rs = Math.round(s);

	const qDiff = Math.abs(rq - q);
	const rDiff = Math.abs(rr - r);
	const sDiff = Math.abs(rs - s);

	if (qDiff > rDiff && qDiff > sDiff) {
		rq = -rr - rs;
	} else if (rDiff > sDiff) {
		rr = -rq - rs;
	}
	return { q: rq, r: rr };
}

/**
 * @brief Converts pixel offset (same space as `axialToPixel`) to the nearest axial hex.
 * @param x Horizontal offset from origin.
 * @param y Vertical offset from origin.
 * @param size Hex outer radius (must match layout).
 * @returns Axial indices of the hex containing `(x, y)`.
 */
function pixelToAxial(x: number, y: number, size: number): Axial {
	const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / size;
	const r = ((2 / 3) * y) / size;
	const s = -q - r;
	return cubeRound(q, r, s);
}

/**
 * @brief Appends a pointy-top regular hex path centered at `(cx, cy)`.
 * @param ctx Canvas 2D context.
 * @param cx Center x in CSS pixels.
 * @param cy Center y in CSS pixels.
 * @param size Hex outer radius.
 */
function drawHexPath(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	size: number,
): void {
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
}

type Layout = {
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	originX: number;
	originY: number;
};

/**
 * @brief Matches canvas backing store to its CSS size and returns a drawing layout.
 * @param canvas Target canvas element.
 * @returns Context, dimensions, and center point in CSS pixel space.
 */
function ensureCanvasBackingStore(canvas: HTMLCanvasElement): Layout {
	const dpr = window.devicePixelRatio || 1;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needW = Math.max(1, Math.floor(width * dpr));
	const needH = Math.max(1, Math.floor(height * dpr));
	if (canvas.width !== needW || canvas.height !== needH) {
		canvas.width = needW;
		canvas.height = needH;
	}
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("2D context unavailable");
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	const originX = width / 2;
	const originY = height / 2;
	return { ctx, width, height, originX, originY };
}

/**
 * @brief Computes the center of all hex centers in pixel space (axial layout, before view pan).
 * @returns Midpoint used to center the rectangular grid on the canvas.
 */
function getGridCenterOffset(): { x: number; y: number } {
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
}

/**
 * @brief Clears the canvas and draws every board hex using the current `board` state.
 * @param layout Output of `ensureCanvasBackingStore` for the active canvas.
 */
function renderBoard(layout: Layout): void {
	const { ctx, width, height, originX, originY } = layout;
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
			const cx = originX + x - mid.x;
			const cy = originY + y - mid.y;
			drawHexPath(ctx, cx, cy, board.hexSize);
			ctx.fill();
			ctx.stroke();
		}
	}
}

let boundCanvas: HTMLCanvasElement | null = null;
let resizeListener: (() => void) | null = null;
let clickListener: ((ev: MouseEvent) => void) | null = null;

/**
 * @brief Repaints the board on the canvas last passed to `initiateTable`.
 */
function repaintBoard(): void {
	if (!boundCanvas) {
		return;
	}
	const layout = ensureCanvasBackingStore(boundCanvas);
	renderBoard(layout);
}

/**
 * @brief Maps a click to a cell and logs when the hit cell exists on the board.
 * @param ev Mouse click event from the board canvas.
 */
function onBoardCanvasClick(ev: MouseEvent): void {
	const canvas = boundCanvas;
	if (!canvas) {
		return;
	}
	const rect = canvas.getBoundingClientRect();
	const mx = ev.clientX - rect.left;
	const my = ev.clientY - rect.top;
	const scaleX = canvas.clientWidth / rect.width;
	const scaleY = canvas.clientHeight / rect.height;
	const relX = (mx - rect.width / 2) * scaleX;
	const relY = (my - rect.height / 2) * scaleY;
	const mid = getGridCenterOffset();
	const { q, r } = pixelToAxial(relX + mid.x, relY + mid.y, board.hexSize);
	const { col, row } = axialToOffsetOddR(q, r);
	const cell = getCell(board, [col, row]);
	if (cell) {
		console.log(
			`hex click: col=${col}, row=${row}, index=[${col}, ${row}]`,
		);
	}
}

/**
 * @brief Attaches the board to a canvas: sizing, paint loop, and hit-testing.
 * @param canvas Game canvas element (should already be in the DOM for correct layout reads).
 */
export function initiateTable(canvas: HTMLCanvasElement): Board {
	Object.assign(board, createBoard(board.hexSize, board.cols, board.rows));

	if (boundCanvas && resizeListener) {
		window.removeEventListener("resize", resizeListener);
	}
	if (boundCanvas && clickListener) {
		boundCanvas.removeEventListener("click", clickListener);
	}
	boundCanvas = canvas;

	resizeListener = () => {
		repaintBoard();
	};
	window.addEventListener("resize", resizeListener);

	clickListener = onBoardCanvasClick;
	canvas.addEventListener("click", clickListener);

	repaintBoard();
	return board;
}
