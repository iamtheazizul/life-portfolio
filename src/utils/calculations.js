import { ROW_CARD_ZONE, ROW_GAP, DRAWER_GAP } from "./constants";
import { colsForWidth } from "./pathUtils";

export function computeRowInfo(rows, cols, colWidth, milestones) {
  const info = [];
  for (let r = 0; r < rows; r++) {
    const items = [];
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const m = milestones[i];
      if (!m) continue;
      const reversed = r % 2 === 1;
      const col = reversed ? cols - 1 - c : c;
      items.push({ m, index: i, dotX: colWidth * (col + 0.5) });
    }
    info.push(items);
  }
  return info;
}

export function computeRowTops(rows, expandedByRow, drawerHeights) {
  const tops = [20];
  for (let r = 0; r < rows; r++) {
    const hasDrawer = expandedByRow[r].length > 0;
    const drawerH = hasDrawer ? drawerHeights[r] || 90 : 0;
    const extra = hasDrawer ? drawerH + DRAWER_GAP * 2 : 0;
    tops.push(tops[r] + ROW_CARD_ZONE + extra + ROW_GAP);
  }
  return tops;
}

export function computeTargetPositions(milestones, cols, colWidth, rowTops) {
  return milestones.map((_, i) => {
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    const reversed = row % 2 === 1;
    const col = reversed ? cols - 1 - colInRow : colInRow;
    return { x: colWidth * (col + 0.5), y: rowTops[row] };
  });
}