// HomeScreen.js
// Dashboard: welcome header, donut chart of project stats, 3 recent projects,
// and a "Continue your project" quick-launch card.
// Recent projects use dummy data for V1.

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';

// ─── Dummy data ────────────────────────────────────────────────────────────
const STATS = {
  quiltsActive: 6,
  quiltsDone: 14,
  bagsActive: 3,
  bagsDone: 8,
  ufos: 4,
};

const RECENT_PROJECTS = [
  { id: '1', name: 'Garden Wedding Quilt', type: 'Quilt', stage: 'Quilting',      progress: 0.65, color: COLORS.DEEP_PLUM },
  { id: '2', name: 'Farmers Market Tote',  type: 'Bag',   stage: 'Cutting',       progress: 0.30, color: COLORS.MINT },
  { id: '3', name: 'Patchwork Throw',      type: 'Quilt', stage: 'Binding',       progress: 0.90, color: '#7C3ABF' },
];

const CONTINUE_PROJECT = {
  name: 'Log Cabin Quilt',
  stage: 'Binding',
  progress: 0.80,
};

// ─── Donut chart ────────────────────────────────────────────────────────────
function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end   = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

function DonutChart({ stats, size = 220 }) {
  const cx = size / 2, cy = size / 2;
  const R_outer = size * 0.44;
  const R_inner = size * 0.24;
  const strokeW = R_outer - R_inner;
  const R_mid   = (R_outer + R_inner) / 2;
  const GAP = 3; // degrees gap between segments

  const total = stats.quiltsActive + stats.quiltsDone + stats.bagsActive + stats.bagsDone;
  const toDeg = (v) => (v / total) * (360 - GAP * 4);

  const segments = [
    { value: stats.quiltsActive, color: COLORS.DEEP_PLUM,  label: `${stats.quiltsActive}`, sublabel: 'Active' },
    { value: stats.bagsActive,   color: COLORS.MINT,       label: `${stats.bagsActive}`,   sublabel: 'Active' },
    { value: stats.bagsDone,     color: '#4aad85',         label: `${stats.bagsDone}`,     sublabel: 'Done' },
    { value: stats.quiltsDone,   color: '#7C3ABF',         label: `${stats.quiltsDone}`,   sublabel: 'Done' },
  ];

  // Calculate start angles
  let angle = 0;
  const rendered = segments.map((seg, i) => {
    const sweep = toDeg(seg.value);
    const start = angle;
    const end   = angle + sweep;
    const mid   = start + sweep / 2;
    const labelPos = polarToXY(cx, cy, R_mid, mid);
    angle = end + GAP;
    return { ...seg, start, end, labelPos };
  });

  return (
    <Svg width={size} height={size}>
      {/* White background circle */}
      <Circle cx={cx} cy={cy} r={R_outer + 4} fill="#fff"
        style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}
      />

      {/* Segments */}
      {rendered.map((seg, i) => (
        <Path
          key={i}
          d={arcPath(cx, cy, R_mid, seg.start, seg.end)}
          stroke={seg.color}
          strokeWidth={strokeW}
          strokeLinecap="butt"
          fill="none"
        />
      ))}

      {/* Inner white circle */}
      <Circle cx={cx} cy={cy} r={R_inner - 2} fill="#fff" />
    </Svg>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Welcome */}
        <Text style={styles.welcome}>Welcome, Sarah!</Text>

        {/* Donut chart */}
        <View style={styles.chartWrap}>
          <View style={styles.chartSvgWrap}>
            <DonutChart stats={STATS} size={220} />
            {/* Center label — positioned over the SVG only */}
            <View style={styles.chartCenter}>
              <Text style={styles.chartCenterNum}>{STATS.ufos}</Text>
              <Text style={styles.chartCenterLabel}>UFOs</Text>
            </View>
          </View>
          {/* Legend */}
          <View style={styles.legend}>
            {[
              { color: COLORS.DEEP_PLUM, label: `${STATS.quiltsActive} Quilts active` },
              { color: '#7C3ABF',         label: `${STATS.quiltsDone} Quilts done` },
              { color: COLORS.MINT,       label: `${STATS.bagsActive} Bags active` },
              { color: '#4aad85',         label: `${STATS.bagsDone} Bags done` },
            ].map((l, i) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Text style={styles.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent projects */}
        <Text style={styles.sectionTitle}>Recent Projects</Text>
        {RECENT_PROJECTS.map((p) => {
          const pct = Math.round(p.progress * 100);
          return (
            <View key={p.id} style={styles.projectCard}>
              <View style={[styles.projectCardAccent, { backgroundColor: p.color }]} />
              <View style={styles.projectCardBody}>
                <View style={styles.projectCardTop}>
                  <Text style={styles.projectCardName} numberOfLines={1}>{p.name}</Text>
                  <View style={[styles.typePill, { backgroundColor: p.color + '22', borderColor: p.color + '44' }]}>
                    <Text style={[styles.typePillText, { color: p.color }]}>{p.type}</Text>
                  </View>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: p.color }]} />
                </View>
                <View style={styles.projectCardFooter}>
                  <Text style={styles.stageText}>{p.stage}</Text>
                  <Text style={[styles.pctText, { color: p.color }]}>{pct}%</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Continue project */}
        <View style={styles.continueCard}>
          <View style={styles.continueLeft}>
            <View style={styles.continueSwatch}>
              <Text style={{ fontSize: 22 }}>🧵</Text>
            </View>
            <View>
              <Text style={styles.continueLabel}>Continue Your Project:</Text>
              <Text style={styles.continueName}>
                {CONTINUE_PROJECT.stage} — <Text style={{ fontWeight: '700' }}>{CONTINUE_PROJECT.name}</Text>
                {' '}({Math.round(CONTINUE_PROJECT.progress * 100)}%)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.openBtn}
            activeOpacity={0.85}
            onPress={() => navigation.dispatch(
              require('@react-navigation/native').CommonActions.navigate('Projects')
            )}
          >
            <Text style={styles.openBtnText}>Open</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f9' },
  scroll: { paddingBottom: 32 },

  // Welcome
  welcome: {
    fontSize: 22, fontWeight: '800', color: COLORS.MIDNIGHT,
    paddingHorizontal: 18, marginTop: 18, marginBottom: 4,
  },

  // Donut chart
  chartWrap: { alignItems: 'center', marginVertical: 10 },
  chartSvgWrap: { width: 220, height: 220 },
  chartCenter: {
    position: 'absolute', top: 0, left: 0, width: 220, height: 220,
    alignItems: 'center', justifyContent: 'center',
  },
  chartCenterNum: { fontSize: 26, fontWeight: '800', color: COLORS.DEEP_PLUM },
  chartCenterLabel: { fontSize: 12, color: '#6b6b8a', fontWeight: '500' },
  legend: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 8,
    marginTop: 10, paddingHorizontal: 20,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#6b6b8a' },

  // Section title
  sectionTitle: {
    fontSize: 14, fontWeight: '700', color: COLORS.MIDNIGHT,
    paddingHorizontal: 18, marginTop: 18, marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Project cards
  projectCard: {
    flexDirection: 'row', marginHorizontal: 14, marginBottom: 10,
    backgroundColor: '#fff', borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  projectCardAccent: { width: 6 },
  projectCardBody: { flex: 1, padding: 13 },
  projectCardTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  projectCardName: {
    flex: 1, fontSize: 14, fontWeight: '700',
    color: COLORS.MIDNIGHT, marginRight: 8,
  },
  typePill: {
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1,
  },
  typePillText: { fontSize: 11, fontWeight: '600' },
  progressTrack: {
    height: 7, backgroundColor: '#efefef',
    borderRadius: 4, overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  projectCardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  stageText: { fontSize: 12, color: COLORS.DEEP_PLUM, fontWeight: '500' },
  pctText: { fontSize: 12, fontWeight: '700' },

  // Continue card
  continueCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 14, marginTop: 8,
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  continueLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  continueSwatch: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: COLORS.LAVENDER_WHITE,
    alignItems: 'center', justifyContent: 'center',
  },
  continueLabel: { fontSize: 11, color: '#6b6b8a', marginBottom: 2 },
  continueName: { fontSize: 12, color: COLORS.MIDNIGHT, flexShrink: 1 },
  openBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 20,
  },
  openBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
