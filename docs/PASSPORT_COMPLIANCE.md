# Feature: Passport Compliance & Country Presets

This document tracks the tasks and specifications for passport photo compliance rules and country presets.

## Tasks
- [ ] Define standard dimensions for country presets (USA: 2x2 in, India: 3.5x4.5 cm, etc.).
- [ ] Add client-side visual crop guidelines and overlays on the Editor Page.
- [ ] Enforce face proportion logic (e.g., face height must cover 70-80% of the image height).
- [ ] Show warnings or instructions if the crop does not comply with the selected preset guidelines.

## Accessibility (WCAG 2.1 AA) Compliance
- High Contrast Mode toggle mapping yellow/black borders for low-vision users.
- Visible focus rings (:focus-visible) on all interactive editor controls.
- Dynamic font scaling with aria-pressed states and ARIA regions on toolbars.
