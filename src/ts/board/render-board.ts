import { PointingDirection } from "../game-information/buildings";
import { gameStatesGlobal } from "../game-information/gameStatesStore";
import {
	axialToPixel,
	Board,
	getGridCenterOffset,
	getHoveredCell,
	getLastClickedCell,
	offsetToAxialOddR,
} from "./the-board";

function parseHexColor(
	hex: string,
): { r: number; g: number; b: number } | null {
	const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
	if (!m) {
		return null;
	}
	let s = m[1]!.toLowerCase();
	if (s.length === 3) {
		s = s
			.split("")
			.map((c) => c + c)
			.join("");
	}
	const r = Number.parseInt(s.slice(0, 2), 16);
	const g = Number.parseInt(s.slice(2, 4), 16);
	const b = Number.parseInt(s.slice(4, 6), 16);
	return { r, g, b };
}

function mixWithWhite(hex: string, tint: number): string {
	const rgb = parseHexColor(hex);
	if (!rgb) {
		return "#e8eef5";
	}
	const t = Math.max(0, Math.min(1, tint));
	const r = Math.round(255 * (1 - t) + rgb.r * t);
	const g = Math.round(255 * (1 - t) + rgb.g * t);
	const b = Math.round(255 * (1 - t) + rgb.b * t);
	return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Outward unit vector for each hex-neighbor direction (canvas coords, +y down),
 * consistent with `axialToPixel` / odd-r layout.
 */
function pointingDirectionUnit(
	dir: PointingDirection,
): { x: number; y: number } | null {
	if (dir === null) {
		return null;
	}
	const h = Math.sqrt(3) / 2;
	switch (dir) {
		case "right":
			return { x: 1, y: 0 };
		case "left":
			return { x: -1, y: 0 };
		case "upRight":
			return { x: 0.5, y: -h };
		case "upLeft":
			return { x: -0.5, y: -h };
		case "downRight":
			return { x: 0.5, y: h };
		case "downLeft":
			return { x: -0.5, y: h };
		default:
			return null;
	}
}

/** Flat isosceles triangle on the hovered hex: base on the outer edge facing `dir`, apex inward toward center. */
function drawPointingDirectionMarker(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	size: number,
	dir: PointingDirection,
): void {
	const u = pointingDirectionUnit(dir);
	if (!u) {
		return;
	}
	const len = Math.hypot(u.x, u.y);
	const ux = u.x / len;
	const uy = u.y / len;

	const apothem = size * (Math.sqrt(3) / 2);
	const triH = size * 0.22;
	const halfBase = size * 0.24;
	const tx = -uy;
	const ty = ux;

	const edgeMidX = cx + apothem * ux;
	const edgeMidY = cy + apothem * uy;
	/** Apex sits inside the hex, pointing toward the center (base stays on the outer edge). */
	const apexX = edgeMidX - triH * ux;
	const apexY = edgeMidY - triH * uy;
	const b1x = edgeMidX + halfBase * tx;
	const b1y = edgeMidY + halfBase * ty;
	const b2x = edgeMidX - halfBase * tx;
	const b2y = edgeMidY - halfBase * ty;

	ctx.beginPath();
	ctx.moveTo(apexX, apexY);
	ctx.lineTo(b1x, b1y);
	ctx.lineTo(b2x, b2y);
	ctx.closePath();
	ctx.fillStyle = "rgba(255, 180, 60, 0.95)";
	ctx.strokeStyle = "#b45309";
	ctx.lineWidth = 1.25;
	ctx.fill();
	ctx.stroke();
}

/**
 * Arrow along `dir`: default shaft from center outward; when `reverse`, shaft from edge inward (market “pulls” from neighbor).
 */
function drawBuildingDirectionArrow(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	size: number,
	dir: PointingDirection,
	reverse: boolean,
): void {
	const u = pointingDirectionUnit(dir);
	if (!u) {
		return;
	}
	const uLen = Math.hypot(u.x, u.y);
	const ux = u.x / uLen;
	const uy = u.y / uLen;

	const apothem = size * (Math.sqrt(3) / 2);
	const shaftEndDist = apothem * 0.78;
	const headLength = size * 0.22;
	const headHalfWidth = size * 0.14;
	const px = -uy;
	const py = ux;

	ctx.save();
	ctx.strokeStyle = "#1d4ed8";
	ctx.fillStyle = "#1d4ed8";
	ctx.lineWidth = Math.max(3, size * 0.14);
	ctx.lineCap = "round";
	ctx.lineJoin = "round";

	if (!reverse) {
		const tipX = cx + ux * shaftEndDist;
		const tipY = cy + uy * shaftEndDist;
		const baseX = tipX - ux * headLength;
		const baseY = tipY - uy * headLength;

		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.lineTo(baseX, baseY);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(tipX, tipY);
		ctx.lineTo(baseX + px * headHalfWidth, baseY + py * headHalfWidth);
		ctx.lineTo(baseX - px * headHalfWidth, baseY - py * headHalfWidth);
		ctx.closePath();
		ctx.fill();
	} else {
		const outerX = cx + ux * shaftEndDist;
		const outerY = cy + uy * shaftEndDist;
		const apexDistFromCenter = size * 0.18;
		const apexX = cx + ux * apexDistFromCenter;
		const apexY = cy + uy * apexDistFromCenter;
		const baseMidX = apexX + ux * headLength;
		const baseMidY = apexY + uy * headLength;

		ctx.beginPath();
		ctx.moveTo(outerX, outerY);
		ctx.lineTo(baseMidX, baseMidY);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(apexX, apexY);
		ctx.lineTo(
			baseMidX + px * headHalfWidth,
			baseMidY + py * headHalfWidth,
		);
		ctx.lineTo(
			baseMidX - px * headHalfWidth,
			baseMidY - py * headHalfWidth,
		);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
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

	const { ctx, width, height, originX, originY } =
		ensureCanvasBackingStore(canvas);
	const mid = getGridCenterOffset(board);

	ctx.clearRect(0, 0, width, height);
	ctx.strokeStyle = "#2a3f55";
	ctx.fillStyle = "#e8eef5";
	ctx.lineWidth = 1.5;

	for (let col = 0; col < board.cols; col++) {
		for (let row = 0; row < board.rows; row++) {
			const cell = board.hexes[col]![row]!;
			const [cellCol, cellRow] = cell.index;
			const { q, r } = offsetToAxialOddR(cellCol, cellRow);
			const { x, y } = axialToPixel(q, r, board.hexSize);
			// grid-space -> canvas: translate to canvas center, then subtract grid midpoint.
			const cx = originX + x - mid.x;
			const cy = originY + y - mid.y;

			const lastClickedCell = getLastClickedCell();
			const clicked =
				lastClickedCell?.[0] === cellCol &&
				lastClickedCell?.[1] === cellRow;

			const hoveredCell = getHoveredCell();
			const hovered =
				hoveredCell?.[0] === cellCol && hoveredCell?.[1] === cellRow;

			if (clicked) {
				ctx.fillStyle = "#cfe6ff";
				ctx.strokeStyle = "#1f6feb";
				ctx.lineWidth = 2.5;
			} else if (hovered) {
				ctx.fillStyle = "#dff3ff";
				ctx.strokeStyle = "#2f81f7";
				ctx.lineWidth = 2;
			} else {
				ctx.fillStyle = cell.resourceOre
					? mixWithWhite(cell.resourceOre.resourceColour, 0.15)
					: "#e8eef5";
				ctx.strokeStyle = "#2a3f55";
				ctx.lineWidth = 1.5;
			}

			drawHexPath(ctx, cx, cy, board.hexSize);
			ctx.fill();
			ctx.stroke();

			if (cell.building) {
				const dir = cell.building.pointingDirection;
				if (dir != null) {
					drawBuildingDirectionArrow(
						ctx,
						cx,
						cy,
						board.hexSize,
						dir,
						cell.building.name === "market",
					);
				}
				ctx.save();
				ctx.fillStyle = "#0b1a2b";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = `600 ${Math.max(10, Math.floor(board.hexSize * 0.65))}px system-ui`;
				ctx.fillText(cell.building.mapIcon, cx, cy);
				ctx.restore();
			}

			if (cell.resourceOre) {
				ctx.save();
				ctx.fillStyle = cell.resourceOre.resourceColour;
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.font = "600 9px system-ui";
				ctx.fillText(
					cell.resourceOre.shortName,
					cx,
					cy - board.hexSize * 0.62,
				);
				ctx.restore();
			}

			if (hovered && gameStatesGlobal.pointingDirection !== null) {
				ctx.save();
				drawPointingDirectionMarker(
					ctx,
					cx,
					cy,
					board.hexSize,
					gameStatesGlobal.pointingDirection,
				);
				ctx.restore();
			}
		}
	}
}
