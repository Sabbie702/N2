// Auth flow SVG assets — stored for future auth screen implementation.
// Each component renders the exact provided brand SVG.

import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg';

// ─── 3L: Success Check Hero ──────────────────────────────────────────────────
export function SuccessCheckHero({ size = 120 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Circle cx="60" cy="60" r="52" fill="#4EC9A0" fillOpacity="0.22" />
      <Circle cx="60" cy="60" r="48" stroke="#4EC9A0" strokeWidth="4" strokeDasharray="8 8" />
      <Path d="M34 61l17 17 36-42" stroke="#4EC9A0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── 3L: Track Bag Projects Icon ─────────────────────────────────────────────
export function TrackBagProjectsIcon({ size = 96 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Path d="M22 38h52l6 43H16l6-43Z" fill="#C084FC" fillOpacity="0.58" stroke="#5B2D8E" strokeWidth="4" />
      <Path d="M34 38v-8a14 14 0 0 1 28 0v8" stroke="#5B2D8E" strokeWidth="4" strokeLinecap="round" />
      <Path d="M31 60h34" stroke="#4EC9A0" strokeWidth="6" strokeLinecap="round" />
      <Circle cx="30" cy="46" r="3" fill="#5B2D8E" />
      <Circle cx="66" cy="46" r="3" fill="#5B2D8E" />
    </Svg>
  );
}

// ─── 3K: Social Login — Apple ────────────────────────────────────────────────
export function SocialAppleIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="4" y="4" width="40" height="40" rx="10" fill="#FFFFFF" stroke="#E6DFF2" />
      <Path d="M29.3 9.5c0 2-.8 3.8-2.1 5.2-1.4 1.5-3.5 2.7-5.4 2.5-.2-1.9.7-3.9 2-5.3 1.4-1.5 3.8-2.7 5.5-2.4ZM36.8 37.7c-.8 1.8-1.1 2.6-2.1 4.1-1.4 2.1-3.3 4.7-5.7 4.7-2.1 0-2.7-1.4-5.6-1.4s-3.5 1.4-5.7 1.4c-2.4 0-4.2-2.4-5.6-4.5-3.8-5.9-4.2-12.8-1.9-16.4 1.7-2.6 4.3-4.1 6.8-4.1 2.6 0 4.2 1.4 6.3 1.4 2.1 0 3.3-1.4 6.3-1.4 2.2 0 4.6 1.2 6.3 3.3-5.5 3-4.6 10.9 1 12.9Z" fill="#111111" transform="scale(.55) translate(18 8)" />
    </Svg>
  );
}

// ─── 3K: Social Login — Facebook ─────────────────────────────────────────────
export function SocialFacebookIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="4" y="4" width="40" height="40" rx="10" fill="#FFFFFF" stroke="#E6DFF2" />
      <Path d="M38 24c0-7.73-6.27-14-14-14s-14 6.27-14 14c0 6.99 5.12 12.78 11.8 13.83v-9.78h-3.55V24h3.55v-3.08c0-3.5 2.08-5.43 5.27-5.43 1.53 0 3.13.27 3.13.27v3.44h-1.76c-1.74 0-2.28 1.08-2.28 2.18V24h3.88l-.62 4.05h-3.26v9.78C32.88 36.78 38 30.99 38 24Z" fill="#1877F2" />
    </Svg>
  );
}

// ─── 3K: Social Login — Google ───────────────────────────────────────────────
export function SocialGoogleIcon({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="4" y="4" width="40" height="40" rx="10" fill="#FFFFFF" stroke="#E6DFF2" />
      <Path fill="#4285F4" d="M36.7 24.4c0-.8-.1-1.6-.2-2.3H24v4.4h7.1c-.3 1.6-1.2 3-2.6 3.9v2.9h4.2c2.5-2.2 4-5.4 4-8.9Z" />
      <Path fill="#34A853" d="M24 37c3.6 0 6.6-1.2 8.8-3.7l-4.2-2.9c-1.2.8-2.7 1.2-4.6 1.2-3.5 0-6.4-2.4-7.5-5.5h-4.3v3.1C14.3 33.9 18.8 37 24 37Z" />
      <Path fill="#FBBC05" d="M16.5 26.1c-.3-.8-.4-1.7-.4-2.6s.1-1.8.4-2.6v-3.1h-4.3c-.9 1.7-1.4 3.6-1.4 5.7s.5 4 1.4 5.7l4.3-3.1Z" />
      <Path fill="#EA4335" d="M24 15.4c2 0 3.7.7 5 2l3.7-3.7C30.6 11.7 27.6 10.5 24 10.5c-5.2 0-9.7 3.1-11.8 7.3l4.3 3.1c1.1-3.1 4-5.5 7.5-5.5Z" />
    </Svg>
  );
}

// ─── 3L: Welcome Splash Hero Background ──────────────────────────────────────
export function WelcomeSplashBackground() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 760" fill="none" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="390" y2="760">
          <Stop stopColor="#5B2D8E" />
          <Stop offset="1" stopColor="#2D1B4E" />
        </LinearGradient>
      </Defs>
      <Rect width="390" height="760" rx="34" fill="url(#bg)" />
      <Path d="M0 90h390M0 180h390M0 270h390M0 360h390M0 450h390M0 540h390M0 630h390" stroke="#1E1236" strokeOpacity="0.35" strokeWidth="2" />
      <Path d="M90 0v760M180 0v760M270 0v760" stroke="#1E1236" strokeOpacity="0.35" strokeWidth="2" />
      <Path d="M-30 130 C60 65 112 210 202 130 C286 52 310 190 430 112" fill="none" stroke="#C084FC" strokeWidth="2.3" strokeDasharray="8 8" />
      <Path d="M-12 620 C92 528 138 680 226 590 C316 498 344 646 430 570" fill="none" stroke="#4EC9A0" strokeWidth="2.2" strokeDasharray="8 8" />
      <Path d="M63 456c38-31 75 18 34 41-26 15-47-20-19-32" fill="none" stroke="#C084FC" strokeWidth="2" strokeDasharray="7 7" />
    </Svg>
  );
}
