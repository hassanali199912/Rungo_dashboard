---
name: Kinetic Pulse
colors:
  surface: '#0f141a'
  surface-dim: '#0f141a'
  surface-bright: '#353941'
  surface-container-lowest: '#0a0e15'
  surface-container-low: '#181c23'
  surface-container: '#1c2027'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2ec'
  on-surface-variant: '#e4beb4'
  inverse-surface: '#dfe2ec'
  inverse-on-surface: '#2d3138'
  outline: '#ab8980'
  outline-variant: '#5b4039'
  surface-tint: '#ffb5a0'
  primary: '#ffb5a0'
  on-primary: '#5f1500'
  primary-container: '#ff5722'
  on-primary-container: '#541200'
  inverse-primary: '#b02f00'
  secondary: '#c6c6ca'
  on-secondary: '#2f3034'
  secondary-container: '#4a4b4f'
  on-secondary-container: '#bbbbbf'
  tertiary: '#00daf3'
  on-tertiary: '#00363d'
  tertiary-container: '#00a0b3'
  on-tertiary-container: '#002f36'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#862200'
  secondary-fixed: '#e2e2e6'
  secondary-fixed-dim: '#c6c6ca'
  on-secondary-fixed: '#1a1c1f'
  on-secondary-fixed-variant: '#45474a'
  tertiary-fixed: '#9cf0ff'
  tertiary-fixed-dim: '#00daf3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f58'
  background: '#0f141a'
  on-background: '#dfe2ec'
  surface-variant: '#31353c'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  metric-huge:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.04em
  metric-huge-mobile:
    fontFamily: Space Grotesk
    fontSize: 52px
    fontWeight: '700'
    lineHeight: 54px
    letterSpacing: -0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system channels the momentum, speed, and continuous motion of athletes in transit. Designed for runners, skaters, rollers, and everyday cardio enthusiasts, the aesthetic pairs raw athletic intensity with hyper-focused digital utility. It evokes adrenaline, progression, and sharp clarity.

The visual style blends **High-Contrast Athletic Modernism** with clean geometric precision. High-contrast elements ensure glanceability under harsh midday sunlight or during high-velocity movement. Interfaces prioritize functional speed: zero clutter, bold typography, tactile feedback indicators, and high-impact kinetic accents that keep pace with physical exertion.

## Colors

The palette is engineered for outdoors, high speed, and extreme contrast:

- **Primary (`#FF5722`)**: Kinetic Orange. Used for critical primary actions, dynamic path tracking, live pacing, metrics in target zones, and primary visual emphasis.
- **Secondary (`#121417`)**: Deep Carbon. Forms the solid foundation for high-contrast dark-mode surfaces, minimizing battery drain on OLED screens while preventing eye fatigue in outdoor environments.
- **Tertiary (`#00E5FF`)**: Electric Cyan. Serves as a complementary cadence indicator, pace differential accent, and secondary status identifier (GPS locked, active splits).
- **Neutral (`#1E2229`)**: Elevated Slate. Utilized for modular card surfaces, track containers, input borders, and backdrop segmentations.

Foreground elements leverage pure `#FFFFFF` for primary metric values, with `#94A3B8` (Cool Slate) for secondary units and timestamps.

## Typography

Typography prioritizes instant numeric legibility and technical structure:

- **Display & Metrics (`Space Grotesk`)**: Provides an angular, aerodynamic structure. Tabular numerical figures prevent jitter when tracking active seconds, current pace, and GPS distances in real-time. Uppercase application in labels enforces sports-gear instrumentation clarity.
- **Continuous Content (`Plus Jakarta Sans`)**: Delivers friendly, open geometric forms with clean counters for feed notes, route descriptions, settings, and biometric analysis descriptions.

## Layout & Spacing

The layout is built around an 8pt dynamic fluid grid system suited for single-handed mobile navigation and touch interaction under physical motion:

- **Mobile (<768px)**: 4-column fluid layout with `1rem` outer margins. All critical active controls (Start, Pause, Split) sit within a thumb-reach bottom safe zone (64px to 112px height).
- **Tablet (768px - 1024px)**: 8-column layout with `1.5rem` gutters and outer margins, presenting side-by-side splits (live map vs. live telemetry charts).
- **Desktop / Large Dashboard (>1024px)**: 12-column layout max-width constrained to `1280px` with `2.5rem` outer canvas padding.
- **Rhythm Rules**: Metric items inside active sports cards maintain `space-sm` between label and value, and `space-lg` separation between disparate telemetry pillars (Pace, Cadence, HR, Elevation).

## Elevation & Depth

To maintain glanceability without distraction, depth is conveyed through **Tonal Stacking** paired with targeted **Kinetic Glows**:

- **Layer 0 (Base Canvas)**: Solid `#121417`.
- **Layer 1 (Cards & Modules)**: Flat `#1E2229` with a crisp 1px perimeter outline (`rgba(255, 255, 255, 0.06)`).
- **Layer 2 (Floating Action Bars & Overlays)**: Semi-translucent `#1E2229` with 80% opacity and `backdrop-filter: blur(16px)`. Border crispness increases to `rgba(255, 255, 255, 0.12)`.
- **Active / Focused Depth**: Active states (like an ongoing workout or selected metric block) eliminate dark drop shadows in favor of a directional kinetic rim glow: `0px 4px 20px rgba(255, 87, 34, 0.35)`.
- **Modals & Bottom Drawers**: Solid `#1A1D23` with a sharp top outline (`rgba(255, 87, 34, 0.40)`) and background dimming via `#000000` at 70% opacity.

## Shapes

The design system adopts a **Pill-Shaped (Level 3)** dynamic curvature archetype that reflects wheels, tracks, and forward kinetic flow:

- **Pills & Primary Buttons**: Fully rounded pill forms (`border-radius: 9999px`) provide high tactile affordance and mimic athletic hardware.
- **Cards & Data Modules**: Base radius of `1rem` (`rounded-md`), scaling up to `1.5rem` (`rounded-xl`) on larger dashboards.
- **Metric Badges & Tags**: Full pill encapsulation (`rounded-full`) with dense internal horizontal padding.
- **Progress Trackers & Gauges**: Circular and capsule caps (`stroke-linecap: round`) to echo continuous rolling motion.

## Components

### Buttons
- **Primary Kinetic Action**: Solid `#FF5722` pill with `#FFFFFF` or `#121417` bold typography. Height is minimum 52px for active workout triggers (large thumb tap targets). On pressed state, scales down to `0.97` with an active orange luminescence.
- **Secondary Action**: Bordered capsule with a 1.5px stroke in `#FF5722` or white-alpha `rgba(255, 255, 255, 0.2)` on dark background, filling to `rgba(255, 87, 34, 0.15)` upon touch.
- **Floating Record / Pause Button**: 72px circular floating action button housing high-visibility iconography (e.g., Pause, Finish, Lap split) with high-contrast dual ring styling.

### Chips & Filters
- Compact capsule tags (`rounded-full`) with a default background of `#1E2229` and text in `#94A3B8`.
- Selected chips switch to `#FF5722` fill with `#FFFFFF` bold text, instantly highlighting active activity filters (e.g., "Outdoor Run", "Night Roll", "Intervals").

### Cards & Telemetry Blocks
- Enclosed modules with `#1E2229` backgrounds, `1.25rem` padding, and subtle borders.
- Telemetry split-cards present small uppercase tracking labels (`label-md`) pinned to the top, stacked directly over massive `metric-huge` numeric displays and small baseline units (e.g., `KM/H`, `/KM`, `BPM`).

### Lists & Activity Feeds
- Edge-to-edge modular items separated by `space-sm` gaps rather than thin hairlines.
- Each item features a left-aligned circular activity icon (with orange kinetic speed trails), followed by run title, date, and a right-aligned compact two-column summary of Distance and Pace.

### Inputs & Sliders
- Input fields use pill or `1rem` rounded corners with `#121417` fills and 1.5px `#1E2229` borders. Focused inputs snap to a vibrant `#FF5722` border glow.
- Distance & Goal Sliders feature a 6px thick track in dark slate with active progress painted in `#FF5722` and an oversized 24px circular thumb.

### Workout HUD & Metrics Dock
- Specialized persistent docking container pinned to the bottom screen during activity tracking. Encapsulates elapsed duration, heart rate zone, and pause/lap controls inside a high-density, sweat-resistant tap layout.