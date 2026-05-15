/**
 * N2 — Nimble Needle
 * ColorWheelDial Component
 *
 * Interactive circular HSL color wheel.
 * User drags to select any color. Harmony preview updates live.
 *
 * Requires: react-native-svg, react-native-gesture-handler
 */

import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { hexToHsl, hslToHex, getHarmonies } from '../../utils/colorHarmony';

const N2 = {
  deepPlum:     '#5B2D8E',
  midnight:     '#2D1B4E',
  mint:         '#4EC9A0',
  softLavender: '#C084FC',
  lavWhite:     '#F5F0FA',
  white:        '#FFFFFF',
  darkText:     '#1A1A2E',
  midGray:      '#6B6B8A',
  lightBorder:  '#DDD6F0',
};

const WHEEL_SIZE   = Math.min(Dimensions.get('window').width - 48, 300);
const CENTER       = WHEEL_SIZE / 2;
const OUTER_RADIUS = CENTER - 4;
const INNER_RADIUS = OUTER_RADIUS * 0.35;  // White center circle
const NUM_SEGMENTS = 120;                   // Hue resolution

// ─────────────────────────────────────────────────────────────────────────────
// Generate SVG wedge path for one hue segment
// ─────────────────────────────────────────────────────────────────────────────
function wedgePath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const toRad = deg => (deg * Math.PI) / 180;
  const s1 = toRad(startAngle), e1 = toRad(endAngle);
  const x1 = cx + outerR * Math.cos(s1), y1 = cy + outerR * Math.sin(s1);
  const x2 = cx + outerR * Math.cos(e1), y2 = cy + outerR * Math.sin(e1);
  const x3 = cx + innerR * Math.cos(e1), y3 = cy + innerR * Math.sin(e1);
  const x4 = cx + innerR * Math.cos(s1), y4 = cy + innerR * Math.sin(s1);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Convert angle on the wheel to a hue (0-360)
// ─────────────────────────────────────────────────────────────────────────────
function angleToHue(angleDeg) {
  return ((angleDeg % 360) + 360) % 360;
}

// ─────────────────────────────────────────────────────────────────────────────
// Get position on wheel from hue+saturation
// ─────────────────────────────────────────────────────────────────────────────
function hslToWheelPos(h, s) {
  const angle = (h * Math.PI) / 180;
  const radius = INNER_RADIUS + (s / 100) * (OUTER_RADIUS - INNER_RADIUS - 8);
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ColorWheelDial Component
// ─────────────────────────────────────────────────────────────────────────────
export default function ColorWheelDial({ initialHex = '#5B2D8E', onColorChange }) {
  const initHsl = hexToHsl(initialHex) || { h: 270, s: 65, l: 36 };

  const [hsl, setHsl]         = useState(initHsl);
  const [dragging, setDragging] = useState(false);
  const wheelRef = useRef(null);

  const currentHex = hslToHex(hsl.h, hsl.s, hsl.l);

  // Get quick preview strip — just the ideal harmony hex values, no fabric matching
  const previewColors = (() => {
    const h = hsl.h, s = hsl.s, l = hsl.l;
    return [
      hslToHex(h, s, l),                                        // Source
      hslToHex((h + 30) % 360, s, l),                          // Fabric Sister
      hslToHex((h + 180) % 360, s, l),                         // Bold Contrast
      hslToHex((h + 120) % 360, s, l),                         // Lively Trio 1
      hslToHex((h + 240) % 360, s, l),                         // Lively Trio 2
    ];
  })();

  const handleGesture = useCallback(({ nativeEvent: e }) => {
    const dx = e.x - CENTER;
    const dy = e.y - CENTER;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < INNER_RADIUS * 0.8 || dist > OUTER_RADIUS + 8) return;

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    const newH = Math.round(angleToHue(angle));
    // Saturation based on distance from center
    const newS = Math.round(
      Math.min(100, Math.max(20,
        ((dist - INNER_RADIUS) / (OUTER_RADIUS - INNER_RADIUS)) * 100
      ))
    );

    const newHsl = { h: newH, s: newS, l: hsl.l };
    setHsl(newHsl);
    onColorChange && onColorChange(hslToHex(newH, newS, hsl.l));
  }, [hsl.l, onColorChange]);

  const indicatorPos = hslToWheelPos(hsl.h, hsl.s);

  return (
    <View style={styles.container}>

      {/* The wheel */}
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={handleGesture}
          onBegan={() => setDragging(true)}
          onEnded={() => setDragging(false)}
          onCancelled={() => setDragging(false)}>
          <View ref={wheelRef}>
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
              <Defs>
                <RadialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1"/>
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
                </RadialGradient>
              </Defs>

              {/* Hue segments */}
              {Array.from({ length: NUM_SEGMENTS }, (_, i) => {
                const startAngle = (i / NUM_SEGMENTS) * 360;
                const endAngle   = ((i + 1) / NUM_SEGMENTS) * 360;
                const hue        = Math.round((i / NUM_SEGMENTS) * 360);
                return (
                  <Path
                    key={i}
                    d={wedgePath(CENTER, CENTER, INNER_RADIUS, OUTER_RADIUS, startAngle, endAngle)}
                    fill={`hsl(${hue}, 80%, 55%)`}
                  />
                );
              })}

              {/* White center radial gradient overlay (simulates saturation) */}
              <Circle
                cx={CENTER} cy={CENTER}
                r={OUTER_RADIUS}
                fill="url(#centerGrad)"
              />

              {/* White center circle (pure neutral zone) */}
              <Circle
                cx={CENTER} cy={CENTER}
                r={INNER_RADIUS - 2}
                fill={N2.white}
                stroke={N2.lightBorder}
                strokeWidth={1}
              />

              {/* Center swatch — shows current lightness */}
              <Circle
                cx={CENTER} cy={CENTER}
                r={INNER_RADIUS - 8}
                fill={currentHex}
              />

              {/* Drag indicator */}
              <Circle
                cx={indicatorPos.x}
                cy={indicatorPos.y}
                r={dragging ? 14 : 10}
                fill={currentHex}
                stroke={N2.white}
                strokeWidth={2.5}
              />
            </Svg>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>

      {/* Lightness slider */}
      <View style={styles.lightnessRow}>
        <Text style={styles.sliderLabel}>Dark</Text>
        <View style={styles.sliderTrackWrap}>
          <View style={[styles.sliderTrack,
            { background: `linear-gradient(to right, #000, ${hslToHex(hsl.h, hsl.s, 50)}, #fff)` }
          ]}/>
        </View>
        <Text style={styles.sliderLabel}>Light</Text>
      </View>

      {/* Harmony preview strip */}
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>Harmony preview</Text>
        <View style={styles.previewStrip}>
          {previewColors.map((hex, i) => (
            <View key={i} style={[styles.previewChip, { backgroundColor: hex }]}/>
          ))}
        </View>
      </View>

      {/* Current color info */}
      <View style={styles.colorInfoRow}>
        <View style={[styles.selectedSwatch, { backgroundColor: currentHex }]}/>
        <View>
          <Text style={styles.hexLabel}>{currentHex.toUpperCase()}</Text>
          <Text style={styles.hslLabel}>
            H:{hsl.h}° S:{hsl.s}% L:{hsl.l}%
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  lightnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    width: WHEEL_SIZE,
  },
  sliderLabel: {
    fontSize: 11,
    color: N2.midGray,
  },
  sliderTrackWrap: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: N2.lightBorder,
  },
  sliderTrack: {
    flex: 1,
    height: '100%',
  },
  previewRow: {
    marginTop: 16,
    width: WHEEL_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewLabel: {
    fontSize: 11,
    color: N2.midGray,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  previewStrip: {
    flexDirection: 'row',
    gap: 4,
  },
  previewChip: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    width: WHEEL_SIZE,
    backgroundColor: N2.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    borderColor: N2.lightBorder,
  },
  selectedSwatch: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  hexLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: N2.darkText,
    fontFamily: 'monospace',
  },
  hslLabel: {
    fontSize: 12,
    color: N2.midGray,
    marginTop: 2,
  },
});
