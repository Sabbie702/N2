// Calculator math functions for Nimble Needle quilting calculators

// ── BACKING & BATTING ────────────────────────────────────────────────────────
export function calcBacking(quiltW, quiltH, fabricType, quiltingMethod) {
  const extra = quiltingMethod === 'longarm' ? 8 : 4;
  const needW = quiltW + (extra * 2);
  const needH = quiltH + (extra * 2);

  let panels = 0;
  let totalYards = 0;
  let layoutNote = '';

  if (fabricType === 'wide') {
    panels = 1;
    totalYards = needH / 36;
    layoutNote = '1 panel of 108″ wide fabric — no seam';
  } else {
    const usable = 40;
    panels = Math.ceil(needW / usable);
    totalYards = (panels * needH) / 36;
    layoutNote = panels === 1
      ? '1 panel — no seam needed'
      : `${panels} panels sewn together lengthwise`;
  }

  const yardsBuy = Math.ceil(totalYards * 4) / 4;
  const battingName = suggestBatting(needW, needH);

  return {
    backingYards: yardsBuy,
    panels,
    layoutNote,
    battingW: needW,
    battingH: needH,
    battingSuggest: battingName,
  };
}

function suggestBatting(w, h) {
  if (w <= 45 && h <= 60) return 'Crib (45″ × 60″)';
  if (w <= 60 && h <= 60) return 'Throw (60″ × 60″)';
  if (w <= 72 && h <= 90) return 'Twin (72″ × 90″)';
  if (w <= 81 && h <= 96) return 'Full/Double (81″ × 96″)';
  if (w <= 90 && h <= 108) return 'Queen (90″ × 108″)';
  if (w <= 120 && h <= 120) return 'King (120″ × 120″)';
  return `Custom — buy off the bolt: at least ${w}″ wide × ${h}″ long`;
}

// ── BINDING ──────────────────────────────────────────────────────────────────
export function calcBinding(quiltW, quiltH, stripWidth = 2.5) {
  const perimeter = (quiltW * 2) + (quiltH * 2);
  const totalLength = perimeter + 12;
  const fabricWidth = 40;
  const numStrips = Math.ceil(totalLength / fabricWidth);
  const totalInches = numStrips * stripWidth;
  const rawYards = totalInches / 36;
  const yardsNeeded = Math.ceil(rawYards * 8) / 8;
  return { totalLength, numStrips, yardsNeeded };
}

// ── BORDER YARDAGE ───────────────────────────────────────────────────────────
export function calcBorders(centerW, centerH, borders, mitered = false) {
  const fabricWidth = 40;
  const seam = 0.5;
  const results = [];
  let currentW = centerW;
  let currentH = centerH;

  for (const bw of borders) {
    const cutW = bw + seam;
    let sideLng, topLng;

    if (mitered) {
      const longest = Math.max(currentW, currentH) + (bw * 2) + 4;
      sideLng = longest;
      topLng = longest;
    } else {
      sideLng = currentH + seam;
      topLng = currentW + (bw * 2) + seam;
    }

    const stripsPerWidth = Math.floor(fabricWidth / cutW);
    const longestStrip = Math.max(sideLng, topLng);
    const totalStrips = 4;
    const cuts = Math.ceil(totalStrips / stripsPerWidth);
    const totalInches = cuts * longestStrip;
    const rawYards = totalInches / 36;
    const yardsNeeded = Math.ceil(rawYards * 8) / 8;

    results.push({ borderWidth: bw, yardsNeeded });

    currentW = currentW + (bw * 2);
    currentH = currentH + (bw * 2);
  }

  return results;
}

// ── BED QUILT SIZES ──────────────────────────────────────────────────────────
const BED_SIZES = {
  crib:   { name: 'Crib',            matW: 28, matH: 52 },
  twin:   { name: 'Twin',            matW: 39, matH: 75 },
  full:   { name: 'Full / Double',   matW: 54, matH: 75 },
  queen:  { name: 'Queen',           matW: 60, matH: 80 },
  king:   { name: 'King',            matW: 76, matH: 80 },
  calkng: { name: 'California King', matW: 72, matH: 84 },
};

export function calcBedQuiltSize(bedKey, drop, pillowTuck = false) {
  const bed = BED_SIZES[bedKey];
  if (!bed) return null;
  const quiltWidth = bed.matW + (drop * 2);
  const quiltLength = bed.matH + drop + (pillowTuck ? 10 : 0);
  return {
    quiltWidth,
    quiltLength,
    mattressW: bed.matW,
    mattressH: bed.matH,
    bedName: bed.name,
  };
}

export function getAllBedSizes(drop, pillowTuck) {
  return Object.keys(BED_SIZES).map(key => calcBedQuiltSize(key, drop, pillowTuck));
}
