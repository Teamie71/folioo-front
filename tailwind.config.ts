import type { Config } from 'tailwindcss';
import * as path from 'path';
import * as fs from 'fs';

const tokensPath = path.resolve(__dirname, 'src/styles/tokens.json');
const tokensJson = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
const g = tokensJson.global;

/* px 값을 rem으로 변환 (기준: 16px = 1rem) */
function pxToRem(px: number): string {
  return `${px / 16}rem`;
}

function getValue(obj: unknown): unknown {
  if (obj && typeof obj === 'object' && '$value' in obj) {
    return (obj as { $value: unknown }).$value;
  }
  return undefined;
}

// colors
const main = getValue(g.Main) as string;
const sub1 = getValue(g.Sub1) as string;
const sub2 = getValue(g.Sub2) as string;
const unactive = getValue(g.unactive) as string;
const grayScale = g['gray scale'] as Record<string, { $value: string }>;
const state = g.state as Record<string, { $value: string }>;
const hover = g.hover as Record<string, { $value: string }>;

const colors = {
  main,
  sub1,
  sub2,
  unactive,
  white: grayScale?.white?.$value ?? '#ffffff',
  gray1: grayScale?.Gray1?.$value,
  gray2: grayScale?.Gray2?.$value,
  gray3: grayScale?.Gray3?.$value,
  gray4: grayScale?.Gray4?.$value,
  gray5: grayScale?.Gray5?.$value,
  gray6: grayScale?.Gray6?.$value,
  gray7: grayScale?.Gray7?.$value,
  gray8: grayScale?.Gray8?.$value,
  gray9: grayScale?.Gray9?.$value,
  error: state?.Error?.$value,
  'error-sub': state?.Error_sub?.$value,
  success: state?.Success?.$value,
  'success-sub': state?.Success_sub?.$value,
  'main-hover': hover?.Main_hover?.$value,
  'sub-hover': hover?.Sub_hover?.$value,
};

// boxShadow: { color, x, y, blur, spread } → rem
function shadowCss(key: string) {
  const v = getValue((g as Record<string, unknown>)[key]) as
    | { color: string; x: number; y: number; blur: number; spread: number }
    | undefined;
  if (!v) return undefined;
  return `${pxToRem(v.x)} ${pxToRem(v.y)} ${pxToRem(v.blur)} ${pxToRem(v.spread)} ${v.color}`;
}

const boxShadow = {
  modal: shadowCss('modal'),
  dropdown: shadowCss('dropdown'),
  'chat-card': shadowCss('chat&card'),
};

// fontFamilies
const fontFamilies = g.fontFamilies as Record<string, { $value: string }>;
const pretendard = fontFamilies?.pretendard?.$value ?? 'Pretendard';

// lineHeights
const lineHeights = g.lineHeights as Record<string, { $value: string }>;
const lineHeight: Record<string, string> = {};
if (lineHeights) {
  for (const k of Object.keys(lineHeights)) {
    lineHeight[k] = lineHeights[k].$value;
  }
}

// fontWeights
const weightMap: Record<string, string> = {
  Bold: '700',
  Regular: '400',
  SemiBold: '600',
  Medium: '500',
};
const fontWeights = g.fontWeights as Record<string, { $value: string }>;
const fontWeight: Record<string, string> = {};
if (fontWeights) {
  for (const k of Object.keys(fontWeights)) {
    const v = fontWeights[k].$value;
    fontWeight[k] = weightMap[v] ?? v;
  }
}

// fontSize: number(px) -> rem
const fontSizes = g.fontSize as Record<string, { $value: number }>;
const fontSize: Record<string, string> = {};
if (fontSizes) {
  for (const k of Object.keys(fontSizes)) {
    fontSize[k] = pxToRem(fontSizes[k].$value);
  }
}

// letterSpacing
const letterSpacing = g.letterSpacing as Record<string, { $value: string }>;
const letterSpacingRes: Record<string, string> = {};
if (letterSpacing) {
  for (const k of Object.keys(letterSpacing)) {
    letterSpacingRes[k] = letterSpacing[k].$value;
  }
}

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ...colors,
      },
      boxShadow: {
        ...boxShadow,
      },
      fontFamily: {
        sans: [
          'var(--font-pretendard)',
          'Pretendard Variable',
          pretendard,
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'sans-serif',
        ],
        pretendard: [pretendard, 'var(--font-pretendard)', 'sans-serif'],
      },
      fontSize: {
        ...fontSize,
      },
      fontWeight: {
        regular: '400',
        semibold: '600',
        bold: '700',
        medium: '500',
        ...fontWeight,
      },
      lineHeight: {
        ...lineHeight,
      },
      letterSpacing: {
        ...letterSpacingRes,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
