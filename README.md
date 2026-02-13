# time
LineCal v1.0 — Minimal Linear Calendar / Day Planner

Features & Behaviors:

- Mobile-first, linear daily list for each month
- Month navigation via left/right arrows with year rollover
- Single day selection only
  • Today auto-selected in current month
  • Day 1 auto-selected in other months
- Today highlight:
  • Subtle background tint
  • Stacks with selected day
  • Only visible in current real month
- Event addition:
  • Floating + button opens inline input panel
  • Input panel inline, bottom-fixed, keyboard auto-focus
  • Save / Enter adds event
  • Empty input ignored
  • Prefix override supported: "12 Meeting" → 12th of month
  • Input panel closes on save or outside click
  • Panel closes on month change
- Event display:
  • Vertical stacked events
  • Subtle indentation, no bullets
  • Tight spacing: 4px between events, 8–12px between days
  • Wrapping enabled, no truncation
  • Delete button visible only for selected day
- Event deletion:
  • Tap ✕ → confirmation prompt
  • On confirm → remove event, delete date key if empty
  • No gestures, no bulk delete
- Rendering:
  • Flat DOM structure, all days/events generated dynamically
  • Selected day class = .selected
  • Today highlight class = .today
  • Scroll to selected day (optional polish)
- Data persistence:
  • Stored in localStorage under "lineCalData"
  • Only days with events are stored
- Minimalist UI consistent with Task Tool / Private Journal:
  • Calm color scheme
  • No modals, overlays, dropdowns
  • Flat, readable, lightweight
