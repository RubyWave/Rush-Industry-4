/**
 * @file Board model and canvas rendering for a rectangular pointy-top hex grid
 *       stored in classical column / row coordinates (odd-r offset layout).
 */

import {
	BuildingBlueprint,
	PointingDirection,
} from "../buildings.ts/buildings";
import { TheBuilding } from "../buildings.ts/the-building";
import { Resource } from "../game-information/resources";
import { settings } from "../game-information/settings";
import { gameCanvas } from "../game-set-up";
import { buildBuilding } from "./build-building";
import { renderBoard } from "./render-board";

/**
 * @brief Board address as a tuple: `[column, row]` matches `hexes[col][row]`.
 */
export type CellIndex = readonly [column: number, row: number];

/** One cell on the board: grid index and optional building. */
export type BoardCell = {
	/** Cell position `[column, row]` on the board. */
	index: CellIndex;
	building: TheBuilding | null;
	buildingBlueprint: BuildingBlueprint | null;
	resourceOre: Resource | null;
};

type Axial = { q: number; r: number };
type Cube = { x: number; y: number; z: number };

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

/**
 * Checks if two cell indices are equal.
 * @param index1 The first cell index.
 * @param index2 The second cell index.
 * @returns True if the cell indices are equal, false otherwise.
 */
export function isEqualCellIndex(
	index1: CellIndex,
	index2: CellIndex,
): boolean {
	return index1[0] === index2[0] && index1[1] === index2[1];
}

/** Odd-r offset -> axial. Keeps storage rectangular while using axial for geometry. */
export function offsetToAxialOddR(col: number, row: number): Axial {
	const q = col - (row - (row & 1)) / 2;
	const r = row;
	return { q, r };
}

/** Axial -> odd-r offset (inverse of `offsetToAxialOddR`). */
function axialToOffsetOddR(q: number, r: number): { col: number; row: number } {
	const row = r;
	const col = q + (row - (row & 1)) / 2;
	return { col, row };
}

/**
 * Axial step to the hex neighbor in `dir` (same convention as `pointingDirectionUnit`).
 */
function pointingDirectionToAxialDelta(dir: Exclude<PointingDirection, null>): {
	dq: number;
	dr: number;
} {
	switch (dir) {
		case "right":
			return { dq: 1, dr: 0 };
		case "left":
			return { dq: -1, dr: 0 };
		case "upRight":
			return { dq: 1, dr: -1 };
		case "upLeft":
			return { dq: 0, dr: -1 };
		case "downRight":
			return { dq: 0, dr: 1 };
		case "downLeft":
			return { dq: -1, dr: 1 };
	}
}

/**
 * Neighbor of `index` in direction `dir`, or `null` if `dir` is null or outside the board.
 */
export function getNeighborCellIndex(
	board: Board,
	index: CellIndex,
	dir: PointingDirection,
): CellIndex | null {
	if (dir === null) {
		return null;
	}
	const [col, row] = index;
	const { q, r } = offsetToAxialOddR(col, row);
	const { dq, dr } = pointingDirectionToAxialDelta(dir);
	const { col: ncol, row: nrow } = axialToOffsetOddR(q + dq, r + dr);
	if (ncol < 0 || ncol >= board.cols || nrow < 0 || nrow >= board.rows) {
		return null;
	}
	return [ncol, nrow];
}

/**
 * Neighbor `BoardCell` in direction `dir`, or `undefined` if off-board or `dir` is null.
 */
export function getNeighborCell(
	board: Board,
	index: CellIndex,
	dir: PointingDirection,
): BoardCell | undefined {
	const next = getNeighborCellIndex(board, index, dir);
	if (!next) {
		return undefined;
	}
	return getCell(board, next);
}

/**
 * Returns all neighboring cells around a given cell (up to 6, fewer on edges).
 */
export function getAllNeighborCells(
	board: Board,
	index: CellIndex,
): BoardCell[] {
	const dirs: readonly Exclude<PointingDirection, null>[] = [
		"right",
		"left",
		"upRight",
		"upLeft",
		"downRight",
		"downLeft",
	];

	const neighbors: BoardCell[] = [];
	for (const dir of dirs) {
		const n = getNeighborCell(board, index, dir);
		if (n) {
			neighbors.push(n);
		}
	}
	return neighbors;
}

/**
 * Axial -> pixel center in "grid space".
 * Pointy-top hex geometry (outer radius = `size`): x step is \(\sqrt{3} * size\),
 * y step is \(1.5 * size\). The `r/2` term staggers columns.
 */
export function axialToPixel(
	q: number,
	r: number,
	size: number,
): { x: number; y: number } {
	const x = size * Math.sqrt(3) * (q + r / 2);
	const y = size * (3 / 2) * r;
	return { x, y };
}

/** Pixel (grid space) -> axial (fractional), pointy-top. */
function pixelToAxialPointy(
	x: number,
	y: number,
	size: number,
): { q: number; r: number } {
	const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / size;
	const r = ((2 / 3) * y) / size;
	return { q, r };
}

function axialToCube(q: number, r: number): Cube {
	const x = q;
	const z = r;
	const y = -x - z;
	return { x, y, z };
}

function cubeToAxial(c: Cube): Axial {
	return { q: c.x, r: c.z };
}

/** Rounds fractional cube coords to the nearest hex. */
function cubeRound(c: Cube): Cube {
	let rx = Math.round(c.x);
	let ry = Math.round(c.y);
	let rz = Math.round(c.z);

	const dx = Math.abs(rx - c.x);
	const dy = Math.abs(ry - c.y);
	const dz = Math.abs(rz - c.z);

	if (dx > dy && dx > dz) {
		rx = -ry - rz;
	} else if (dy > dz) {
		ry = -rx - rz;
	} else {
		rz = -rx - ry;
	}

	return { x: rx, y: ry, z: rz };
}

function createBoardCells(): BoardCell[][] {
	const hexes: BoardCell[][] = [];
	for (let col = 0; col < settings.board.cols; col++) {
		hexes[col] = [];
		for (let row = 0; row < settings.board.rows; row++) {
			hexes[col][row] = {
				index: [col, row],
				building: null,
				buildingBlueprint: null,
				resourceOre: null,
			};
		}
	}
	return hexes;
}

function placeResourceOres(board: Board): Board {
	const resourceOres = settings.board.resourcesOres;
	resourceOres.forEach((resourceOre) => {
		let leftCellsAmmount = board.cols * board.rows;
		board.hexes.forEach((r) => {
			r.forEach((cell) => {
				leftCellsAmmount--;
				if (cell.resourceOre) return;
				if (resourceOre.tiles <= 0) return;
				let resourceSpawnChance =
					1 /
					(leftCellsAmmount -
						(resourceOre.tiles > 0 ? resourceOre.tiles : 0));

				// tries to put ores in patches
				const orePatch = getAllNeighborCells(board, cell.index).find(
					(c) => c.resourceOre === resourceOre.resource,
				)
					? true
					: false;
				if (orePatch) resourceSpawnChance *= 2;

				// TODO: see why ores likes to spawn so much at the left side of the board.

				// spawn chance is approaching 1 to force spawning.
				if (Math.random() < resourceSpawnChance) {
					cell.resourceOre = resourceOre.resource;
					resourceOre.tiles--; // to limit how much of the resource will spawn
				}
			});
		});
	});

	return board;
}

/**
 * Returns the midpoint of all hex centers in grid space. Subtracting this value
 * recenters the board so it doesn't drift when `cols/rows` change.
 */
export function getGridCenterOffset(board: Board): { x: number; y: number } {
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

let lastClickedCell: CellIndex | null = null;
let hoveredCell: CellIndex | null = null;

/** Set in `initiateBoard` so `redrawBoard` can repaint after global UI state (e.g. direction) changes. */
let activeBoard: Board | null = null;

export function getLastClickedCell(): CellIndex | null {
	return lastClickedCell;
}

export function getHoveredCell(): CellIndex | null {
	return hoveredCell;
}

/** Repaint the board after changes that are not triggered by canvas events (e.g. keyboard direction). */
export function redrawBoard(): void {
	if (activeBoard) {
		renderBoard(activeBoard, gameCanvas);
	}
}

/**
 * Converts a mouse position (client coords) to a board cell index, using:
 * canvas click -> grid-space pixel -> axial -> cube-round -> odd-r offset.
 */
export function canvasPointToCellIndex(
	board: Board,
	canvas: HTMLCanvasElement,
	clientX: number,
	clientY: number,
): CellIndex | null {
	const rect = canvas.getBoundingClientRect();
	const clickX = clientX - rect.left;
	const clickY = clientY - rect.top;

	const originX = canvas.clientWidth / 2;
	const originY = canvas.clientHeight / 2;
	const mid = getGridCenterOffset(board);

	const xGrid = clickX - originX + mid.x;
	const yGrid = clickY - originY + mid.y;

	const { q, r } = pixelToAxialPointy(xGrid, yGrid, board.hexSize);
	const rounded = cubeRound(axialToCube(q, r));
	const axial = cubeToAxial(rounded);
	const { col, row } = axialToOffsetOddR(axial.q, axial.r);

	if (col < 0 || col >= board.cols || row < 0 || row >= board.rows) {
		return null;
	}
	return [col, row];
}

export function initiateBoard() {
	const board: Board = {
		hexSize: settings.board.hexSize,
		cols: settings.board.cols,
		rows: settings.board.rows,
		hexes: createBoardCells(),
	};
	activeBoard = board;
	activeBoard = placeResourceOres(activeBoard);
	renderBoard(board, gameCanvas);
	return board;
}

export function bindBoardClick(
	board: Board,
	canvas: HTMLCanvasElement,
): () => void {
	const onClick = (event: MouseEvent): void => {
		const index = canvasPointToCellIndex(
			board,
			canvas,
			event.clientX,
			event.clientY,
		);
		if (!index) {
			return;
		}
		buildBuilding(index);
		lastClickedCell = index;
		renderBoard(board, canvas);
	};

	const onMouseMove = (event: MouseEvent): void => {
		const index = canvasPointToCellIndex(
			board,
			canvas,
			event.clientX,
			event.clientY,
		);

		const sameAsCurrent =
			(index === null && hoveredCell === null) ||
			(index !== null &&
				hoveredCell !== null &&
				index[0] === hoveredCell[0] &&
				index[1] === hoveredCell[1]);
		if (sameAsCurrent) {
			return;
		}

		hoveredCell = index;
		renderBoard(board, canvas);
	};

	const onMouseLeave = (): void => {
		if (!hoveredCell) {
			return;
		}
		hoveredCell = null;
		renderBoard(board, canvas);
	};

	canvas.addEventListener("click", onClick);
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mouseleave", onMouseLeave);
	return () => {
		canvas.removeEventListener("click", onClick);
		canvas.removeEventListener("mousemove", onMouseMove);
		canvas.removeEventListener("mouseleave", onMouseLeave);
	};
}
