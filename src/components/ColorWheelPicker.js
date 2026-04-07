// src/components/ColorWheelPicker.js
// N2 — Color Wheel Intelligence
// Interactive SVG color wheel with drag/tap support.
// Hue = angle around the wheel. Saturation = distance from center.

import React, { useRef, useMemo, useEffect } from 'react';
import { View, PanResponder } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { hslToHex } from '../utils/colorUtils';

const NUM_SECTORS = 90; // 4° each — smooth appearance without too many paths
const MIN_SAT = 8;

function toXY(cx, cy, r, angleDeg) {
  const rad = angleDeg * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function slicePath(cx, cy, r, startDeg, endDeg) {
  const [x1, y1] = toXY(cx, cy, r, startDeg);
  const [x2, y2] = toXY(cx, cy, r, endDeg + 0.6); // +0.6 closes gaps between sectors
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/**
 * ColorWheelPicker
 *
 * Props:
 *   size          {number}   Diameter of the wheel in dp (default 248)
 *   anchorH       {number}   Current hue 0-360
 *   anchorS       {number}   Current saturation 0-100
 *   onColorChange {({h, s}) => void}  Called on tap/drag with new h and s
 */
export function ColorWheelPicker({ size = 248, anchorH, anchorS, onColorChange }) {
  const radius = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const degPerSector = 360 / NUM_SECTORS;

  // Keep onColorChange fresh without recreating panResponder
  const onChangeRef = useRef(onColorChange);
  useEffect(() => { onChangeRef.current = onColorChange; }, [onColorChange]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => pickColor(evt.nativeEvent),
      onPanResponderMove: (evt) => pickColor(evt.nativeEvent),
    })
  ).current;

  function pickColor({ locationX, locationY }) {
    const dx = locationX - cx;
    const dy = locationY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > radius) return;
    // atan2 convention: 0° = right, 90° = down — matches SVG x-right y-down
    const h = ((Math.atan2(dy, dx) * 180 / Math.PI) + 360) % 360;
    const s = Math.max(MIN_SAT, (dist / radius) * 100);
    onChangeRef.current({ h, s });
  }

  // Pre-compute the 90 sector paths (stable — only recalculated if size changes)
  const sectors = useMemo(() =>
    Array.from({ length: NUM_SECTORS }, (_, i) => ({
      d:    slicePath(cx, cy, radius, i * degPerSector, (i + 1) * degPerSector),
      fill: hslToHex(i * degPerSector, 100, 50),
    })),
  [cx, cy, radius, degPerSector]);

  // Marker position
  const markerAngleRad = anchorH * Math.PI / 180;
  const markerDist     = (Math.max(MIN_SAT, anchorS) / 100) * radius;
  const mx = cx + Math.cos(markerAngleRad) * markerDist;
  const my = cy + Math.sin(markerAngleRad) * markerDist;

  return (
    <View style={{ width: size, height: size }} {...panResponder.panHandlers}>
      <Svg width={size} height={size}>
        <Defs>
          {/* White fade from center → transparent at edge creates saturation gradient */}
          <RadialGradient id="satFade" cx="50%" cy="50%" r="50%">
            <Stop offset="0%"   stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Hue sectors */}
        {sectors.map((s, i) => (
          <Path key={i} d={s.d} fill={s.fill} />
        ))}

        {/* Saturation fade overlay */}
        <Circle cx={cx} cy={cy} r={radius} fill="url(#satFade)" />

        {/* Marker: shadow ring → white ring → white dot */}
        <Circle cx={mx} cy={my} r={12} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth={4} />
        <Circle cx={mx} cy={my} r={12} fill="none" stroke="#ffffff" strokeWidth={2.5} />
        <Circle cx={mx} cy={my} r={5}  fill="#ffffff" />
      </Svg>
    </View>
  );
}
