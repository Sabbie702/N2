// calculatorMath.js — Quilt Calculator utility functions

/** Inches → yards, rounded up to nearest 1/8 yard */
export function inchesToYards(inches) {
  const yards = inches / 36;
  return Math.ceil(yards * 8) / 8;
}

/**
 * Block Calculator
 * How many blocks needed to fill a quilt, and how much fabric per color.
 */
export function calcBlocks({ quiltWidth, quiltHeight, blockSize, seamAllowance = 0.25 }) {
  const finishedBlock = blockSize;
  const cuttingBlock  = blockSize + seamAllowance * 2;
  const blocksWide  = Math.ceil(quiltWidth  / finishedBlock);
  const blocksTall  = Math.ceil(quiltHeight / finishedBlock);
  const totalBlocks = blocksWide * blocksTall;
  return { blocksWide, blocksTall, totalBlocks, cuttingBlock };
}

/**
 * Yardage Calculator
 * How much fabric to buy for a given number of identical cut pieces.
 */
export function calcYardage({
  pieceWidth,
  pieceHeight,
  numPieces,
  fabricWidth = 44,
  seamAllowance = 0.25,
  bufferPct = 10,
}) {
  const w = pieceWidth  + seamAllowance * 2;
  const h = pieceHeight + seamAllowance * 2;
  const piecesPerRow = Math.floor(fabricWidth / w);
  if (piecesPerRow < 1) return null; // piece wider than fabric
  const rowsNeeded  = Math.ceil(numPieces / piecesPerRow);
  const rawInches   = rowsNeeded * h;
  const withBuffer  = rawInches * (1 + bufferPct / 100);
  return {
    piecesPerRow,
    rowsNeeded,
    yards: inchesToYards(withBuffer),
    rawInches,
  };
}

/**
 * Backing Calculator
 * Yardage for quilt backing with overlap on all sides.
 */
export function calcBacking({ quiltWidth, quiltHeight, overlap = 4, fabricWidth = 44 }) {
  const targetW = quiltWidth  + overlap * 2;
  const targetH = quiltHeight + overlap * 2;

  if (targetW <= fabricWidth) {
    // Single width — just one length
    return { panels: 1, yards: inchesToYards(targetH), seams: 0 };
  }

  // Need to seam panels side by side
  const panels = Math.ceil(targetW / fabricWidth);
  const totalLength = targetH * panels;
  return { panels, yards: inchesToYards(totalLength), seams: panels - 1 };
}

/**
 * Binding Calculator
 * Yardage for double-fold straight-grain binding.
 */
export function calcBinding({ quiltWidth, quiltHeight, stripWidth = 2.5, fabricWidth = 44 }) {
  const perimeter      = 2 * (quiltWidth + quiltHeight);
  const extra          = 20; // joining + corners
  const totalNeeded    = perimeter + extra;
  const usableStrip    = fabricWidth - 0.5; // seam waste on each strip
  const stripsNeeded   = Math.ceil(totalNeeded / usableStrip);
  const rawInches      = stripsNeeded * stripWidth;
  return {
    stripsNeeded,
    yards: inchesToYards(rawInches),
    totalBinding: Math.round(totalNeeded),
  };
}
